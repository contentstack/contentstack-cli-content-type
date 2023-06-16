import Command from '../../core/command'
import { flags, FlagInput, managementSDKClient, cliux, printFlagDeprecation } from '@contentstack/cli-utilities'
import buildOutput from '../../core/content-type/list'
import { getStack, getContentTypes } from '../../utils'

export default class ListCommand extends Command {
  static description = 'List all Content Types in a Stack'

  static examples = [
    '$ csdx content-type:list -k "xxxxxxxxxxxxxxxxxxx"',
    '$ csdx content-type:list -a "management token"',
    '$ csdx content-type:list -a "management token" -o modified'
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

    order: flags.string({
      char: 'o',
      description: 'order by column',
      required: false,
      options: ['title', 'modified'],
      default: 'title'
    })
  }

  async run() {
    try {
      const { flags } = await this.parse(ListCommand)
      this.setup(flags)
      this.contentTypeManagementClient = await managementSDKClient({
        host: this.cmaHost
      })

      const spinner = cliux.loaderV2(Command.RequestDataMessage)

      const [stack, contentTypes] = await Promise.all([
        getStack(this.contentTypeManagementClient, this.apiKey, spinner),
        getContentTypes(this.contentTypeManagementClient, this.apiKey, spinner)
      ])

      cliux.loaderV2('', spinner)

      const output = buildOutput(contentTypes, flags.order)
      this.printOutput(output, 'Content Types', null, stack.name)
    } catch (error: any) {
      this.error(error, { exit: 1, suggestions: error.suggestions })
    }
  }
}
