import {
  ChannelType,
  ChatInputCommandInteraction,
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

import fs from "node:fs";

import channelData from "@/theme/server/channels/khooni.json";

export default {
  data: new SlashCommandBuilder()
    .setName("channels")
    .setDescription("Manage server channels")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("copy")
        .setDescription("Copies the current server layout and returns in json"),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Adds the Channels")
        .addStringOption((option) =>
          option
            .setName("category")
            .setDescription("Select the server theme")
            .setRequired(true)
            .addChoices(
              { name: "Static Frequency", value: "khooni" },
              { name: "Khooni Monday", value: "khooni" },
              { name: "Khooni Monday", value: "khooni" },
              { name: "Khooni Monday", value: "khooni" },
              { name: "Khooni Monday", value: "khooni" },
              { name: "Khooni Monday", value: "khooni" },
            ),
        ),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "copy") {
      return handleCopyChannels(interaction);
    }

    if (subcommand === "create") {
      return handleCreateColours(interaction);
    }
  },
};

function handleCopyChannels(interaction: ChatInputCommandInteraction) {
  const guild = interaction.guild!;
  const structure = {
    categories: [] as Array<{
      name: string;
      channels: Array<{
        name: string;
        type: ChannelType;
      }>;
    }>,
  };

  // Get all categories
  const categories = guild.channels.cache.filter(
    (channel) => channel.type === ChannelType.GuildCategory,
  );

  // Build structure
  for (const [, category] of categories) {
    const categoryData = {
      name: category.name,
      channels: [] as Array<{
        name: string;
        type: ChannelType;
      }>,
    };

    // Get channels in this category
    const channelsInCategory = guild.channels.cache.filter(
      (channel) => channel.parentId === category.id,
    );

    for (const [, channel] of channelsInCategory) {
      categoryData.channels.push({
        name: channel.name,
        type: channel.type,
      });
    }

    structure.categories.push(categoryData);
  }

  // Handle uncategorized channels
  const uncategorizedChannels = guild.channels.cache.filter(
    (channel) =>
      channel.type !== ChannelType.GuildCategory && !channel.parentId,
  );

  if (uncategorizedChannels.size > 0) {
    const uncategorized = {
      name: "No Category",
      channels: [] as Array<{
        name: string;
        type: ChannelType;
      }>,
    };

    for (const [, channel] of uncategorizedChannels) {
      uncategorized.channels.push({
        name: channel.name,
        type: channel.type,
      });
    }

    structure.categories.push(uncategorized as never);
  }

  fs.writeFileSync("./data.json", JSON.stringify(structure, null, 4));

  return interaction.editReply({
    content: "copied!",
  });
}

function handleCreateColours(interaction: ChatInputCommandInteraction) {
  return interaction.reply({
    content: "working on it",
  });
}
