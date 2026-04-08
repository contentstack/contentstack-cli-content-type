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

jest.mock('../../../src/core/content-type/compare', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    body: 'Please check the browser output.',
    footer: null,
    hasResults: true,
    header: null,
    rows: [],
  }),
}))

import { getContentType, getStack } from '../../../src/utils'
import CompareRemoteCommand from '../../../src/commands/content-type/compare-remote'

describe('content-type:compare-remote', () => {
  it('compares content types across two stacks', async () => {
    ;(getStack as jest.Mock)
      .mockResolvedValueOnce({ name: 'Origin' })
      .mockResolvedValueOnce({ name: 'Remote' })
    ;(getContentType as jest.Mock)
      .mockResolvedValueOnce({ uid: 'ct' })
      .mockResolvedValueOnce({ uid: 'ct' })

    const cmd = new CompareRemoteCommand([], {} as any)
    ;(cmd as any).cmaHost = 'https://api.contentstack.io'
    ;(cmd as any).context = { analyticsInfo: {} }
    ;(cmd as any).parse = jest.fn().mockResolvedValue({
      flags: {
        'content-type': 'home',
        'origin-stack': 'orig-key',
        'remote-stack': 'rem-key',
      },
    })
    ;(cmd as any).setup = jest.fn().mockResolvedValue(undefined)
    ;(cmd as any).apiKey = 'orig-key'
    ;(cmd as any).contentTypeManagementClient = {}
    ;(cmd as any).printOutput = jest.fn()
    ;(cmd as any).warn = jest.fn()

    await cmd.run()

    expect(getStack).toHaveBeenCalledTimes(2)
    expect(cmd.printOutput).toHaveBeenCalledWith(
      expect.anything(),
      'changes',
      'home',
      'Origin <-> Remote'
    )
  })

  it('warns when origin and remote stacks are identical', async () => {
    ;(getStack as jest.Mock).mockResolvedValue({ name: 'S' })
    ;(getContentType as jest.Mock).mockResolvedValue({ uid: 'ct' })

    const cmd = new CompareRemoteCommand([], {} as any)
    ;(cmd as any).cmaHost = 'https://api.contentstack.io'
    ;(cmd as any).context = { analyticsInfo: {} }
    ;(cmd as any).parse = jest.fn().mockResolvedValue({
      flags: {
        'content-type': 'home',
        'origin-stack': 'same',
        'remote-stack': 'same',
      },
    })
    ;(cmd as any).setup = jest.fn().mockResolvedValue(undefined)
    ;(cmd as any).apiKey = 'same'
    ;(cmd as any).contentTypeManagementClient = {}
    ;(cmd as any).printOutput = jest.fn()
    ;(cmd as any).warn = jest.fn()

    await cmd.run()

    expect(cmd.warn).toHaveBeenCalledWith(
      expect.stringContaining('same stack')
    )
  })

  it('calls error when getStack fails', async () => {
    ;(getStack as jest.Mock).mockRejectedValue(new Error('offline'))

    const cmd = new CompareRemoteCommand([], {} as any)
    ;(cmd as any).cmaHost = 'https://api.contentstack.io'
    ;(cmd as any).context = { analyticsInfo: {} }
    ;(cmd as any).parse = jest.fn().mockResolvedValue({
      flags: {
        'content-type': 'home',
        'origin-stack': 'a',
        'remote-stack': 'b',
      },
    })
    ;(cmd as any).setup = jest.fn().mockResolvedValue(undefined)
    ;(cmd as any).apiKey = 'a'
    ;(cmd as any).contentTypeManagementClient = {}

    await cmd.run()

    expect(cmd.error).toHaveBeenCalledWith('offline', {
      exit: 1,
      suggestions: undefined,
    })
  })
})
