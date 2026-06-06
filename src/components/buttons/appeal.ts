import { ButtonBuilder, ButtonStyle, ButtonInteraction } from "discord.js";

export default {
  data: new ButtonBuilder()
    .setCustomId("appeal")
    .setLabel("Appeal")
    .setStyle(ButtonStyle.Secondary),

  async execute(interaction: ButtonInteraction) {
    const modalname = "appeal-reason";
    const client: CustomClient = interaction.client;
    const modal = client.modals.get(modalname).data;

    const idIndex = interaction.customId.indexOf("_id_") + 4;
    const id = interaction.customId.substring(idIndex);
    modal.setCustomId(`${modalname}_id_${id}`);

    await interaction.showModal(modal);
  },
};
