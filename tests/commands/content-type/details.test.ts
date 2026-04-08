jest.mock('@contentstack/cli-command', () => ({
  Command: class {
    log = jest.fn()
    error = jest.fn()
    warn = jest.fn()
  },
}))

jest.mock('@contentstack/cli-utilities', () => ({
  managementSDKClient: jest.fn().mockResolvedValue({}),
  cliux: {
    loaderV2: jest.fn().mockReturnValue({}),
    print: jest.fn(),
  },
  flags: new Proxy(
    {},
    {
      get: (_t, prop) =>
        jest.fn((opts: Record<string, unknown>) => ({ ...opts, __f: String(prop) })),
    }
  ),
  printFlagDeprecation: jest.fn(() => () => undefined),
}))

jest.mock('../../../src/utils', () => ({
  getContentType: jest.fn(),
  getStack: jest.fn(),
}))

import { getContentType, getStack } from '../../../src/utils'
import DetailsCommand from '../../../src/commands/content-type/details'

describe('content-type:details', () => {
  it('prints details with references', async () => {
    ;(getStack as jest.Mock).mockResolvedValue({ name: 'St' })
    ;(getContentType as jest.Mock).mockResolvedValue({
      _version: 1,
      created_at: '2020-01-01',
      description: 'D',
      options: {},
      schema: [],
      title: 'T',
      uid: 'ct',
      updated_at: '2021-01-01',
    })

    const cmd = new DetailsCommand([], {} as any)
    ;(cmd as any).cmaHost = 'https://api.contentstack.io'
    ;(cmd as any).context = { analyticsInfo: {} }
    ;(cmd as any).parse = jest.fn().mockResolvedValue({
      flags: { 'content-type': 'home', path: true, 'stack-api-key': 'k' },
    })
    ;(cmd as any).setup = jest.fn().mockResolvedValue(undefined)
    ;(cmd as any).apiKey = 'k'
    ;(cmd as any).contentTypeManagementClient = {}
    ;(cmd as any).client = {
      getContentTypeReferences: jest.fn().mockResolvedValue({
        references: ['r1'],
      }),
    }
    ;(cmd as any).printOutput = jest.fn()

    await cmd.run()

    expect(cmd.printOutput).toHaveBeenCalledWith(
      expect.objectContaining({ hasResults: false }),
      'details',
      'home',
      'St'
    )
  })

  it('calls error when getContentType fails', async () => {
    ;(getStack as jest.Mock).mockResolvedValue({ name: 'St' })
    ;(getContentType as jest.Mock).mockRejectedValue(new Error('not found'))

    const cmd = new DetailsCommand([], {} as any)
    ;(cmd as any).cmaHost = 'https://api.contentstack.io'
    ;(cmd as any).context = { analyticsInfo: {} }
    ;(cmd as any).parse = jest.fn().mockResolvedValue({
      flags: { 'content-type': 'home', path: true, 'stack-api-key': 'k' },
    })
    ;(cmd as any).setup = jest.fn().mockResolvedValue(undefined)
    ;(cmd as any).apiKey = 'k'
    ;(cmd as any).contentTypeManagementClient = {}
    ;(cmd as any).client = {
      getContentTypeReferences: jest.fn().mockResolvedValue({ references: [] }),
    }

    await cmd.run()

    expect(cmd.error).toHaveBeenCalledWith('not found', {
      exit: 1,
      suggestions: undefined,
    })
  })
})
