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
  getContentTypes: jest.fn(),
  getStack: jest.fn(),
}))

import { getContentTypes, getStack } from '../../../src/utils'
import ListCommand from '../../../src/commands/content-type/list'

describe('content-type:list', () => {
  it('fetches stack and content types and prints output', async () => {
    ;(getStack as jest.Mock).mockResolvedValue({ name: 'Stack One' })
    ;(getContentTypes as jest.Mock).mockResolvedValue([
      { _version: 1, title: 'A', uid: 'a', updated_at: '2020-01-01T00:00:00.000Z' },
    ])

    const cmd = new ListCommand([], {} as any)
    ;(cmd as any).cmaHost = 'https://api.contentstack.io'
    ;(cmd as any).context = { analyticsInfo: {} }
    ;(cmd as any).parse = jest.fn().mockResolvedValue({
      flags: { order: 'title', 'stack-api-key': 'key1' },
    })
    ;(cmd as any).setup = jest.fn().mockResolvedValue(undefined)
    ;(cmd as any).apiKey = 'key1'
    ;(cmd as any).printOutput = jest.fn()

    await cmd.run()

    expect(getStack).toHaveBeenCalled()
    expect(getContentTypes).toHaveBeenCalled()
    expect(cmd.printOutput).toHaveBeenCalledWith(
      expect.objectContaining({ hasResults: true }),
      'Content Types',
      null,
      'Stack One'
    )
  })

  it('calls error when a dependency rejects', async () => {
    ;(getStack as jest.Mock).mockRejectedValue(new Error('stack failed'))
    ;(getContentTypes as jest.Mock).mockResolvedValue([])

    const cmd = new ListCommand([], {} as any)
    ;(cmd as any).cmaHost = 'https://api.contentstack.io'
    ;(cmd as any).context = { analyticsInfo: {} }
    ;(cmd as any).parse = jest.fn().mockResolvedValue({
      flags: { order: 'title', 'stack-api-key': 'key1' },
    })
    ;(cmd as any).setup = jest.fn().mockResolvedValue(undefined)
    ;(cmd as any).apiKey = 'key1'

    await cmd.run()

    expect(cmd.error).toHaveBeenCalledWith('stack failed', {
      exit: 1,
      suggestions: undefined,
    })
  })
})
