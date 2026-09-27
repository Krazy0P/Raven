import supabase from "@/util/supabase";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionContextType,
  PermissionFlagsBits,
  ChannelType,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("level")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDescription("Manage level up channel")
    .addSubcommandGroup((subcommands) =>
      subcommands
        .setName("channel")
        .setDescription("Level up channel settings")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("set")
            .setDescription("Set the level up channel")
            .addChannelOption((option) =>
              option
                .setName("channel")
                .setDescription("Channel to send level up messages")
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("remove")
            .setDescription("Removes the level up channel"),
        ),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "set":
        return create(interaction);
      case "remove":
        return reset(interaction);
    }
    const embed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        "Perhaps you missed something. It is not supposed to work like this.",
      );

    return interaction.reply({
      embeds: [embed],
    });
  },
};

async function create(interaction: ChatInputCommandInteraction) {
  const channel = interaction.options.getChannel("channel");
  const guild = interaction.guild!;

  if (!channel || !guild.channels.cache.has(channel.id) || channel.type !== ChannelType.GuildText) {
    return interaction.reply({
      content: "There exists no such text channel.",
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
    return await interaction.editReply({
      embeds: [embed],
    });
  }

  const embed = new EmbedBuilder()
    .setColor("Green")
    .setDescription(`Successfully set the level up channel to ${channel}`);

  return await interaction.editReply({
    embeds: [embed],
  });
}

async function reset(interaction: ChatInputCommandInteraction) {
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
    return await interaction.editReply({
      embeds: [embed],
    });
  }

  if (data.length === 0) {
    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setDescription(`There was no level up channel.`);

    return await interaction.editReply({
      embeds: [embed],
    });
  }

  const embed = new EmbedBuilder()
    .setColor("Green")
    .setDescription(`Successfully reset level up channel.`);

  return await interaction.editReply({
    embeds: [embed],
  });
}
