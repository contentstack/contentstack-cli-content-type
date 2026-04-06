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
  getUsers: jest.fn(),
}))

import { getContentType, getStack, getUsers } from '../../../src/utils'
import AuditCommand from '../../../src/commands/content-type/audit'

describe('content-type:audit', () => {
  it('loads audit logs and prints output', async () => {
    ;(getContentType as jest.Mock).mockResolvedValueOnce({ _version: 1, uid: 'ct' })
    ;(getStack as jest.Mock).mockResolvedValue({ name: 'St' })
    ;(getUsers as jest.Mock).mockResolvedValue([
      { first_name: 'A', last_name: 'B', uid: 'u1' },
    ])

    const cmd = new AuditCommand([], {} as any)
    ;(cmd as any).cmaHost = 'https://api.contentstack.io'
    ;(cmd as any).context = { analyticsInfo: {} }
    ;(cmd as any).parse = jest.fn().mockResolvedValue({
      flags: { 'content-type': 'home', 'stack-api-key': 'k' },
    })
    ;(cmd as any).setup = jest.fn().mockResolvedValue(undefined)
    ;(cmd as any).apiKey = 'k'
    ;(cmd as any).contentTypeManagementClient = {}
    ;(cmd as any).client = {
      getContentTypeAuditLogs: jest.fn().mockResolvedValue({
        logs: [
          {
            created_at: '2020-01-01T00:00:00.000Z',
            created_by: 'u1',
            event_type: 'save',
            metadata: { version: 1 },
          },
        ],
      }),
    }
    ;(cmd as any).printOutput = jest.fn()

    await cmd.run()

    expect(getContentType).toHaveBeenCalled()
    expect((cmd as any).client.getContentTypeAuditLogs).toHaveBeenCalled()
    expect(cmd.printOutput).toHaveBeenCalledWith(
      expect.objectContaining({ hasResults: true }),
      'Audit Logs',
      'home',
      'St'
    )
  })

  it('calls error when getStack fails', async () => {
    ;(getContentType as jest.Mock).mockResolvedValueOnce({ uid: 'ct' })
    ;(getStack as jest.Mock).mockRejectedValue(new Error('network'))

    const cmd = new AuditCommand([], {} as any)
    ;(cmd as any).cmaHost = 'https://api.contentstack.io'
    ;(cmd as any).context = { analyticsInfo: {} }
    ;(cmd as any).parse = jest.fn().mockResolvedValue({
      flags: { 'content-type': 'home', 'stack-api-key': 'k' },
    })
    ;(cmd as any).setup = jest.fn().mockResolvedValue(undefined)
    ;(cmd as any).apiKey = 'k'
    ;(cmd as any).contentTypeManagementClient = {}
    ;(cmd as any).client = {
      getContentTypeAuditLogs: jest.fn().mockResolvedValue({ logs: [] }),
    }

    await cmd.run()

    expect(cmd.error).toHaveBeenCalledWith('network', {
      exit: 1,
      suggestions: undefined,
    })
  })
})
