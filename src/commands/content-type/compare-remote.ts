import Command from '../../core/command'
import {flags} from '@contentstack/cli-command'
import cli from 'cli-ux'
import buildOutput from '../../core/content-type/compare'

export default class CompareRemoteCommand extends Command {
  static description = 'compare two Content Types on different Stacks';

  static examples = [
    '$ csdx content-type:compare-remote -o "xxxxxxxxxxxxxxxxxxx" -r "xxxxxxxxxxxxxxxxxxx" -c "home_page"',
  ];

  static flags = {
    'origin-stack': flags.string({
      char: 'o',
      description: 'origin Stack UID',
      required: true,
      dependsOn: ['remote-stack'],
    }),

    'remote-stack': flags.string({
      char: 'r',
      description: 'remote Stack UID',
      required: true,
      dependsOn: ['origin-stack'],
    }),

    'content-type': flags.string({
      char: 'c',
      description: 'Content Type UID',
      required: true,
    }),
  }

  async run() {
    try {
      const {flags} = this.parse(CompareRemoteCommand)
      this.setup({'token-alias': undefined, stack: flags['origin-stack']})

      cli.action.start(Command.RequestDataMessage)

      const originStackApi = flags['origin-stack'] as string
      const remoteStackApi = flags['remote-stack'] as string

      const [originStackResp, remoteStackResp, originContentTypeResp, remoteContentTypeResp] = await Promise.all([
        this.client.getStack(originStackApi),
        this.client.getStack(remoteStackApi),
        this.client.getContentType(originStackApi, flags['content-type'], true),
        this.client.getContentType(remoteStackApi, flags['content-type'], true),
      ])

      cli.action.stop()

      const output = await buildOutput(flags['content-type'], originContentTypeResp, remoteContentTypeResp)
      this.printOutput(output, 'changes', flags['content-type'], `${originStackResp.name} <-> ${remoteStackResp.name}`)
    } catch (error) {
      this.error(error, {exit: 1, suggestions: error.suggestions})
    }
  }
}
