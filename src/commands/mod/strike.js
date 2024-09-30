const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { addStrikes } = require("../../info/mod");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("strike")
        .setDescription("Strikes a user")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("User to strike")
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("strikes")
                .setDescription("Set the number of strikes to put on the user")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(50)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("Specify a reason for the ban")
                .setRequired(true)
                .setMaxLength(512)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const strikes = interaction.options.getInteger("strikes");
        const reason = interaction.options.getString("reason");

        const guildUser = await interaction.guild.members.fetch({ user: user.id, force: true}).catch((error) => {});
        
        if (!guildUser) {
            return await interaction.reply({
                content: "User is not in this server",
                ephemeral: true
            })
        }
        const [initial, final] = await addStrikes(user.id, interaction.guild.id, strikes);

        const guildEmbed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`${user} has been striked successfully [ ${initial} → ${final} strikes ] | ${reason}`);

        await interaction.reply({
            embeds: [guildEmbed]
        })
    }
}