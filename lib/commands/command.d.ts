import { Command } from '@contentstack/cli-command';
import ContentstackClient from '../core/contentstack/client';
export default class ContentTypeCommand extends Command {
    protected apiKey: string;
    protected client: ContentstackClient;
    setup(flags: any): void;
}
