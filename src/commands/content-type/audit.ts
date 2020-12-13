import Command from '../command'
import {flags} from '@contentstack/cli-command'
import buildOutput from '../../core/content-type/audit'

export default class AuditCommand extends Command {
  static description = 'display Audit Logs for recent changes to a Content Type';

  static examples = [
    '$ csdx content-type:audit -s "xxxxxxxxxxxxxxxxxxx" -c "home_page"',
    '$ csdx content-type:audit -a "management token" -c "home_page"',
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
      const {flags} = this.parse(AuditCommand)
      this.setup(flags)

      const [stack, audit, users] = await Promise.all([
        this.client.getStack(this.apiKey),
        this.client.getContentTypeAuditLogs(this.apiKey, flags['content-type']),
        this.client.getUsers(this.apiKey),
      ])

      const output = buildOutput(audit.logs, users)
      this.printOutput(output, 'Audit Logs', flags['content-type'], stack.name)
    } catch (error) {
      this.error(error, {exit: 1, suggestions: error.suggestions})
    }
  }
}
