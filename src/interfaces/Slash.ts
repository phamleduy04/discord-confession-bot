import Client from '../Client';
import { CommandInteraction, ApplicationCommandData } from 'discord.js';

interface Run {
    (client: Client, interaction: CommandInteraction): any;
}

export type Slash = ApplicationCommandData & {
    name: string;
    run: Run;
}