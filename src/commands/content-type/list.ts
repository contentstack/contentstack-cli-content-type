import Command from "../../core/command";
import {
  flags,
  FlagInput,
  managementSDKClient,
  cliux,
  printFlagDeprecation,
} from "@contentstack/cli-utilities";
import buildOutput from "../../core/content-type/list";
import { getStack, getContentTypes } from "../../utils";

export default class ListCommand extends Command {
  static description = "List all Content Types in a Stack";

  static examples = [
    '$ csdx content-type:list --stack-api-key "xxxxxxxxxxxxxxxxxxx"',
    '$ csdx content-type:list --alias "management token"',
    '$ csdx content-type:list --alias "management token" --order modified',
  ];

  static flags: any = {
    stack: flags.string({
      char: "s",
      description: "Stack UID",
      exclusive: ["token-alias", "alias"],
      parse: printFlagDeprecation(["-s", "--stack"], ["-k", "--stack-api-key"]),
    }),

    "stack-api-key": flags.string({
      char: "k",
      description: "Stack API Key",
      exclusive: ["token-alias", "alias"],
    }),

    "token-alias": flags.string({
      char: "a",
      description: "Management token alias",
      parse: printFlagDeprecation(["--token-alias"], ["-a", "--alias"]),
    }),

    alias: flags.string({
      char: "a",
      description: "Alias of the management token",
    }),

    order: flags.string({
      char: "o",
      description: "order by column",
      options: ["title", "modified"],
      default: "title",
      parse: printFlagDeprecation(["-o"], ["--order"]),
    }),
  };

  async run() {
    try {
      const { flags } = await this.parse(ListCommand);
      await this.setup(flags);
      this.contentTypeManagementClient = await managementSDKClient({
        host: this.cmaHost,
        "X-CS-CLI": this.context?.analyticsInfo,
      });

      const spinner = cliux.loaderV2(Command.RequestDataMessage);

      const [stack, contentTypes] = await Promise.all([
        getStack(this.contentTypeManagementClient, this.apiKey, spinner),
        getContentTypes(this.contentTypeManagementClient, this.apiKey, spinner),
      ]);

      cliux.loaderV2("", spinner);

      const output = buildOutput(contentTypes, flags.order);
      this.printOutput(output, "Content Types", null, stack.name);
    } catch (error: any) {
      this.error(error?.message || "An error occurred.", {
        exit: 1,
        suggestions: error.suggestions,
      });
    }
  }
}
