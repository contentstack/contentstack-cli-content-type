import {Command} from '@contentstack/cli-command'
import {configHandler, cliux} from '@contentstack/cli-utilities'
import {BuildOutput} from '../types'
import ContentstackClient from './contentstack/client'

export default class ContentTypeCommand extends Command {
  protected static RequestDataMessage = 'Requesting data';

  protected apiKey!: string;

  protected client!: ContentstackClient;

  protected contentTypeManagementClient: any;

  setup(flags: any) {
    const authToken = configHandler.get('authtoken');
    if (!authToken) {
      this.error('You need to login, first. See: auth:login --help', {exit: 2, suggestions: ['https://www.contentstack.com/docs/developers/cli/authentication/']})
    }
    const stackAPIKey = flags.stack || flags["stack-api-key"]
    const mTokenAlias = flags['token-alias'] || flags.alias

    if (!mTokenAlias && !stackAPIKey) {
      cliux.print('Error: You must provide either a token alias or a Stack UID.', {"color": "red"});
      process.exit(1);
    }

    if (mTokenAlias) {
      const token = this.getToken(mTokenAlias)

      if (token.type !== 'management') {
        cliux.print('Possibly using a delivery token. You may not be able to connect to your Stack. Please use a management token.', {"color": "yellow"})
      }

      this.apiKey = token.apiKey
    } else {
      this.apiKey = flags.stackAPIKey as string
    }

    this.client = new ContentstackClient(this.cmaHost, authToken)
  }

  printOutput(output: BuildOutput, who: string, what: string | null, where: string) {
    this.log(`Requested ${who}${what ? ` for '${what}' ` : ' '}on '${where}.'`)

    if (output.hasResults) {
      if (output.header) {
        this.log(output.header)
      }

      if (output.body) {
        this.log(output.body)
      }

      if (output.footer) {
        this.log(output.footer)
      }
    } else {
      this.log(`No ${who} found.`)
    }
  }

  async run() {

  }
}
