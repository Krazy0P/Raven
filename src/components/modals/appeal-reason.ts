import supabase from "@/util/supabase";
import {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalSubmitInteraction,
  LabelBuilder,
} from "discord.js";

const reasonInput = new TextInputBuilder()
  .setCustomId("appeal-reason-input")
  .setStyle(TextInputStyle.Paragraph)
  .setMaxLength(512)
  .setPlaceholder("Write your reasons here...")
  .setRequired(true);

const reasonLabel = new LabelBuilder()
  .setLabel("Why do you think it was not fair?")
  .setTextInputComponent(reasonInput);

export default {
  data: new ModalBuilder()
    .setCustomId("appeal-reason")
    .setTitle("Ban Appeal")
    .addLabelComponents(reasonLabel),

  async execute(interaction: ModalSubmitInteraction) {
    const reason = interaction.fields.getTextInputValue("appeal-reason-input");
    const idIndex = interaction.customId.indexOf("_id_") + 4;
    const idString = interaction.customId.substring(idIndex);
    const id = parseInt(idString, 16);
    let appeals: string[];

    const { data, error } = await supabase
      .from("appeals")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error)
      return interaction.reply({
        content: "Something went wrong...",
        flags: "Ephemeral",
      });

    if (!data) appeals = [reason];
    else appeals = [reason, data.appeal[0]!];

    await supabase.from("appeals").insert({
      id: id,
      appeal: appeals,
    });

    return interaction.reply("Appeal submitted!")
  },
};
