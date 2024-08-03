const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { Guild, LogType } = require("../../info/guild");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kicks a user from the server")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("Select a user to kick from the server")
                .setRequired(true)
        ).addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("Specify a reason for the kick")
                .setRequired(false)
        ),

    async execute(interaction) {

        if (!interaction.memberPermissions.has(PermissionsBitField.Flags.KickMembers)) {
            return await interaction.reply({ 
                content: "Seems like... You dont have the permission to kick a user", 
                ephemeral: true 
            });
        }        

        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason") || "No reason was specified";
        
        const guildUser = await interaction.guild.members.fetch({ user: user.id, force: true}).catch((error) => {});
        
        if (!guildUser) {
            return await interaction.reply({ 
                content:"User is not in this server", 
                ephemeral: true 
            })
        } else if (!guildUser.kickable) {
            return await interaction.reply({ 
                content: "Sadly, the user can't be kicked", 
                ephemeral: true 
            })
        }
        
        const userEmbed = new EmbedBuilder()
            .setColor('NotQuiteBlack')
            .setDescription(`Hey ${user}, You have been kicked from ${guildUser.guild.name} | ${reason}`);

        const guildEmbed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`${user} has been kicked successfully. | ${reason}`);

        await user.send({ embeds: [userEmbed]});

        const server = new Guild(interaction.guild.id);
        server.logs.appendLog(LogType.kick,interaction, reason);
        server.saveData();
        
        await guildUser.kick({ reason:reason }).catch((error) => {
            console.log(error)
            interaction.reply("Something went wrong")
        })
        await interaction.reply({ embeds: [guildEmbed] });
        
    }
}