import supabase from "@/util/supabase";
import type { Database } from "@/types/database.types";

import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  InteractionContextType,
  EmbedBuilder,
  Colors,
  User,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} from "discord.js";

const PAGE_SIZE = 10;

function buildEmbed(
  user: User,
  data: Database["public"]["Tables"]["actions"]["Row"][],
  page: number,
  total: number,
): EmbedBuilder {
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const embed = new EmbedBuilder()
    .setTitle(`Mod Log`)
    .setDescription(`**for <@${user.id}>**`)
    .setThumbnail(user.displayAvatarURL({ extension: "png", size: 256 }))
    .setColor(Colors.NotQuiteBlack)
    .setFooter({
      text: `${data?.length} modlogs • Page ${page + 1}/${totalPages}`,
    })
    .setTimestamp();

  data?.forEach((value, index) => {
    embed.addFields({
      name: `Case #${value.id}`,
      value: `
          **Type**: ${value.action}
          **User**: <@${value.convict_id}> 
          **Moderator**: <@${value.mod_id}>
          **Reason**: ${value.reason}
          `,
    });
  });

  return embed;
}

function buttonRow(page: number, total: number) {
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const firstButton = new ButtonBuilder()
    .setCustomId("first")
    .setLabel("◀◀ First")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(page === 0);

  const previousButton = new ButtonBuilder()
    .setCustomId("previous")
    .setLabel("◀ Previous")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(page === 0);

  const nextButton = new ButtonBuilder()
    .setCustomId("next")
    .setLabel("Next ▶")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(page === totalPages - 1);

  const lastButton = new ButtonBuilder()
    .setCustomId("last")
    .setLabel("Last ▶▶")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(page === totalPages - 1);

  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    firstButton,
    previousButton,
    nextButton,
    lastButton,
  );
}

export default {
  data: new SlashCommandBuilder()
    .setName("modlog")
    .setDescription("Gets the mod log of any member")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to get the mod log of")
        .setRequired(false),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const user = interaction.options.getUser("user") || interaction.user;

    const { count } = await supabase
      .from("actions")
      .select("*", { count: "exact", head: true })
      .eq("convict_id", user.id);

    const total = count ?? 0;

    if (total === 0) {
      return interaction.editReply({
        content: "No modlogs found for this user.",
      });
    }

    let page = 0;

    async function fetchData(page: number) {
      const index = page * PAGE_SIZE;
      const { data } = await supabase
        .from("actions")
        .select("*")
        .eq("convict_id", user.id)
        .order("id", { ascending: false })
        .range(index, index + PAGE_SIZE - 1);
      return data ?? [];
    }

    const initialData = await fetchData(0);

    const message = await interaction.editReply({
      embeds: [buildEmbed(user, initialData, page, total)],
      components: total > PAGE_SIZE ? [buttonRow(page, total)] : [],
    });

    if (total <= PAGE_SIZE) return;

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60_000,
    });

    collector.on("collect", async (button) => {
      if (button.user.id !== interaction.user.id)
        return button.reply({
          content: "This button is not for you.",
          flags: "Ephemeral",
        });

      if (button.customId === "first") page = 0;
      if (button.customId === "next") page++;
      if (button.customId === "previous") page--;
      if (button.customId === "last") page = Math.ceil(total / PAGE_SIZE) - 1;

      const data = await fetchData(page);

      await button.update({
        embeds: [buildEmbed(user, data, page, total)],
        components: [buttonRow(page, total)],
      });
    });

    collector.on("end", async () => {
      await interaction.editReply({ components: [buttonRow(0, 1)] });
    });
  },
};
