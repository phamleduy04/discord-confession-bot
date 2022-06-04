import type { Command } from '../../interfaces';

export const command: Command = {
    name: 'ping',
    description: 'Ping!',
    aliases: ['p'],
    usage: 'ping',
    run: async (client, message, args) => {
        message.reply(`Pong! ${client.ws.ping.toString()}ms`);
    },
};