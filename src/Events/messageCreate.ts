import { Message, Collection, MessageEmbed, MessageButton, MessageActionRow } from 'discord.js';
import { Event } from '../interfaces';
import { getConfessionCount, pushConfession } from '../Database';
import Client from '../Client';

export const event: Event = {
    name: 'messageCreate',
    run: async (client: Client, message: Message) => {
        if (message.author.bot) return;
        const guild = client.guilds.cache.get('954143786114646016');
        const isInGuild = await guild?.members.fetch(message.author.id);

        if (!isInGuild || (isInGuild instanceof Collection)) return message.channel.send('Bạn đang không trong server!');
        
        if (message.channel.type === 'DM') {
            const noidung = message.content;
            let cfsCount = (await getConfessionCount()) || 0;
            cfsCount++;

            const embed = new MessageEmbed()
                .setTitle(`Confession #${cfsCount}`)
                .setDescription(noidung)
                .setColor('AQUA')
                .setTimestamp()
                .setFooter({ text: 'Nhấn các nút ở dưới để duyệt/từ chối confession!'});

            const button1 = new MessageButton()
                .setCustomId('duyet')
                .setEmoji('✅')
                .setLabel('Duyệt cfs')
                .setStyle('SUCCESS')
            
            const button2 = new MessageButton()
                .setCustomId('tuchoi')
                .setEmoji('❌')
                .setLabel('Từ chối cfs')
                .setStyle('SECONDARY')
            
            const actionRow = new MessageActionRow().addComponents([button1, button2]);

            const reviewChannel = guild?.channels.cache.get('982655776818618428');
            if (reviewChannel?.type === 'GUILD_TEXT') {
                const msg = await reviewChannel.send({ embeds: [embed], components: [actionRow]});
                await pushConfession({
                    id: cfsCount,
                    author: message.author.id,
                    content: noidung,
                    reviewMessageID: msg.id,
                    createdAt: new Date(),
                    reviewedAt: null,
                    reviewedBy:null,
                    status: 'pending',
                    messageID: null,
                    threadID: null,
                });

                message.channel.send({ content: `Confession #${cfsCount} của bạn đang chờ duyệt!`});  
            }
        }
        const prefix = '-';
        if (!message.content.startsWith(prefix)) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift()?.toLowerCase();
        if (!cmd || cmd.length === 0) return;
        const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd) || '');
        if (command) command.run(client, message, args);
    }
}