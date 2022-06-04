import Client from '../Client';
import { Message, PermissionResolvable, Snowflake } from 'discord.js';

interface Run {
    (client: Client, message: Message, args: Snowflake[]): any;
}

export interface Command {
    name: string;
    description?: string;
    aliases?: string[];
    usage?: string;
    permissions?: PermissionResolvable[];
    run: Run;
}