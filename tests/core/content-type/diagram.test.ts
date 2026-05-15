jest.mock('node-graphviz', () => ({
  graphviz: {
    dot: jest.fn().mockResolvedValue('<svg xmlns="http://www.w3.org/2000/svg"/>'),
  },
}))

jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
}))

jest.mock('@contentstack/cli-utilities', () => ({
  sanitizePath: (p: string) => p,
}))

import fs from 'fs'
import { graphviz } from 'node-graphviz'

import { createDiagram } from '../../../src/core/content-type/diagram'
import { DiagramOrientation } from '../../../src/types'

describe('diagram createDiagram', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(graphviz.dot as jest.Mock).mockResolvedValue('<svg/>')
  })

  function options(overrides: Partial<Parameters<typeof createDiagram>[0]> = {}) {
    const contentTypes = [
      {
        schema: [
          {
            data_type: 'reference',
            display_name: 'Ref to other',
            mandatory: false,
            multiple: false,
            reference_to: ['other_ct'],
            uid: 'ref_field',
            unique: false,
          },
          {
            data_type: 'global_field',
            display_name: 'GF',
            mandatory: false,
            multiple: false,
            reference_to: 'global_uid',
            uid: 'gf_field',
            unique: false,
          },
          {
            data_type: 'group',
            display_name: 'Group',
            mandatory: false,
            multiple: false,
            schema: [
              {
                data_type: 'text',
                display_name: 'Nested',
                mandatory: true,
                multiple: false,
                uid: 'nested_text',
                unique: false,
              },
            ],
            uid: 'group1',
            unique: false,
          },
          {
            blocks: [
              {
                schema: [
                  {
                    data_type: 'number',
                    display_name: 'In block',
                    mandatory: false,
                    multiple: false,
                    uid: 'num1',
                    unique: false,
                  },
                ],
                title: 'Blk',
                uid: 'blk1',
                mandatory: false,
                multiple: false,
                unique: false,
              },
              {
                reference_to: 'gf_blk',
                title: 'Blk2',
                uid: 'blk2',
                mandatory: false,
                multiple: false,
                unique: false,
              },
            ],
            data_type: 'blocks',
            display_name: 'Modular',
            mandatory: false,
            multiple: false,
            uid: 'mod1',
            unique: false,
          },
        ],
        title: 'Blog',
        uid: 'blog',
      },
    ]

    const globalFields = [
      {
        schema: [
          {
            data_type: 'text',
            display_name: 'GText',
            mandatory: false,
            multiple: false,
            uid: 'g1',
            unique: false,
          },
        ],
        title: 'Global X',
        uid: 'gfx',
      },
    ]

    return {
      contentTypes,
      globalFields,
      outputFileName: 'out/model.svg',
      outputFileType: 'svg',
      stackName: 'My Stack',
      style: { orientation: DiagramOrientation.Portrait },
      ...overrides,
    }
  }

  it('writes dot output to resolved path and passes DOT to graphviz', async () => {
    const res = await createDiagram(options())

    expect(res.outputPath).toContain('out')
    expect(res.outputPath).toContain('model.svg')
    expect(fs.mkdirSync).toHaveBeenCalled()
    expect(fs.writeFileSync).toHaveBeenCalledWith(res.outputPath, '<svg/>')

    expect(graphviz.dot).toHaveBeenCalled()
    const dotArg = (graphviz.dot as jest.Mock).mock.calls[0][0] as string
    expect(dotArg).toContain('digraph content_model')
    expect(dotArg).toContain('My Stack')
    expect(dotArg).toContain('Blog')
    expect(dotArg).toContain('Global X')
    expect(dotArg).toContain('reference')
    expect(dotArg).toContain('global_field')
    expect(dotArg).toContain('LR')
  })

  it('uses landscape orientation when set', async () => {
    await createDiagram(
      options({
        style: { orientation: DiagramOrientation.Landscape },
      })
    )
    const dotArg = (graphviz.dot as jest.Mock).mock.calls[0][0] as string
    expect(dotArg).toContain('TD')
  })
})
