import {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
  ChatInputCommandInteraction,
  type PermissionsString,
} from "discord.js";
import moment from "moment";

export default {
  data: new SlashCommandBuilder()
    .setName("whois")
    .setDescription("Get user information")
    .setContexts(InteractionContextType.Guild)
    .addUserOption((options) =>
      options
        .setName("user")
        .setDescription("User to get information on")
        .setRequired(false),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const member = await interaction.guild!.members.fetch(user.id);

    const perm:{
      [key in PermissionsString]: string
    } = {
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
      CreateInstantInvite: "",
      AddReactions: "",
      PrioritySpeaker: "",
      Stream: "",
      ViewChannel: "",
      SendMessages: "",
      SendTTSMessages: "",
      EmbedLinks: "",
      AttachFiles: "",
      ReadMessageHistory: "",
      UseExternalEmojis: "",
      ViewGuildInsights: "",
      Connect: "",
      Speak: "",
      MuteMembers: "",
      DeafenMembers: "",
      MoveMembers: "",
      UseVAD: "",
      ChangeNickname: "",
      ManageGuildExpressions: "",
      UseApplicationCommands: "",
      RequestToSpeak: "",
      ManageEvents: "",
      ManageThreads: "",
      CreatePublicThreads: "",
      CreatePrivateThreads: "",
      UseExternalStickers: "",
      SendMessagesInThreads: "",
      UseEmbeddedActivities: "",
      ModerateMembers: "",
      ViewCreatorMonetizationAnalytics: "",
      UseSoundboard: "",
      CreateGuildExpressions: "",
      CreateEvents: "",
      UseExternalSounds: "",
      SendVoiceMessages: "",
      SendPolls: "",
      UseExternalApps: "",
      PinMessages: "",
      BypassSlowmode: ""
    };

    let keyPerms = member.permissions
      .toArray()
      .sort()
      .map((value) => perm[value])
      .filter((value) => value);

    let position = "Member";
    let roleList = [];
    let embedColor = 0;

    if (interaction.guild!.ownerId === user.id) 
      position = "Owner";
    else if (keyPerms.includes("Administrator")) 
      position = "Admin";
    else if (keyPerms.includes("Manage Server")) 
      position = "Manager";
    else if (keyPerms.includes("Kick Members") || keyPerms.includes("Ban Members") || keyPerms.includes("Manage Messages"))
      position = "Moderator";

    for (const role of member.roles.cache) {
      if (embedColor === 0 && role[1].colors.primaryColor !== 0) 
        embedColor = role[1].colors.primaryColor;

      if (role[0] !== interaction.guild!.id) roleList.push(`<@&${role[0]}>`);
    }

    const profileEmbed = new EmbedBuilder()
      .setColor(embedColor)
      .setDescription(`<@${user.id}>`)
      .setAuthor({
        name: user.username,
        iconURL: user.displayAvatarURL({ size: 4096 }),
      })
      .setThumbnail(user.displayAvatarURL({ size: 4096 }))
      .addFields(
        {
          name: "Joined On",
          value: moment.unix(member.joinedAt!.getTime() / 1000).format("llll"),
          inline: true,
        },
        {
          name: "Created On",
          value: moment
            .unix((Number(member.id) / 4194304 + 1420070400000) / 1000)
            .format("llll"),
          inline: true,
        },
      )
      .addFields(
        {
          name: `Roles [${roleList.length}]`,
          value: roleList.length == 0 ? "None" : roleList.join(" "),
        },
        {
          name: "Permissions",
          value: keyPerms.length == 0 ? "None" : keyPerms.join(", "),
        },
        { name: "Position", value: position },
      )
      .setTimestamp()
      .setFooter({
        text: `User ID: ${user.id}`,
        iconURL:
          "https://cdn.discordapp.com/emojis/883003301132632085.gif?size=96",
      });

    await interaction.reply({ embeds: [profileEmbed] });
  },
};
