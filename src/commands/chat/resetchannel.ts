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
    .setName("reset_level_up_channel")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDescription("Reset the level up channel"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const { data, error } = await supabase
      .from("level up channel")
      .delete()
      .eq("guild_id", interaction.guild?.id!)
      .select();

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
      .setDescription(`Successfully reset level up channel.`);

    await interaction.editReply({
      embeds: [embed],
    });
  },
};
