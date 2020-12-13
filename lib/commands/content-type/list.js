"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = tslib_1.__importDefault(require("../command"));
const cli_command_1 = require("@contentstack/cli-command");
const list_1 = tslib_1.__importDefault(require("../../core/content-type/list"));
class ListCommand extends command_1.default {
    async run() {
        try {
            const { flags } = this.parse(ListCommand);
            this.setup(flags);
            const [stack, contentTypes] = await Promise.all([
                this.client.getStack(this.apiKey),
                this.client.getContentTypes(this.apiKey, false),
            ]);
            const output = list_1.default(contentTypes, flags.order);
            this.log(`Displaying Content Types for '${stack.name}.'\n`);
            if (output.hasRows) {
                this.log(output.body);
                this.log(output.footer);
            }
            else {
                this.log('No Content Types found.');
            }
        }
        catch (error) {
            this.error(error, { exit: 1, suggestions: error.suggestions });
        }
    }
}
exports.default = ListCommand;
ListCommand.description = 'list all Content Types in a Stack';
ListCommand.examples = [
    '$ csdx content-type:list -s "xxxxxxxxxxxxxxxxxxx"',
    '$ csdx content-type:list -a "management token"',
    '$ csdx content-type:list -a "management token" -o modified',
];
ListCommand.flags = {
    stack: cli_command_1.flags.string({
        char: 's',
        description: 'stack uid',
        required: false,
        exclusive: ['token-alias'],
        multiple: false,
    }),
    'token-alias': cli_command_1.flags.string({
        char: 'a',
        description: 'management token alias',
        required: false,
    }),
    order: cli_command_1.flags.string({
        char: 'o',
        description: 'order by column',
        required: false,
        options: ['title', 'modified'],
        default: 'title',
    }),
};
