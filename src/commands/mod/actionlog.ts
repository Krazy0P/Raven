import supabase from "@/util/supabase";
import type { Database } from "@/types/database.types";

import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  InteractionContextType,
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  Guild,
} from "discord.js";

const PAGE_SIZE = 10;

function buildEmbed(
  guild: Guild,
  data: Database["public"]["Tables"]["actions"]["Row"][],
  page: number,
  total: number,
): EmbedBuilder {
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const embed = new EmbedBuilder()
    .setTitle(`Action log`)
    .setDescription(`for **${guild.name}**`)
    .setThumbnail(guild.iconURL({ extension: "png", size: 256 }))
    .setColor(Colors.NotQuiteBlack)
    .setFooter({
      text: `${data?.length} actions • Page ${page + 1}/${totalPages}`,
    })
    .setTimestamp();

  data?.forEach((value, _) => {
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
    .setName("actionlog")
    .setDescription("Gets server action log")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addUserOption((option) =>
      option.setName("mod").setDescription("Filter by mod").setRequired(false),
    )
    .addUserOption((option) =>
      option
        .setName("convict")
        .setDescription("Filter by convict")
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("Filter by action")
        .setRequired(false)
        .addChoices(
          { name: "Unban", value: "unban" },
          { name: "Ban", value: "ban" },
          { name: "Kick", value: "kick" },
          { name: "Timeout", value: "timeout" },
          { name: "Warn", value: "warn" },
        ),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const modUser = interaction.options.getUser("mod");
    const convictUser = interaction.options.getUser("convict");
    const action = interaction.options.getString("action") as
      | "unban"
      | "ban"
      | "kick"
      | "timeout"
      | "warn";
    const guild = interaction.guild!;

    let numberQuery = supabase
      .from("actions")
      .select("*", { count: "exact", head: true });

    if (modUser) numberQuery.eq("mod_id", modUser.id);
    if (convictUser) numberQuery.eq("convict_id", convictUser.id);
    if (action) numberQuery.eq("action", action);

    const { count } = await numberQuery;

    const total = count ?? 0;

    if (total === 0) {
      return interaction.editReply({
        content: "No action log was found.",
      });
    }

    let page = 0;

    async function fetchData(page: number) {
      const index = page * PAGE_SIZE;
      let query = supabase
        .from("actions")
        .select("*")
        .order("id", { ascending: false })
        .range(index, index + PAGE_SIZE - 1);

      if (modUser) query.eq("mod_id", modUser.id);
      if (convictUser) query.eq("convict_id", convictUser.id);
      if (action) query.eq("action", action);

      const { data } = await query;
      return data ?? [];
    }

    const initialData = await fetchData(0);

    const message = await interaction.editReply({
      embeds: [buildEmbed(guild, initialData, page, total)],
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
      if (button.customId === "previous") page--;
      if (button.customId === "next") page++;
      if (button.customId === "last") page = Math.ceil(total / PAGE_SIZE) - 1;

      const data = await fetchData(page);

      await button.update({
        embeds: [buildEmbed(guild, data, page, total)],
        components: [buttonRow(page, total)],
      });
    });

    collector.on("end", async () => {
      await interaction.editReply({ components: [buttonRow(0, 1)] });
    });
  },
};
