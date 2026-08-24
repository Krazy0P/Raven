import {
  ChannelType,
  ChatInputCommandInteraction,
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
  type Channel,
} from "discord.js";

import fs from "node:fs";

import channelData from "@/theme/server/channels/khooni.json";
import supabase from "@/util/supabase";
import logger from "@/util/logger";

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
              { name: "Static Frequency", value: "0" },
              { name: "Clockwork Musicians", value: "1" },
              { name: "Forbidden Woods", value: "2" },
              { name: "Clockwork Servants", value: "3" },
              { name: "Foyer", value: "4" },
              { name: "Campfire Chronicles", value: "5" },
              { name: "Village", value: "6" },
              { name: "Carnival of Shadows", value: "7" },
              { name: "Supernatural Services", value: "8" },
            ),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Deletes the channels")
        .addStringOption((option) =>
          option
            .setName("category")
            .setDescription("Select the server theme")
            .setRequired(true)
            .addChoices(
              { name: "Static Frequency", value: "0" },
              { name: "Clockwork Musicians", value: "1" },
              { name: "Forbidden Woods", value: "2" },
              { name: "Clockwork Servants", value: "3" },
              { name: "Foyer", value: "4" },
              { name: "Campfire Chronicles", value: "5" },
              { name: "Village", value: "6" },
              { name: "Carnival of Shadows", value: "7" },
              { name: "Supernatural Services", value: "8" },
            ),
        ),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "copy":
        return handleCopyChannels(interaction);
      case "create":
        return handleCreateColours(interaction);
      case "delete":
        return handleDeleteColours(interaction);
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

async function handleCreateColours(interaction: ChatInputCommandInteraction) {
  const index = parseInt(interaction.options.getString("category")!);
  const channelList = channelData.categories[index]?.channels!;
  const categoryName = channelData.categories[index]?.name!;
  const guild = interaction.guild!;

  const channelIds: Record<string, string> = {};

  const { data, error } = await supabase
    .from("channel theme")
    .select("*")
    .eq("guild_id", guild.id);

  if (data?.length) {
    return interaction.editReply({
      content: "Seems like it already already exist",
    });
  }


  const category = await guild.channels.create({
    name: categoryName,
    type: ChannelType.GuildCategory,
  });

  try {
    await Promise.all(
      channelList.map(async (value, index) => {
        const channel = (await category.children
          .create({
            name: value.name,
            type: value.type,
          })
          .catch(() => null)) as Channel;

        if (channel) {
          channelIds[value.name] = channel.id;
        }
      }),
    );

    await supabase.from("channel theme").insert({
      guild_id: guild.id,
      category_name: categoryName,
      category_id: category.id,
      channel_list: channelIds,
    });

    return interaction.editReply({
      content: "Created the channels",
    });
  } catch (e) {
    logger.error(e);
    return interaction.editReply({
      content: "Something went wrong",
    });
  }
}

async function handleDeleteColours(interaction: ChatInputCommandInteraction) {
  const index = parseInt(interaction.options.getString("category")!);
  const categoryName = channelData.categories[index]!.name!;
  const guild = interaction.guild!;

  const { data, error } = await supabase
    .from("channel theme")
    .select("*")
    .eq("guild_id", guild.id)
    .eq("category_name", categoryName)
    .single();

  if (!data) {
    return interaction.editReply({
      content: "Seems like it does not already exist",
    });
  }

  const categoryId = data.category_id;
  const channelList = data.channel_list as Record<string, string>;

  try {
    await Promise.all(
      Object.entries(channelList).map((value) =>
        guild.channels.delete(value[1]).catch(() => {}),
      ),
    );

    await guild.channels.delete(categoryId).catch(() => {});

    await supabase
      .from("channel theme")
      .delete()
      .eq("guild_id", guild.id)
      .eq("category_name", categoryName);

    return interaction.editReply({
      content: "Deleted all the channels!",
    });
  } catch (e) {
    logger.error(e);
    return interaction.editReply({
      content: "Seems like something went wrong",
    });
  }
}
