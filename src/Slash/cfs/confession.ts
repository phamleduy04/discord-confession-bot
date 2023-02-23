import type { Slash } from "../../interfaces";
import { Collection, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ApplicationCommandType, ApplicationCommandOptionType, ChannelType } from 'discord.js';
import { getConfessionCount, pushConfession } from '../../Database';

export const slash: Slash = {
    name: 'confession',
    description: 'Tạo confession',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: 'noidung',
            description: 'Nội dung confession',
            required: true,
        }
    ],
    run: async (client, interaction) => {
        if (!interaction.isChatInputCommand()) return;
        const guild = client.guilds.cache.get(process.env.GUILD_ID || '');
        const isInGuild = await guild?.members.fetch(interaction.user.id);
        if (!isInGuild || (isInGuild instanceof Collection)) return interaction.reply('Bạn đang không trong server!');

        const noidung = interaction.options.getString('noidung') || 'N/A';

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
                author: interaction.user.id,
                content: noidung,
                reviewMessageID: msg.id,
                createdAt: new Date(),
                reviewedAt: null,
                reviewedBy:null,
                status: 'pending',
                messageID: null,
                threadID: null,
            });

            interaction.reply({ content: `Confession #${cfsCount} của bạn đang chờ duyệt!`, ephemeral: true });  
        }
    }
}