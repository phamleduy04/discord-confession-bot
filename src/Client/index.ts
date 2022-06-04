import { Client, Collection } from 'discord.js';
import 'dotenv/config';
import type { Command, Event, Slash } from '../interfaces';
import path from 'path';
import { readdirSync } from 'fs';

class Bot extends Client {
    public commands: Collection<string, Command> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public slash: Collection<string, Slash> = new Collection();
    public aliases: Collection<string, string> = new Collection();

    public constructor() {
        super({
            intents: 32767,
            partials: ['CHANNEL'],
            allowedMentions: { repliedUser: true },
        });
    }

    public async init() {
        this.login(process.env.TOKEN);

        //Event Handler
        const eventPath = path.join(__dirname, '..', 'Events');
        readdirSync(eventPath).forEach(async file => {
            const { event } = await import(`${eventPath}/${file}`);
            this.events.set(event.name, event);
            this.on(event.name, event.run.bind(null, this));
        });

        // Command Handler
        const commandPath = path.join(__dirname, '..', 'Commands');
        readdirSync(commandPath).forEach(dir => {
            const commands = readdirSync(`${commandPath}/${dir}`).filter(file => file.endsWith('.js') || file.endsWith('.ts'));
            commands.forEach(async file => {
                const { command } = await import(`${commandPath}/${dir}/${file}`);
                this.commands.set(command.name, command);

                if (command?.aliases && command.aliases.length !== 0) {
                    command.aliases.forEach((alias: string) => {
                        this.aliases.set(alias, command.name);
                    });
                };
            })
        });

        // Slash Handler
        const slashCommands: Slash[] = [];
        const slashPath = path.join(__dirname, '..', 'Slash');
        readdirSync(slashPath).forEach(dir => {
            const slash = readdirSync(`${slashPath}/${dir}`).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

            slash.forEach(async file => {
                const { slash } = await import(`${slashPath}/${dir}/${file}`);
                this.slash.set(slash.name, slash);
                slashCommands.push(slash);
            });
        });

        this.once('ready', async () => {
            await this.application?.commands.set(slashCommands);
            console.log(`Bot is ready! ${this.user?.tag}`);
        });
    }


}

export default Bot;