const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require("discord.js");
const moment = require("moment")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Get information about the server"),

    async execute(interaction) {
        const guild = interaction.guild;

        const iconSize = 4096;

        let textChannels = 0,
            voiceChannels = 0,
            categories = 0;

        const channelsList = await guild.channels.fetch();

        channelsList.forEach((channel) => {
            switch (channel.type) {
                case ChannelType.GuildVoice:
                case ChannelType.GuildStageVoice:
                    voiceChannels++;
                    break;

                case ChannelType.GuildText:
                case ChannelType.GuildAnnouncement:
                case ChannelType.GuildForum:
                    textChannels++;
                    break;

                case ChannelType.GuildCategory:
                    categories++;
                    break;
            }
        });

        const infoEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setAuthor({
                name: guild.name,
                iconURL: guild.iconURL({ size: iconSize }),
            })
            .setThumbnail(guild.iconURL({ size: iconSize }))
            .addFields(
                { name: "Owner", value: `${await interaction.guild.fetchOwner({ force: true })}`, inline: true },
                { name: "Members", value: `${guild.memberCount}`, inline: true },
                { name: "Roles", value: `${guild.roles.cache.size}`, inline: true },
            )
            .addFields(
                { name: "Categories", value: `${categories}`, inline: true },
                { name: "Text Channels", value: `${textChannels}`, inline:true },
                { name: "Voice Channels", value: `${voiceChannels}`, inline:true }
            )
            .setFooter({ text: `ID: ${guild.id} | Created on: ${moment.unix(parseInt(guild.createdTimestamp/1000)).format('D/M/YYYY H:m')} GMT`});

        await interaction.reply({ embeds: [infoEmbed] });
    },
};
