import Command from '../../core/command'
import {flags} from '@contentstack/cli-command'
import cli from 'cli-ux'
import {createDiagram, CreateDiagramOptions, DiagramOrientation} from '../../core/content-type/diagram'

export default class DiagramCommand extends Command {
  static description = 'create a visual diagram of a Stack\'s Content Types';

  static examples = [
    '$ csdx content-type:diagram -s "xxxxxxxxxxxxxxxxxxx" -o "content-model.svg"',
    '$ csdx content-type:diagram -a "management token" -o "content-model.svg"',
    '$ csdx content-type:diagram -a "management token" -o "content-model.svg" -d "landscape"',
    '$ csdx content-type:diagram -a "management token" -o "content-model.dot" -t "dot"',
  ];

  static flags = {
    stack: flags.string({
      char: 's',
      description: 'Stack UID',
      required: false,
      exclusive: ['token-alias'],
      multiple: false,
    }),

    'token-alias': flags.string({
      char: 'a',
      description: 'management token alias',
      required: false,
    }),

    output: flags.string({
      char: 'o',
      description: 'full path to output',
      hidden: false,
      multiple: false,
      required: true,
    }),

    direction: flags.string({
      char: 'd',
      description: 'graph orientation',
      default: 'portrait',
      options: ['portrait', 'landscape'],
      hidden: false,
      multiple: false,
      required: true,
    }),

    type: flags.string({
      char: 't',
      description: 'graph output file type',
      default: 'svg',
      options: ['svg', 'dot'],
      hidden: false,
      multiple: false,
      required: true,
    }),
  }

  async run() {
    try {
      const {flags} = this.parse(DiagramCommand)
      this.setup(flags)

      const outputPath = flags.output

      if (!outputPath || !outputPath.trim()) {
        this.error('Please provide an output path.', {exit: 2})
      }

      cli.action.start(Command.RequestDataMessage)

      const [stack, contentTypes, globalFields] = await Promise.all([
        this.client.getStack(this.apiKey),
        this.client.getContentTypes(this.apiKey, false),
        this.client.getGlobalFields(this.apiKey),
      ])

      cli.action.stop()

      const diagramOptions: CreateDiagramOptions = {
        stackName: stack.name,
        contentTypes: contentTypes.content_types,
        globalFields: globalFields.global_fields,
        outputFileName: outputPath,
        outputFileType: flags.type,
        style: {
          orientation: flags.direction === 'portrait' ? DiagramOrientation.Portrait : DiagramOrientation.Landscape,
        },
      }

      const output = await createDiagram(diagramOptions)
      this.log(`Created Graph: ${output.outputPath}`)
    } catch (error) {
      this.error(error, {exit: 1, suggestions: error.suggestions})
    }
  }
}
