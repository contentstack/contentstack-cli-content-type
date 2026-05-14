import Command from "../../core/command";
import {
  flags,
  managementSDKClient,
  cliux,
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
    "stack-api-key": flags.string({
      char: "k",
      description: "Stack API Key",
      exclusive: ["alias"],
    }),

    alias: flags.string({
      char: "a",
      description: "Alias of the management token",
      exclusive: ["stack-api-key"],
    }),

    order: flags.string({
      description: "order by column",
      options: ["title", "modified"],
      default: "title",
    }),
  };

  async run() {
    try {
      const { flags } = await this.parse(ListCommand);
      this.contentTypeManagementClient = await managementSDKClient({
        host: this.cmaHost,
        "X-CS-CLI": this.context?.analyticsInfo,
      });
      await this.setup(flags);

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
