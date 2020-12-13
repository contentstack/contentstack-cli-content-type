"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = tslib_1.__importDefault(require("../command"));
const cli_command_1 = require("@contentstack/cli-command");
const compare_1 = tslib_1.__importDefault(require("../../core/content-type/compare"));
class CompareCommand extends command_1.default {
    async run() {
        try {
            const { flags } = this.parse(CompareCommand);
            this.setup(flags);
            const [stack, previous, current] = await Promise.all([
                this.client.getStack(this.apiKey),
                this.client.getContentType(this.apiKey, flags['content-type'], true, flags.left),
                this.client.getContentType(this.apiKey, flags['content-type'], true, flags.right),
            ]);
            this.log(`Displaying details for '${flags['content-type']}' on '${stack.name}.'`);
            await compare_1.default(flags['content-type'], previous, current);
        }
        catch (error) {
            this.error(error, { exit: 1, suggestions: error.suggestions });
        }
    }
}
exports.default = CompareCommand;
CompareCommand.description = 'compare two Content Type versions';
CompareCommand.examples = [
    '$ csdx content-type:compare -s "xxxxxxxxxxxxxxxxxxx" -c "home_page"',
    '$ csdx content-type:compare -s "xxxxxxxxxxxxxxxxxxx" -c "home_page" -left # -right #',
    '$ csdx content-type:compare -a "management token" -c "home_page" -left # -right #',
];
CompareCommand.flags = {
    stack: cli_command_1.flags.string({
        char: 's',
        description: 'stack uid',
        required: false,
        exclusive: ['token-alias'],
    }),
    'token-alias': cli_command_1.flags.string({
        char: 'a',
        description: 'management token alias',
        hidden: false,
        multiple: false,
        required: false,
    }),
    'content-type': cli_command_1.flags.string({
        char: 'c',
        description: 'Content Type UID',
        required: true,
    }),
    left: cli_command_1.flags.integer({
        char: 'l',
        description: 'previous Content Type version',
        required: true,
    }),
    right: cli_command_1.flags.integer({
        char: 'r',
        description: 'current Content Type version',
        required: true,
    }),
};
