"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cli_command_1 = require("@contentstack/cli-command");
const client_1 = tslib_1.__importDefault(require("../core/contentstack/client"));
class ContentTypeCommand extends cli_command_1.Command {
    setup(flags) {
        if (!this.authToken) {
            this.error('You need to login, first. See: auth:login --help', { exit: 2, suggestions: ['https://www.contentstack.com/docs/developers/cli/authentication/'] });
        }
        if (!flags['token-alias'] && !flags.stack) {
            this.error('You must provide either a token alias or a Stack UID.', { exit: 2 });
        }
        if (flags['token-alias']) {
            const token = this.getToken(flags['token-alias']);
            if (token.type !== 'management') {
                this.warn('Possibly using a delivery token. You may not be able to connect to your Stack. Please use a management token.');
            }
            this.apiKey = token.apiKey;
        }
        else {
            this.apiKey = flags.stack;
        }
        this.client = new client_1.default(this.cmaHost, this.authToken);
    }
}
exports.default = ContentTypeCommand;
