const { ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new ButtonBuilder()
        .setCustomId("appeal")
        .setLabel("Appeal")
        .setStyle(ButtonStyle.Secondary),
    
    async execute(interaction) {
        const modalname = 'appeal-reason';
        const modal = interaction.client.modals.get(modalname).data;

        const idIndex = interaction.customId.indexOf("_id_") + 4;
        const id = interaction.customId.substring(idIndex);
        modal.setCustomId(`${modalname}_id_${id}`);
        await interaction.showModal(modal);
    }
}