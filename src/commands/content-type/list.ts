import Command from '../command'
import {flags} from '@contentstack/cli-command'
import cli from 'cli-ux'
import buildOutput from '../../core/content-type/list'

export default class ListCommand extends Command {
  static description = 'list all Content Types in a Stack';

  static examples = [
    '$ csdx content-type:list -s "xxxxxxxxxxxxxxxxxxx"',
    '$ csdx content-type:list -a "management token"',
    '$ csdx content-type:list -a "management token" -o modified',
  ];

  static flags = {
    stack: flags.string({
      char: 's',
      description: 'stack uid',
      required: false,
      exclusive: ['token-alias'],
      multiple: false,
    }),

    'token-alias': flags.string({
      char: 'a',
      description: 'management token alias',
      required: false,
    }),

    order: flags.string({
      char: 'o',
      description: 'order by column',
      required: false,
      options: ['title', 'modified'],
      default: 'title',
    }),
  }

  async run() {
    try {
      const {flags} = this.parse(ListCommand)
      this.setup(flags)

      cli.action.start(Command.RequestDataMessage)

      const [stack, contentTypes] = await Promise.all([
        this.client.getStack(this.apiKey),
        this.client.getContentTypes(this.apiKey, false),
      ])

      cli.action.stop()

      const output = buildOutput(contentTypes, flags.order)
      this.printOutput(output, 'Content Types', null, stack.name)
    } catch (error) {
      this.error(error, {exit: 1, suggestions: error.suggestions})
    }
  }
}
