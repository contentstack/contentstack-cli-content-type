jest.mock('@contentstack/cli-command', () => ({
  Command: class Command {
    log = jest.fn()
    error = jest.fn()
    warn = jest.fn()
    getToken(_alias: string) {
      return { apiKey: 'default-api', type: 'management' }
    }
  },
}))

jest.mock('@contentstack/cli-utilities', () => ({
  authenticationHandler: {
    accessToken: 'auth-token',
    getAuthDetails: jest.fn(),
  },
  cliux: {
    print: jest.fn(),
  },
}))

import { authenticationHandler, cliux } from '@contentstack/cli-utilities'

import ContentTypeCommand from '../../src/core/command'
import ContentstackClient from '../../src/core/contentstack/client'

jest.mock('../../src/core/contentstack/client', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(function ContentstackClientMock(
    this: { host: string; token: string },
    host: string,
    token: string
  ) {
    this.host = host
    this.token = token
  }),
}))

describe('ContentTypeCommand', () => {
  let cmd: ContentTypeCommand

  function makeCmd() {
    const c = Object.create(ContentTypeCommand.prototype) as ContentTypeCommand
    c.log = jest.fn()
    ;(c as any).cmaHost = 'https://api.contentstack.io'
    c.error = jest.fn() as any
    return c
  }

  beforeEach(() => {
    jest.clearAllMocks()
    cmd = makeCmd()
    ;(authenticationHandler.getAuthDetails as jest.Mock).mockResolvedValue(undefined)
    ;(authenticationHandler as any).accessToken = 'auth-token'
  })

  describe('printOutput', () => {
    it('logs header, body, footer when hasResults', () => {
      cmd.printOutput(
        {
          body: 'B',
          footer: 'F',
          hasResults: true,
          header: 'H',
          rows: [],
        },
        'Audit Logs',
        'ct-uid',
        'StackName'
      )
      expect(cmd.log).toHaveBeenCalledWith(
        expect.stringContaining("Requested Audit Logs for 'ct-uid' on 'StackName.'")
      )
      expect(cmd.log).toHaveBeenCalledWith('H')
      expect(cmd.log).toHaveBeenCalledWith('B')
      expect(cmd.log).toHaveBeenCalledWith('F')
    })

    it('omits what when null', () => {
      cmd.printOutput(
        {
          body: 'B',
          footer: null,
          hasResults: true,
          header: null,
          rows: [],
        },
        'Content Types',
        null,
        'S'
      )
      expect(cmd.log).toHaveBeenCalledWith(
        expect.stringContaining('Requested Content Types on')
      )
    })

    it('logs no results when hasResults false', () => {
      cmd.printOutput(
        {
          body: '',
          footer: null,
          hasResults: false,
          header: null,
          rows: [],
        },
        'things',
        null,
        'S'
      )
      expect(cmd.log).toHaveBeenCalledWith('No things found.')
    })
  })

  describe('setup', () => {
    it('errors when not logged in', async () => {
      ;(authenticationHandler as any).accessToken = undefined
      await cmd.setup({ 'stack-api-key': 'k' })
      expect(cmd.error).toHaveBeenCalledWith(
        expect.stringContaining('not logged in'),
        expect.objectContaining({ exit: 2 })
      )
    })

    it('exits when no token alias and no stack key', async () => {
      const exitSpy = jest
        .spyOn(process, 'exit')
        .mockImplementation((code?: string | number | null) => {
          throw new Error(`exit:${code}`)
        })
      try {
        await expect(cmd.setup({})).rejects.toThrow('exit:1')
        expect(cliux.print).toHaveBeenCalledWith(
          expect.stringContaining('token alias or a stack UID'),
          { color: 'red' }
        )
      } finally {
        exitSpy.mockRestore()
      }
    })

    it('sets apiKey from stack-api-key and constructs client', async () => {
      await cmd.setup({ 'stack-api-key': 'stack-key-1' })
      expect((cmd as any).apiKey).toBe('stack-key-1')
      expect(ContentstackClient).toHaveBeenCalledWith(
        'https://api.contentstack.io',
        'auth-token'
      )
    })

    it('sets apiKey from alias token and warns on delivery token', async () => {
      jest.spyOn(cmd, 'getToken').mockReturnValue({
        apiKey: 'from-token',
        type: 'delivery',
      } as any)
      await cmd.setup({ alias: 'my-alias' })
      expect((cmd as any).apiKey).toBe('from-token')
      expect(cliux.print).toHaveBeenCalledWith(
        expect.stringContaining('delivery token'),
        { color: 'yellow' }
      )
    })

    it('sets apiKey from management token alias without warning', async () => {
      jest.spyOn(cmd, 'getToken').mockReturnValue({
        apiKey: 'mgmt-key',
        type: 'management',
      } as any)
      await cmd.setup({ alias: 'm' })
      expect((cmd as any).apiKey).toBe('mgmt-key')
      expect(cliux.print).not.toHaveBeenCalledWith(
        expect.stringContaining('delivery token'),
        expect.anything()
      )
    })
  })

  describe('run', () => {
    it('logs the default content-type command message', async () => {
      await cmd.run()
      expect(cmd.log).toHaveBeenCalledWith('content type command')
    })
  })
})
