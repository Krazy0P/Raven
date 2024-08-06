const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Get the main avatar of a user")
        .setDMPermission(true)
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("User to fetch avatar from")
                .setRequired(false)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser("user") == null? interaction.user: interaction.options.getUser("user");

        const avatarEmbed = new EmbedBuilder()
            .setColor(0x9c87ca)
            .setTitle("Global Avatar")
            .setAuthor({
                name: user.globalName,
                iconURL: user.displayAvatarURL({ size: 4096 }),
            })
            .setImage(user.displayAvatarURL({ extension: "png", size: 4096 }));

        await interaction.reply({ embeds: [avatarEmbed] });
    },
};
