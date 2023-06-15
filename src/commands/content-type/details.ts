import Command from "../../core/command";
import {
  flags,
  FlagInput,
  managementSDKClient,
  cliux,
  printFlagDeprecation
} from "@contentstack/cli-utilities";
import buildOutput from "../../core/content-type/details";
import { getStack, getContentType } from "../../utils/index";

export default class DetailsCommand extends Command {
  static description = "Display Content Type details";

  static examples = [
    '$ csdx content-type:details -k "xxxxxxxxxxxxxxxxxxx" -c "home_page"',
    '$ csdx content-type:details -a "management token" -c "home_page"',
    '$ csdx content-type:details -a "management token" -c "home_page" --no-path',
  ];

  static flags: FlagInput = {
    stack: flags.string({
      char: "s",
      description: "Stack UID",
      exclusive: ["token-alias"],
      parse: printFlagDeprecation(['-s', '--stack'], ['-k', '--stack-api-key']),
    }),

    "stack-api-key": flags.string({
      char: "k",
      description: "Stack API Key",
      exclusive: ["token-alias"]
    }),

    "token-alias": flags.string({
      char: "a",
      description: "Management token alias",
      parse: printFlagDeprecation(['--token-alias'], ['-a', '--alias']),
    }),

    alias: flags.string({
      char: 'a',
      description: 'Alias of the management token',
    }),

    "content-type": flags.string({
      char: "c",
      description: "Content Type UID",
      required: true,
    }),

    path: flags.boolean({
      char: "p",
      description: "show path column",
      default: true,
      allowNo: true,
    }),
  };

  async run() {
    try {
      const { flags } = await this.parse(DetailsCommand);
      this.setup(flags);
      this.contentTypeManagementClient = await managementSDKClient({
        host: this.cmaHost,
      });

      const spinner = cliux.loaderV2(Command.RequestDataMessage);

      const [stack, contentType, references] = await Promise.all([
        getStack(this.contentTypeManagementClient, this.apiKey, spinner),
        getContentType({
          managementSdk: this.contentTypeManagementClient,
          apiKey: this.apiKey,
          uid: flags["content-type"],
          spinner,
        }),
        this.client.getContentTypeReferences(
          this.apiKey,
          flags["content-type"],
          spinner
        ),
      ]);

      cliux.loaderV2("", spinner);

      const output = buildOutput(contentType, references, {
        showPath: flags.path,
      });
      this.printOutput(output, "details", flags["content-type"], stack.name);
    } catch (error: any) {
      this.error(error, { exit: 1, suggestions: error.suggestions });
    }
  }
}
