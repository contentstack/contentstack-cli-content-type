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
  getGlobalFields: jest.fn(),
  getStack: jest.fn(),
}))

jest.mock('../../../src/core/content-type/diagram', () => ({
  createDiagram: jest.fn().mockResolvedValue({ outputPath: '/tmp/out.svg' }),
}))

import { createDiagram } from '../../../src/core/content-type/diagram'
import { getContentTypes, getGlobalFields, getStack } from '../../../src/utils'
import DiagramCommand from '../../../src/commands/content-type/diagram'

describe('content-type:diagram', () => {
  it('creates diagram file', async () => {
    ;(getStack as jest.Mock).mockResolvedValue({ name: 'StackName' })
    ;(getContentTypes as jest.Mock).mockResolvedValue([{ schema: [], title: 'A', uid: 'a' }])
    ;(getGlobalFields as jest.Mock).mockResolvedValue([])

    const cmd = new DiagramCommand([], {} as any)
    ;(cmd as any).cmaHost = 'https://api.contentstack.io'
    ;(cmd as any).context = { analyticsInfo: {} }
    ;(cmd as any).parse = jest.fn().mockResolvedValue({
      flags: {
        direction: 'portrait',
        output: 'out/model.svg',
        type: 'svg',
        'stack-api-key': 'k',
      },
    })
    ;(cmd as any).setup = jest.fn().mockResolvedValue(undefined)
    ;(cmd as any).apiKey = 'k'
    ;(cmd as any).contentTypeManagementClient = {}
    ;(cmd as any).log = jest.fn()

    await cmd.run()

    expect(createDiagram).toHaveBeenCalledWith(
      expect.objectContaining({
        outputFileName: 'out/model.svg',
        stackName: 'StackName',
      })
    )
    expect(cmd.log).toHaveBeenCalledWith(expect.stringContaining('Created Graph'))
  })

  it('errors when output path is blank', async () => {
    const cmd = new DiagramCommand([], {} as any)
    ;(cmd as any).cmaHost = 'https://api.contentstack.io'
    ;(cmd as any).context = { analyticsInfo: {} }
    ;(cmd as any).parse = jest.fn().mockResolvedValue({
      flags: {
        direction: 'portrait',
        output: '   ',
        type: 'svg',
        'stack-api-key': 'k',
      },
    })
    ;(cmd as any).setup = jest.fn().mockResolvedValue(undefined)
    ;(cmd as any).apiKey = 'k'
    ;(cmd as any).contentTypeManagementClient = {}
    ;(cmd as any).error = jest.fn()

    await cmd.run()

    expect(cmd.error).toHaveBeenCalledWith(
      expect.stringContaining('output path'),
      expect.objectContaining({ exit: 2 })
    )
  })

  it('calls error when createDiagram fails', async () => {
    ;(createDiagram as jest.Mock).mockRejectedValueOnce(new Error('graphviz failed'))
    ;(getStack as jest.Mock).mockResolvedValue({ name: 'StackName' })
    ;(getContentTypes as jest.Mock).mockResolvedValue([])
    ;(getGlobalFields as jest.Mock).mockResolvedValue([])

    const cmd = new DiagramCommand([], {} as any)
    ;(cmd as any).cmaHost = 'https://api.contentstack.io'
    ;(cmd as any).context = { analyticsInfo: {} }
    ;(cmd as any).parse = jest.fn().mockResolvedValue({
      flags: {
        direction: 'portrait',
        output: 'out/x.svg',
        type: 'svg',
        'stack-api-key': 'k',
      },
    })
    ;(cmd as any).setup = jest.fn().mockResolvedValue(undefined)
    ;(cmd as any).apiKey = 'k'
    ;(cmd as any).contentTypeManagementClient = {}

    await cmd.run()

    expect(cmd.error).toHaveBeenCalledWith('graphviz failed', {
      exit: 1,
      suggestions: undefined,
    })
  })
})
