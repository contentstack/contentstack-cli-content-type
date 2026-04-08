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

import buildOutputCore from '../../../src/core/content-type/compare'
import { getContentType, getStack } from '../../../src/utils'
import CompareCommand from '../../../src/commands/content-type/compare'

describe('content-type:compare', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('compares two versions when left and right are set', async () => {
    ;(getStack as jest.Mock).mockResolvedValue({ name: 'St' })
    ;(getContentType as jest.Mock)
      .mockResolvedValueOnce({ uid: 'ct', updated_at: '2020' })
      .mockResolvedValueOnce({ uid: 'ct', updated_at: '2020' })

    const cmd = new CompareCommand([], {} as any)
    ;(cmd as any).cmaHost = 'https://api.contentstack.io'
    ;(cmd as any).context = { analyticsInfo: {} }
    ;(cmd as any).parse = jest.fn().mockResolvedValue({
      flags: {
        'content-type': 'home',
        left: 2,
        right: 3,
        'stack-api-key': 'k',
      },
    })
    ;(cmd as any).setup = jest.fn().mockResolvedValue(undefined)
    ;(cmd as any).apiKey = 'k'
    ;(cmd as any).contentTypeManagementClient = {}
    ;(cmd as any).printOutput = jest.fn()

    await cmd.run()

    expect(getContentType).toHaveBeenCalledTimes(2)
    expect(buildOutputCore).toHaveBeenCalled()
    expect(cmd.printOutput).toHaveBeenCalled()
  })

  it('discovers versions when left is omitted', async () => {
    ;(getStack as jest.Mock).mockResolvedValue({ name: 'St' })
    ;(getContentType as jest.Mock)
      .mockResolvedValueOnce({ _version: 4, uid: 'home' })
      .mockResolvedValueOnce({ uid: 'home', v: 4 })
      .mockResolvedValueOnce({ uid: 'home', v: 3 })

    const cmd = new CompareCommand([], {} as any)
    ;(cmd as any).cmaHost = 'https://api.contentstack.io'
    ;(cmd as any).context = { analyticsInfo: {} }
    ;(cmd as any).parse = jest.fn().mockResolvedValue({
      flags: { 'content-type': 'home', 'stack-api-key': 'k' },
    })
    ;(cmd as any).setup = jest.fn().mockResolvedValue(undefined)
    ;(cmd as any).apiKey = 'k'
    ;(cmd as any).contentTypeManagementClient = {}
    ;(cmd as any).printOutput = jest.fn()
    ;(cmd as any).log = jest.fn()

    await cmd.run()

    expect(getContentType).toHaveBeenCalled()
    expect(cmd.log).toHaveBeenCalledWith(expect.stringContaining('Comparing versions'))
  })

  it('warns when left and right versions are equal', async () => {
    ;(getStack as jest.Mock).mockResolvedValue({ name: 'St' })
    ;(getContentType as jest.Mock)
      .mockResolvedValueOnce({ uid: 'ct', updated_at: '2020' })
      .mockResolvedValueOnce({ uid: 'ct', updated_at: '2020' })

    const cmd = new CompareCommand([], {} as any)
    ;(cmd as any).cmaHost = 'https://api.contentstack.io'
    ;(cmd as any).context = { analyticsInfo: {} }
    ;(cmd as any).parse = jest.fn().mockResolvedValue({
      flags: {
        'content-type': 'home',
        left: 3,
        right: 3,
        'stack-api-key': 'k',
      },
    })
    ;(cmd as any).setup = jest.fn().mockResolvedValue(undefined)
    ;(cmd as any).apiKey = 'k'
    ;(cmd as any).contentTypeManagementClient = {}
    ;(cmd as any).printOutput = jest.fn()
    ;(cmd as any).warn = jest.fn()

    await cmd.run()

    expect(cmd.warn).toHaveBeenCalledWith(
      expect.stringContaining('same version')
    )
  })

  it('calls error when getStack fails', async () => {
    ;(getStack as jest.Mock).mockRejectedValue(new Error('fail'))

    const cmd = new CompareCommand([], {} as any)
    ;(cmd as any).cmaHost = 'https://api.contentstack.io'
    ;(cmd as any).context = { analyticsInfo: {} }
    ;(cmd as any).parse = jest.fn().mockResolvedValue({
      flags: {
        'content-type': 'home',
        left: 1,
        right: 2,
        'stack-api-key': 'k',
      },
    })
    ;(cmd as any).setup = jest.fn().mockResolvedValue(undefined)
    ;(cmd as any).apiKey = 'k'
    ;(cmd as any).contentTypeManagementClient = {}

    await cmd.run()

    expect(cmd.error).toHaveBeenCalledWith('fail', {
      exit: 1,
      suggestions: undefined,
    })
  })
})
