"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = tslib_1.__importDefault(require("../command"));
const cli_command_1 = require("@contentstack/cli-command");
const details_1 = tslib_1.__importDefault(require("../../core/content-type/details"));
class DetailsCommand extends command_1.default {
    async run() {
        try {
            const { flags } = this.parse(DetailsCommand);
            this.setup(flags);
            const [stack, contentType, references] = await Promise.all([
                this.client.getStack(this.apiKey),
                this.client.getContentType(this.apiKey, flags['content-type'], true),
                this.client.getContentTypeReferences(this.apiKey, flags['content-type']),
            ]);
            this.log(`Displaying details for '${flags['content-type']}' on '${stack.name}.'`);
            const output = details_1.default(contentType, references);
            if (output.hasRows) {
                this.log(output.header);
                this.log(output.body);
            }
            else {
                this.log('No details found.');
            }
        }
        catch (error) {
            this.error(error, { exit: 1, suggestions: error.suggestions });
        }
    }
}
exports.default = DetailsCommand;
DetailsCommand.description = 'display Content Type details';
DetailsCommand.examples = [
    '$ csdx content-type:details -s "xxxxxxxxxxxxxxxxxxx" -c "home_page"',
    '$ csdx content-type:details -a "management token" -c "home_page"',
];
DetailsCommand.flags = {
    stack: cli_command_1.flags.string({
        char: 's',
        description: 'stack uid',
        required: false,
        exclusive: ['token-alias'],
    }),
    'token-alias': cli_command_1.flags.string({
        char: 'a',
        description: 'management token alias',
        required: false,
        multiple: false,
    }),
    'content-type': cli_command_1.flags.string({
        char: 'c',
        description: 'Content Type UID',
        required: true,
    }),
};
