import { Message, Collection, EmbedBuilder, ButtonBuilder, ButtonStyle,  ActionRowBuilder, ChannelType } from 'discord.js';
import { Event } from '../interfaces';
import { getConfessionCount, pushConfession } from '../Database';
import Client from '../Client';

export const event: Event = {
    name: 'messageCreate',
    run: async (client: Client, message: Message) => {
        if (message.channel.type === ChannelType.GuildStageVoice) return;
        if (message.author.bot) return;
        const guild = client.guilds.cache.get(process.env.GUILD_ID || '');
        const isInGuild = await guild?.members.fetch(message.author.id);

        if (!isInGuild || (isInGuild instanceof Collection)) return message.channel.send('Bạn đang không trong server!');
        
        if (message.channel.type === ChannelType.DM) {
            const noidung = message.content;
            let cfsCount = (await getConfessionCount()) || 0;
            cfsCount++;

            const embed = new EmbedBuilder()
                .setTitle(`Confession #${cfsCount}`)
                .setDescription(noidung)
                .setColor('Aqua')
                .setTimestamp()
                .setFooter({ text: 'Nhấn các nút ở dưới để duyệt/từ chối confession!'});

            const button1 = new ButtonBuilder()
                .setCustomId('duyet')
                .setEmoji('✅')
                .setLabel('Duyệt cfs')
                .setStyle(ButtonStyle.Success)
            
            const button2 = new ButtonBuilder()
                .setCustomId('tuchoi')
                .setEmoji('❌')
                .setLabel('Từ chối cfs')
                .setStyle(ButtonStyle.Secondary)
            
            const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents([button1, button2]);

            const reviewChannel = guild?.channels.cache.get(process.env.REVIEW_CONFESSION_CHANNEL || '');
            if (reviewChannel?.type === ChannelType.GuildText) {
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