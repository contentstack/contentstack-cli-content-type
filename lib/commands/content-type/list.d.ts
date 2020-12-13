import Command from '../command';
import { flags } from '@contentstack/cli-command';
export default class ListCommand extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        stack: flags.IOptionFlag<string | undefined>;
        'token-alias': flags.IOptionFlag<string | undefined>;
        order: flags.IOptionFlag<string>;
    };
    run(): Promise<void>;
}
