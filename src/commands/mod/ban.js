const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder } = require("discord.js");
const { appendLog, LogType } = require("../../info/mod");
const appeal = require("../../components/buttons/appeal");

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
                .setMaxLength(512)
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

        const log = await appendLog(LogType.ban, interaction);
        const timeId = log[0];

        if (guildUser) {
            const userEmbed = new EmbedBuilder()
                .setColor("NotQuiteBlack")
                .setDescription(`Hey ${user}, You have been banned from ${interaction.guild} | ${reason}`);

            const btn = appeal.data;

            btn.setCustomId(`appeal_id_${timeId.toString(16)}`);
            
            const row = new ActionRowBuilder()
                .addComponents(btn);
            await user.send({ embeds: [userEmbed], components: [row] });
        }

        const guildEmbed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`${user} has been banned successfully. | ${reason}`);
 
        await interaction.reply({ embeds: [guildEmbed] });
    },
};
