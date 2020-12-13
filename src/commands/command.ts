import {Command} from '@contentstack/cli-command'
import ContentstackClient from '../core/contentstack/client'

export default class ContentTypeCommand extends Command {
    protected apiKey!: string;

    protected client!: ContentstackClient;

    setup(flags: any) {
      if (!this.authToken) {
        this.error('You need to login, first. See: auth:login --help', {exit: 2, suggestions: ['https://www.contentstack.com/docs/developers/cli/authentication/']})
      }

      if (!flags['token-alias'] && !flags.stack) {
        this.error('You must provide either a token alias or a Stack UID.', {exit: 2})
      }

      if (flags['token-alias']) {
        const token = this.getToken(flags['token-alias'])

        if (token.type !== 'management') {
          this.warn('Possibly using a delivery token. You may not be able to connect to your Stack. Please use a management token.')
        }

        this.apiKey = token.apiKey
      } else {
        this.apiKey = flags.stack as string
      }

      this.client = new ContentstackClient(this.cmaHost, this.authToken)
    }
}
