const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { appendLog, LogType } = require("../../info/mod");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unbans a user from in the server")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("Select a user to unban in the server")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("Specify a reason for the ban")
                .setRequired(false)
                .setMaxLength(512)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason") || "No reason was specified";

        try {
            await interaction.guild.bans.remove(user);
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("The user is not banned in this server!")
            return await interaction.reply({ embeds: [ errorEmbed ], ephemeral:true });
        }

        appendLog(LogType.unban,interaction)

        const guildEmbed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`${user} has been ubanned successfully. | ${reason}`);

        return await interaction.reply({ embeds: [guildEmbed ]});
    }
}