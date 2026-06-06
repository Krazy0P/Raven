import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  InteractionContextType,
} from "discord.js";
import supabase from "@/util/supabase";

export default {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a user from the server")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select a user to ban from the server")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Specify a reason for the ban")
        .setRequired(false)
        .setMaxLength(512),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const convictUser = interaction.options.getUser("user")!;
    const reason =
      interaction.options.getString("reason") || "No reason was specified";
    const guild = interaction.guild!;

    if (convictUser.id === interaction.user.id) {
      const returnEmbed = new EmbedBuilder()
        .setColor("DarkRed")
        .setDescription(`Bruh, you can't ban yourself`);
      return interaction.editReply({
        embeds: [returnEmbed],
      });
    }

    const userEmbed = new EmbedBuilder()
      .setColor("NotQuiteBlack")
      .setDescription(
        `Hey ${convictUser}, You have been banned from ${guild} | ${reason}`,
      );

    await convictUser.send({ embeds: [userEmbed] }).catch(() => {});

    try {
      await guild.members.ban(convictUser, { reason: reason });
    } catch (error) {
      return await interaction.editReply({
        content: `Sadly, I can't ban ${convictUser}`,
      });
    }

    const { data, error } = await supabase
      .from("actions")
      .insert({
        mod_name: interaction.user.globalName!,
        mod_id: interaction.user.id,
        convict_name: convictUser.globalName!,
        convict_id: convictUser.id,
        guild_name: guild.name,
        guild_id: guild.id,
        action: "ban",
        reason: reason,
      })
      .select();

    const guildEmbed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(
        `${convictUser} has been banned successfully. | ${reason}`,
      );

    await interaction.editReply({ embeds: [guildEmbed] });
  },
};
