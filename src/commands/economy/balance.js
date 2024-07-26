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

        const data = new Economy(user.id).data;
        
        const balanceEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setTitle(`${user.globalName}'s Balance`)
            .setAuthor({ name: user.username, iconURL: user.avatarURL({ size: 4096 }) })
            .addFields(
                { name: "Pocket", value: `${data.pocket}`, inline: true},
                { name: "Bank", value: `${data.bank}/${data.bankLimit}`, inline: true}
            )

        await interaction.reply({ embeds: [balanceEmbed] });

    }
}