const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { appendLog, LogType } = require("../../info/mod");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Puts the user on timeout")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("User to timeout on")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("time")
                .setDescription("Set the time duration for the timeout")
                .setRequired(true)
                .setMinLength(2)
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
        const time = interaction.options.getString("time");
        const reason = interaction.options.getString("reason") || "No reason was specified";
        
        const duration = {
            s: (str) => parseInt(str),
            m: (str) => parseInt(str) * 60,
            h: (str) => parseInt(str) * 60 * 60,
            d: (str) => parseInt(str) * 60 * 60 * 24
        };
        
        const guildUser = await interaction.guild.members.fetch({ user: user.id, force: true}).catch((error) => {});
        
        if (!guildUser) {
            return await interaction.reply({ 
                content: "User is not in this server", 
                ephemeral: true 
            })
        } else if (!guildUser.moderatable) {
            return await interaction.reply({ 
                content: `Sadly, I can't moderate ${user}`, 
                ephemeral: true 
            })
        } else if (parseInt(time.substring(0, time.length - 1)) === NaN || !Object.keys(duration).includes(time.at(-1))) {
            return await interaction.reply({
                content: "Well check the time duration again",
                ephemeral: true
            })
        }

        let timeDuration = duration[time.at(-1)](parseInt(time.substring(0, time.length - 1)));

        if (timeDuration > 2419200) {
            timeDuration = 2419200
        } else if (timeDuration == 0) {
            return await interaction.reply({
                content: "Time duration cannot be zero",
                ephemeral: true
            })
        }

        const userEmbed = new EmbedBuilder()
            .setColor('NotQuiteBlack')
            .setDescription(`Hey ${user}, You have been timed out in ${guildUser.guild.name} | ${reason}`);

        const guildEmbed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`${user} has been timed out successfully. | ${reason}`);

        appendLog(LogType.timeout,interaction, timeDuration);

        await user.send({ embeds: [userEmbed]});
        
        await guildUser.timeout(timeDuration*1000, reason).catch((error) => {
            console.log(error)
            interaction.reply("Something went wrong")
        })

        await interaction.reply({ embeds: [guildEmbed] });

        
    }
}