const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Economy } = require("../../info/economy");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Check someone's balance")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("User to fetch balance from")
                .setRequired(false)
        ),
        
    async execute(interaction) {
        const user = interaction.options.getUser("user") == null? interaction.user : interaction.options.getUser("user");

        const economy = new Economy(user);
        const userData = await economy.getUser();

        const balanceEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setTitle(`${user.globalName}'s Balance`)
            .setAuthor({ name: user.username, iconURL: user.avatarURL({ size: 4096 }) })
            .addFields(
                { name: "Pocket", value: `${userData.pocket}`, inline: true},
                { name: "Bank", value: `${userData.bank}/${userData.bank_limit}`, inline: true}
            )

        await interaction.reply({ embeds: [balanceEmbed] });

    }
}