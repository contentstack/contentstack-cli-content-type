"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = tslib_1.__importDefault(require("../command"));
const cli_command_1 = require("@contentstack/cli-command");
const audit_1 = tslib_1.__importDefault(require("../../core/content-type/audit"));
class AuditCommand extends command_1.default {
    async run() {
        try {
            const { flags } = this.parse(AuditCommand);
            this.setup(flags);
            const [stack, audit, users] = await Promise.all([
                this.client.getStack(this.apiKey),
                this.client.getContentTypeAuditLogs(this.apiKey, flags['content-type']),
                this.client.getUsers(this.apiKey),
            ]);
            this.log(`Displaying audit logs for '${flags['content-type']}' on '${stack.name}.'\n`);
            const output = audit_1.default(audit.logs, users);
            if (output.hasRows) {
                this.log(output.body);
            }
            else {
                this.log('No audit logs found.');
            }
        }
        catch (error) {
            this.error(error, { exit: 1, suggestions: error.suggestions });
        }
    }
}
exports.default = AuditCommand;
AuditCommand.description = 'display audit logs for recent changes to a Content Type';
AuditCommand.examples = [
    '$ csdx content-type:audit -s "xxxxxxxxxxxxxxxxxxx" -c "home_page"',
    '$ csdx content-type:audit -a "management token" -c "home_page"',
];
AuditCommand.flags = {
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
