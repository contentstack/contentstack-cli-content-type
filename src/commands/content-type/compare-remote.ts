import Command from "../../core/command";
import {
  flags,
  FlagInput,
  managementSDKClient,
  cliux,
  printFlagDeprecation,
} from "@contentstack/cli-utilities";
import buildOutput from "../../core/content-type/compare";
import { getStack, getContentType } from "../../utils";

export default class CompareRemoteCommand extends Command {
  static description = "compare two Content Types on different Stacks";

  static examples = [
    '$ csdx content-type:compare-remote --origin-stack "xxxxxxxxxxxxxxxxxxx" --remote-stack "xxxxxxxxxxxxxxxxxxx" -content-type "home_page"',
  ];

  static flags: any = {
    "origin-stack": flags.string({
      char: "o",
      description: "Origin Stack API Key",
      required: true,
      dependsOn: ["remote-stack"],
      parse: printFlagDeprecation(["-o"], ["--remote-stack"]),
    }),

    "remote-stack": flags.string({
      char: "r",
      description: "Remote Stack API Key",
      required: true,
      dependsOn: ["origin-stack"],
      parse: printFlagDeprecation(["-r"], ["--remote-stack"]),
    }),

    "content-type": flags.string({
      char: "c",
      description: "Content Type UID",
      required: true,
      parse: printFlagDeprecation(["-c"], ["--content-type"]),
    }),
  };

  async run() {
    try {
      const { flags } = await this.parse(CompareRemoteCommand);
      await this.setup({ alias: undefined, stack: flags["origin-stack"] });
      this.contentTypeManagementClient = await managementSDKClient({
        host: this.cmaHost,
        "X-CS-CLI": this.context?.analyticsInfo,
      });

      const originStackApi = flags["origin-stack"] as string;
      const remoteStackApi = flags["remote-stack"] as string;

      if (originStackApi === remoteStackApi) {
        this.warn(
          "You cannot compare the same stack. Please choose different stacks to compare."
        );
      }

      const spinner = cliux.loaderV2(Command.RequestDataMessage);

      const [
        originStackResp,
        remoteStackResp,
        originContentTypeResp,
        remoteContentTypeResp,
      ] = await Promise.all([
        getStack(this.contentTypeManagementClient, originStackApi, spinner),
        getStack(this.contentTypeManagementClient, remoteStackApi, spinner),
        getContentType({
          managementSdk: this.contentTypeManagementClient,
          apiKey: originStackApi,
          uid: flags["content-type"],
          spinner,
        }),
        getContentType({
          managementSdk: this.contentTypeManagementClient,
          apiKey: remoteStackApi,
          uid: flags["content-type"],
          spinner,
        }),
      ]);

      cliux.loaderV2("", spinner);

      const output = await buildOutput(
        flags["content-type"],
        originContentTypeResp,
        remoteContentTypeResp
      );
      this.printOutput(
        output,
        "changes",
        flags["content-type"],
        `${originStackResp.name} <-> ${remoteStackResp.name}`
      );
    } catch (error: any) {
      this.error(error?.message || "An error occurred.", {
        exit: 1,
        suggestions: error.suggestions,
      });
    }
  }
}
