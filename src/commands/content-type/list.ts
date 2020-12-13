import Command from '../command'
import {flags} from '@contentstack/cli-command'
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

      const [stack, contentTypes] = await Promise.all([
        this.client.getStack(this.apiKey),
        this.client.getContentTypes(this.apiKey, false),
      ])

      const output = buildOutput(contentTypes, flags.order)

      this.log(`Displaying Content Types for '${stack.name}.'\n`)

      if (output.hasRows) {
        this.log(output.body)
        this.log(output.footer)
      } else {
        this.log('No Content Types found.')
      }
    } catch (error) {
      this.error(error, {exit: 1, suggestions: error.suggestions})
    }
  }
}
