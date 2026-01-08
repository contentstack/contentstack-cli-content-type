import { Command } from "@contentstack/cli-command";
import { cliux, authenticationHandler } from "@contentstack/cli-utilities";
import { BuildOutput } from "../types";
import ContentstackClient from "./contentstack/client";

export default class ContentTypeCommand extends Command {
  protected static RequestDataMessage = "Requesting data";

  protected apiKey!: string;

  protected client!: ContentstackClient;

  protected contentTypeManagementClient: any;

  async setup(flags: any) {
    await authenticationHandler.getAuthDetails();
    const authToken = authenticationHandler.accessToken;
    if (!authToken) {
      this.error(
        "You're not logged in. Run auth:login to sign in. Use auth:login --help for more details.",
        {
          exit: 2,
          suggestions: [
            "https://www.contentstack.com/docs/developers/cli/authentication/",
          ],
        }
      );
    }
    const stackAPIKey = flags.stack || flags["stack-api-key"];
    const mTokenAlias = flags["token-alias"] || flags.alias;

    if (!mTokenAlias && !stackAPIKey) {
      cliux.print(
        "Error: You must provide either a token alias or a stack UID.",
        { color: "red" }
      );
      process.exit(1);
    }

    if (mTokenAlias) {
      const token = this.getToken(mTokenAlias);

      if (token.type !== "management") {
        cliux.print(
          "Connection failed. You might be using a delivery token. Use a management token to connect to your stack.",
          { color: "yellow" }
        );
      }

      this.apiKey = token.apiKey;
    } else {
      this.apiKey = stackAPIKey as string;
    }

    this.client = new ContentstackClient(this.cmaHost, authToken);
  }

  printOutput(
    output: BuildOutput,
    who: string,
    what: string | null,
    where: string
  ) {
    this.log(`Requested ${who}${what ? ` for '${what}' ` : " "}on '${where}.'`);
    this.log("------\n");

    if (output.hasResults) {
      if (output.header) {
        this.log(output.header);
      }

      if (output.body) {
        this.log(output.body);
      }

      if (output.footer) {
        this.log(output.footer);
      }
    } else {
      this.log(`No ${who} found.`);
    }
  }

  async run() {
    this.log("content type command");
  }
}
