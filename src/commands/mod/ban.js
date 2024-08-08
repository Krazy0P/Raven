const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { Guild, LogType } = require("../../info/guild");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bans a user from the server")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("Select a user to ban from the server")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("Specify a reason for the ban")
                .setRequired(false)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason") || "No reason was specified";

        const guildUser = await interaction.guild.members.fetch({ user: user.id, force: true }).catch((error) => {});

        
        try {
            await interaction.guild.members.ban(user,{ reason: reason })
        } catch (error) {
            return await interaction.reply({ 
                content: `Sadly, I can't kick ${user}`, 
                ephemeral: true 
            })
        }

        const server = new Guild(interaction.guild.id);
        server.logs.appendLog(LogType.ban, interaction, reason);
        server.saveData();

        if (guildUser) {
            const userEmbed = new EmbedBuilder()
                .setColor("NotQuiteBlack")
                .setDescription(`Hey ${user}, You have been banned from ${guildUser.guild.name} | ${reason}`);
            await user.send({ embeds: [userEmbed] });
        }

        const guildEmbed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`${user} has been banned successfully. | ${reason}`);
 
        await interaction.reply({ embeds: [guildEmbed] });
    },
};
