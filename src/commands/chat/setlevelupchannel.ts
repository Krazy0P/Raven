import supabase from "@/util/supabase";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionContextType,
  PermissionFlagsBits,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("set_level_up_channel")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDescription("Set the level up channel")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel to send level up messages")
        .setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const channel = interaction.options.getChannel("channel");
    const guild = interaction.guild!;

    if (!channel || guild.channels.cache.has(channel.id)) {
      return interaction.reply({
        content: "Channel does not exist on this server.",
        flags: "Ephemeral",
      });
    }

    await interaction.deferReply();

    const { data, error } = await supabase.from("level up channel").upsert({
      guild_id: guild.id,
      channel_id: channel.id,
    });

    if (error) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("Something went wrong... Try again later");
      await interaction.editReply({
        embeds: [embed],
      });
    }

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(`Successfully set the level up channel to ${channel}`);

    await interaction.editReply({
      embeds: [embed],
    });
  },
};
