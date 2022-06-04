import type { Slash } from "../../interfaces";
import { Collection, MessageEmbed, MessageButton, MessageActionRow } from 'discord.js';
import { getConfessionCount, pushConfession } from '../../Database';

export const slash: Slash = {
    name: 'confession',
    description: 'Tạo confession',
    type: 'CHAT_INPUT',
    options: [
        {
            type: 'STRING',
            name: 'noidung',
            description: 'Nội dung confession',
            required: true,
        }
    ],
    run: async (client, interaction) => {
        const guild = client.guilds.cache.get('954143786114646016');
        const isInGuild = await guild?.members.fetch(interaction.user.id);
        if (!isInGuild || (isInGuild instanceof Collection)) return interaction.reply('Bạn đang không trong server!');

        const noidung = interaction.options.getString('noidung') || 'N/A';

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