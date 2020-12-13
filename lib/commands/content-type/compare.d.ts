import Command from '../command';
import { flags } from '@contentstack/cli-command';
export default class CompareCommand extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        stack: flags.IOptionFlag<string | undefined>;
        'token-alias': flags.IOptionFlag<string | undefined>;
        'content-type': flags.IOptionFlag<string>;
        left: import("@oclif/parser/lib/flags").IOptionFlag<number>;
        right: import("@oclif/parser/lib/flags").IOptionFlag<number>;
    };
    run(): Promise<void>;
}
