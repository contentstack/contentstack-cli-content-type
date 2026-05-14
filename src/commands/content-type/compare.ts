import Command from '../../core/command'
import { flags, managementSDKClient, cliux } from '@contentstack/cli-utilities'
import buildOutput from '../../core/content-type/compare'
import { getStack, getContentType } from '../../utils'

export default class CompareCommand extends Command {
  static description = 'Compare two Content Type versions'

  static examples = [
    '$ csdx content-type:compare --stack-api-key "xxxxxxxxxxxxxxxxxxx" --content-type "home_page"',
    '$ csdx content-type:compare --stack-api-key "xxxxxxxxxxxxxxxxxxx" --content-type "home_page" --left # --right #',
    '$ csdx content-type:compare --alias "management token" --content-type "home_page" --left # --right #'
  ]

  static flags: any = {
    'stack-api-key': flags.string({
      char: 'k',
      description: 'Stack API Key',
      exclusive: ['alias']
    }),

    alias: flags.string({
      char: 'a',
      description: 'Alias of the management token',
      exclusive: ['stack-api-key']
    }),

    'content-type': flags.string({
      description: 'Content Type UID',
      required: true
    }),

    left: flags.integer({
      description: 'Content Type version, i.e. prev version',
      dependsOn: ['right']
    }),

    right: flags.integer({
      description: 'Content Type version, i.e. later version',
      dependsOn: ['left']
    })
  }

  async run() {
    try {
      const { flags } = await this.parse(CompareCommand)
      this.setup(flags)
      this.contentTypeManagementClient = await managementSDKClient({
        host: this.cmaHost,
        'X-CS-CLI': this.context?.analyticsInfo
      })

      if (!flags.left) {
        const spinner1 = cliux.loaderV2(Command.RequestDataMessage)
        const discovery = await getContentType({
          managementSdk: this.contentTypeManagementClient,
          apiKey: this.apiKey,
          uid: flags['content-type'],
          spinner: spinner1
        })
        const version = discovery._version

        flags.left = version
        flags.right = version > 1 ? version - 1 : version
        cliux.loaderV2('', spinner1)
        this.log(`Comparing versions: ${flags.left} <-> ${flags.right}.`)
      }

      const spinner = cliux.loaderV2(Command.RequestDataMessage)

      const [stack, previous, current] = await Promise.all([
        getStack(this.contentTypeManagementClient, this.apiKey, spinner),
        getContentType({
          managementSdk: this.contentTypeManagementClient,
          apiKey: this.apiKey,
          uid: flags['content-type'],
          ctVersion: flags.left,
          spinner
        }),
        getContentType({
          managementSdk: this.contentTypeManagementClient,
          apiKey: this.apiKey,
          uid: flags['content-type'],
          ctVersion: flags.right,
          spinner
        })
      ])

      cliux.loaderV2('', spinner)

      const output = await buildOutput(flags['content-type'], previous, current)
      this.printOutput(output, 'changes', flags['content-type'], stack.name)

      if (flags.left && flags.left === flags.right) {
        this.warn('You cannot compare the same version. Please select different versions to compare.')
      }
    } catch (error: any) {
      this.error(error?.message || 'An error occurred.', { exit: 1, suggestions: error.suggestions })
    }
  }
}
