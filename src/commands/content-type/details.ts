import Command from '../command'
import {flags} from '@contentstack/cli-command'
import buildOutput from '../../core/content-type/details'

export default class DetailsCommand extends Command {
  static description = 'display Content Type details';

  static examples = [
    '$ csdx content-type:details -s "xxxxxxxxxxxxxxxxxxx" -c "home_page"',
    '$ csdx content-type:details -a "management token" -c "home_page"',
  ];

  static flags = {
    stack: flags.string({
      char: 's',
      description: 'stack uid',
      required: false,
      exclusive: ['token-alias'],
    }),

    'token-alias': flags.string({
      char: 'a',
      description: 'management token alias',
      required: false,
      multiple: false,
    }),

    'content-type': flags.string({
      char: 'c',
      description: 'Content Type UID',
      required: true,
    }),
  }

  async run() {
    try {
      const {flags} = this.parse(DetailsCommand)
      this.setup(flags)

      const [stack, contentType, references] = await Promise.all([
        this.client.getStack(this.apiKey),
        this.client.getContentType(this.apiKey, flags['content-type'], true),
        this.client.getContentTypeReferences(this.apiKey, flags['content-type']),
      ])

      const output = buildOutput(contentType, references)
      this.printOutput(output, 'details', flags['content-type'], stack.name)
    } catch (error) {
      this.error(error, {exit: 1, suggestions: error.suggestions})
    }
  }
}
