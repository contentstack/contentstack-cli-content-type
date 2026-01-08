import Command from "../../core/command";
import {
  flags,
  FlagInput,
  managementSDKClient,
  cliux,
  printFlagDeprecation,
} from "@contentstack/cli-utilities";
import { createDiagram } from "../../core/content-type/diagram";
import { CreateDiagramOptions, DiagramOrientation } from "../../types";
import { getStack, getContentTypes, getGlobalFields } from "../../utils";

export default class DiagramCommand extends Command {
  static description = "Create a visual diagram of a Stack's Content Types";

  static examples = [
    '$ csdx content-type:diagram --stack-api-key "xxxxxxxxxxxxxxxxxxx" --output "content-model.svg"',
    '$ csdx content-type:diagram --alias "management token" --output "content-model.svg"',
    '$ csdx content-type:diagram --alias "management token" --output "content-model.svg" --direction "landscape"',
    '$ csdx content-type:diagram --alias "management token" --output "content-model.dot" --type "dot"',
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

    output: flags.string({
      char: "o",
      description: "full path to output",
      hidden: false,
      multiple: false,
      required: true,
      parse: printFlagDeprecation(["-o"], ["--output"]),
    }),

    direction: flags.string({
      char: "d",
      description: "graph orientation",
      default: "portrait",
      options: ["portrait", "landscape"],
      hidden: false,
      multiple: false,
      required: true,
      parse: printFlagDeprecation(["-d"], ["--direction"]),
    }),

    type: flags.string({
      char: "t",
      description: "graph output file type",
      default: "svg",
      options: ["svg", "dot"],
      hidden: false,
      multiple: false,
      required: true,
      parse: printFlagDeprecation(["-t"], ["--type"]),
    }),
  };

  async run() {
    try {
      const { flags } = await this.parse(DiagramCommand);
      this.contentTypeManagementClient = await managementSDKClient({
        host: this.cmaHost,
        "X-CS-CLI": this.context?.analyticsInfo,
      });
      this.setup(flags);

      const outputPath = flags.output;

      if (!outputPath?.trim()) {
        this.error("Please provide an output path.", { exit: 2 });
      }

      const spinner = cliux.loaderV2(Command.RequestDataMessage);

      const [stack, contentTypes, globalFields] = await Promise.all([
        getStack(this.contentTypeManagementClient, this.apiKey, spinner),
        getContentTypes(this.contentTypeManagementClient, this.apiKey, spinner),
        getGlobalFields(this.contentTypeManagementClient, this.apiKey, spinner),
      ]);

      cliux.loaderV2("", spinner);

      const diagramOptions: CreateDiagramOptions = {
        stackName: stack.name,
        contentTypes: contentTypes,
        globalFields: globalFields,
        outputFileName: outputPath,
        outputFileType: flags.type,
        style: {
          orientation:
            flags.direction === "portrait"
              ? DiagramOrientation.Portrait
              : DiagramOrientation.Landscape,
        },
      };

      const output = await createDiagram(diagramOptions);
      this.log(`Created Graph: ${output.outputPath}`);
    } catch (error: any) {
      this.error(error?.message || "An error occurred.", {
        exit: 1,
        suggestions: error.suggestions,
      });
    }
  }
}
