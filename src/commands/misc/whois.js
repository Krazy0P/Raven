const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const moment = require("moment");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("whois")
        .setDescription("Get user information")
        .addUserOption((options) =>
            options
                .setName("user")
                .setDescription("User to get information on")
                .setRequired(false)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser("user") == null ? interaction.user : interaction.options.getUser("user");
        const member = await interaction.guild.members.fetch(user.id);

        const perm = {
            Administrator: "Administrator",
            ManageGuild: "Manage Server",
            ManageRoles: "Manage Roles",
            ManageChannels: "Manage Channels",
            ManageMessages: "Manage Messages",
            ManageWebhooks: "Manage Webhooks",
            ManageNicknames: "Manage Nicknames",
            ManageEmojisAndStickers: "Manage Emojis And Stickers",
            KickMembers: "Kick Members",
            BanMembers: "Ban Members",
            MentionEveryone: "Mention Everyone",
            ViewAuditLog: "View Audit Log",
        };

        let keyPerms = member.permissions
            .toArray()
            .sort()
            .map((value) => perm[value])
            .filter((value) => value);

        let position = "Member";
        let roleList = [];
        let embedColor = 0;

        if ((await interaction.guild.ownerId) === user.id) position = "Owner";
        else if (keyPerms.includes("Administrator")) position = "Admin";
        else if (keyPerms.includes("Manage Server")) position = "Manager";
        else if (keyPerms.includes("Kick Members") ||keyPerms.includes("Ban Members")) position = "Moderator";

        for (const role of member.roles.cache) {
            if (embedColor === 0 && role[1].color !== 0)
                embedColor = role[1].color;

            if (role[0] !== interaction.guild.id)
                roleList.push(`<@&${role[0]}>`);
        }

        const profileEmbed = new EmbedBuilder()
            .setColor(embedColor)
            .setDescription(`<@${user.id}>`)
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ size: 4096 }) })
            .setThumbnail(user.displayAvatarURL({ size: 4096 }))
            .addFields(
                { name: "Joined On", value: moment.unix(member.joinedAt / 1000).format("llll"), inline: true },
                { name: "Created On", value: moment.unix((Number(member.id) / 4194304 + 1420070400000) / 1000).format("llll"), inline: true })
            .addFields(
                { name: `Roles [${roleList.length}]`, value: roleList.join(" ") },
                { name: "Permissions",value: keyPerms.length == 0 ? "None" : keyPerms.join(", ")},
                { name: "Position", value: position }
            )
            .setTimestamp()
            .setFooter({ text: `User ID: ${user.id}`, iconURL: "https://cdn.discordapp.com/emojis/883003301132632085.gif?size=96" });

        await interaction.reply({ embeds: [profileEmbed] });
    },
};
