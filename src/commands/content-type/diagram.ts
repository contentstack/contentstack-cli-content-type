import Command from '../../core/command'
import {flags} from '@contentstack/cli-command'
import cli from 'cli-ux'
import buildOutput from '../../core/content-type/list'

export default class DiagramCommand extends Command {
  static description = 'create a visual diagram of a Stack\'s Content Types';

  static examples = [
    '$ csdx content-type:diagram -s "xxxxxxxxxxxxxxxxxxx"',
    '$ csdx content-type:diagram -a "management token"',
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
    })
  }

  async run() {
    try {
      const {flags} = this.parse(DiagramCommand)
      this.setup(flags)

      cli.action.start(Command.RequestDataMessage)

      const [stack, contentTypes, globalFields] = await Promise.all([
        this.client.getStack(this.apiKey),
        this.client.getContentTypes(this.apiKey, false),
        this.client.getGlobalFields(this.apiKey)
      ])

      cli.action.stop()

      console.log(globalFields);

    } catch (error) {
      this.error(error, {exit: 1, suggestions: error.suggestions})
    }
  }
}
