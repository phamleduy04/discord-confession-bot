import type { Interaction } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { Event } from '../interfaces';
import { getConfession, updateConfession } from '../Database';

export const event: Event = {
    name: 'interactionCreate',
    run: async (client, interaction: Interaction) => {
        if (interaction.isCommand()) {
            const cmd = client.slash.get(interaction.commandName);
            if (!cmd) return;
            cmd.run(client, interaction);
        }

        if (interaction.isButton()) {
            const message = await interaction.channel?.messages.fetch(interaction.message.id);
            const confession = await getConfession(interaction.message.id);
            switch(interaction.customId) {
                case 'duyet': {
                    const cfsChannel = interaction.guild?.channels.cache.get('982655789695127592');
                    if (cfsChannel?.type !== 'GUILD_TEXT') return;
                    const confessionEmbed = new MessageEmbed(interaction.message.embeds[0])
                        .setFooter({ text: 'Trả lời confession ở dưới' })
                    const cfs = await cfsChannel.send({ embeds: [confessionEmbed] });
                    const cfsThread = await cfs.startThread({ name: `Rep cfs ${confession.id}`, autoArchiveDuration: 'MAX' });
                    cfsThread.send('Bạn có thể trả lời confession tại đây!');

                    await updateConfession({
                        ...confession,
                        reviewedBy: interaction.user.id,
                        reviewedAt: new Date(),
                        status: 'approved',
                        messageID: cfs.id,
                        threadID: cfsThread.id,
                    });

                    if (message?.editable) message.edit({ components: [], content: `Duyệt bởi: ${interaction.user}`, allowedMentions: { repliedUser: false }});
                    const author = await interaction.guild?.members.fetch(confession.author);
                    await author?.send(`Confession #${confession.id} của bạn đã được duyệt!`).catch(() => null);
                    break;
                }

                case 'tuchoi': {
                    if (message?.editable) message.edit({ components: [], content: `Bỏ qua bởi: ${interaction.user}`, allowedMentions: { repliedUser: false }});
                    await updateConfession({
                        ...confession,
                        reviewedBy: interaction.user.id,
                        reviewedAt: new Date(),
                        status: 'rejected',
                    });
                }
            }
        }
    }
}