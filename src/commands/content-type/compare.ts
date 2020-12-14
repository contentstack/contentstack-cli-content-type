import Command from '../../core/command'
import {flags} from '@contentstack/cli-command'
import cli from 'cli-ux'
import buildOutput from '../../core/content-type/compare'

export default class CompareCommand extends Command {
  static description = 'compare two Content Type versions';

  static examples = [
    '$ csdx content-type:compare -s "xxxxxxxxxxxxxxxxxxx" -c "home_page"',
    '$ csdx content-type:compare -s "xxxxxxxxxxxxxxxxxxx" -c "home_page" -l # -r #',
    '$ csdx content-type:compare -a "management token" -c "home_page" -l # -r #',
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
      hidden: false,
      multiple: false,
      required: false,
    }),

    'content-type': flags.string({
      char: 'c',
      description: 'Content Type UID',
      required: true,
    }),

    left: flags.integer({
      char: 'l',
      description: 'Content Type version, i.e. prev version',
      required: false,
      dependsOn: ['right'],
    }),

    right: flags.integer({
      char: 'r',
      description: 'Content Type version, i.e. later version',
      required: false,
      dependsOn: ['left'],
    }),
  }

  async run() {
    try {
      const {flags} = this.parse(CompareCommand)
      this.setup(flags)

      cli.action.start(Command.RequestDataMessage)

      if (!flags.left) {
        const discovery = await this.client.getContentType(this.apiKey, flags['content-type'], false)
        const version = discovery.content_type._version

        flags.left = version
        flags.right = version > 1 ? version - 1 : version

        this.log(`Comparing versions: ${flags.left} <-> ${flags.right}.`)
      }

      const [stack, previous, current] = await Promise.all([
        this.client.getStack(this.apiKey),
        this.client.getContentType(this.apiKey, flags['content-type'], true, flags.left),
        this.client.getContentType(this.apiKey, flags['content-type'], true, flags.right),
      ])

      cli.action.stop()

      const output = await buildOutput(flags['content-type'], previous, current)
      this.printOutput(output, 'changes', flags['content-type'], stack.name)

      if (flags.left && flags.left === flags.right) {
        this.warn('Comparing the same version does not produce useful results.')
      }
    } catch (error) {
      this.error(error, {exit: 1, suggestions: error.suggestions})
    }
  }
}
