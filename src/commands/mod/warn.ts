import supabase from "@/util/supabase";
import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  InteractionContextType,
  ChatInputCommandInteraction,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warns a user")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to warn")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Specify a reason for the warning")
        .setRequired(false)
        .setMaxLength(512),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const convictUser = interaction.options.getUser("user")!;
    const reason =
      interaction.options.getString("reason") || "No reason was specified";
    const guild = interaction.guild!;

    if (convictUser.id === interaction.user.id) {
      const returnEmbed = new EmbedBuilder()
        .setColor("DarkRed")
        .setDescription(
          `Bruh, you can't warn yourself`,
        );
      return interaction.reply({
        embeds: [returnEmbed],
        flags: 'Ephemeral'
      })
    }

    const guildUser = await guild.members
      .fetch({ user: convictUser.id, force: true })
      .catch();

    if (!guildUser) {
      return await interaction.reply({
        content: "User is not in this server",
        flags: 'Ephemeral'
      });
    }

    await interaction.deferReply();

    await supabase
      .from("actions")
      .insert({
        mod_name: interaction.user.globalName!,
        mod_id: interaction.user.id,
        convict_name: convictUser.globalName!,
        convict_id: convictUser.id,
        guild_name: guild.name,
        guild_id: guild.id,
        action: "warn",
        reason: reason,
      })
      .select();

    const userEmbed = new EmbedBuilder()
      .setColor("NotQuiteBlack")
      .setDescription(
        `Hey ${convictUser}, You have received a warning from ${guildUser.guild.name} | ${reason}`,
      );

    const guildEmbed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(`${convictUser} has been warned | ${reason}`);

    await convictUser.send({ embeds: [userEmbed] }).catch(() => {});

    return await interaction.editReply({
      embeds: [guildEmbed],
    });
  },
};
