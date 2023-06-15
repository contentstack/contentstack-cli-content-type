import Command from '../../core/command'
import { flags, FlagInput, managementSDKClient, cliux, printFlagDeprecation } from '@contentstack/cli-utilities'
import buildOutput from '../../core/content-type/audit'
import { getStack, getUsers } from '../../utils'

export default class AuditCommand extends Command {
  static description = 'Display recent changes to a Content Type'

  static examples = [
    '$ csdx content-type:audit -k "xxxxxxxxxxxxxxxxxxx" -c "home_page"',
    '$ csdx content-type:audit -a "management token" -c "home_page"'
  ]

  static flags: FlagInput = {
    stack: flags.string({
      char: 's',
      description: 'Stack UID',
      exclusive: ['token-alias', 'alias'],
      parse: printFlagDeprecation(['-s', '--stack'], ['-k', '--stack-api-key'])
    }),

    'stack-api-key': flags.string({
      char: 'k',
      description: 'Stack API Key',
      exclusive: ['token-alias', 'alias']
    }),

    'token-alias': flags.string({
      char: 'a',
      description: 'Management token alias',
      parse: printFlagDeprecation(['--token-alias'], ['-a', '--alias'])
    }),

    alias: flags.string({
      char: 'a',
      description: 'Alias of the management token'
    }),

    'content-type': flags.string({
      char: 'c',
      description: 'Content Type UID',
      required: true
    })
  }

  async run() {
    try {
      const { flags } = await this.parse(AuditCommand)
      this.setup(flags)
      this.contentTypeManagementClient = await managementSDKClient({
        host: this.cmaHost
      })

      const spinner = cliux.loaderV2(Command.RequestDataMessage)

      const [stack, audit, users] = await Promise.all([
        getStack(this.contentTypeManagementClient, this.apiKey, spinner),
        this.client.getContentTypeAuditLogs(this.apiKey, flags['content-type'], spinner),
        getUsers(this.contentTypeManagementClient, this.apiKey, spinner)
      ])

      cliux.loaderV2('', spinner)

      const output = buildOutput(audit.logs, users)
      this.printOutput(output, 'Audit Logs', flags['content-type'], stack.name)
    } catch (error: any) {
      this.error(error, { exit: 1, suggestions: error.suggestions })
    }
  }
}
