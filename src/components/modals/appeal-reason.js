const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { appendAppeal, getAppealsById, getLogById, LogType, NoReason } = require("../../info/mod");

const reasonInput = new TextInputBuilder()
    .setCustomId("appeal-reason-input")
    .setLabel("Why do you think it was not fair?")
    .setStyle(TextInputStyle.Paragraph)
    .setMaxLength(512)
    .setPlaceholder("Write your reasons here...")
    .setRequired(true);

const actionRow = new ActionRowBuilder().addComponents(reasonInput);

module.exports = {
    data: new ModalBuilder()
        .setCustomId("appeal-reason")
        .setTitle("Ban Appeal")
        .setComponents(actionRow),
    
    async execute(interaction) {
        const reason = interaction.fields.getTextInputValue("appeal-reason-input");
        const idIndex = interaction.customId.indexOf("_id_") + 4;
        const idString = interaction.customId.substring(idIndex);
        const id = parseInt(idString, 16);

        await appendAppeal(id, reason);

        const [appeals] = await getAppealsById(id);

        if (appeals.length > 1) {
            const [banRecord] = (await getLogById(LogType.ban,id))[0];

            const guildName = banRecord.guild_name;
            const banReason = banRecord.reason || NoReason;


            const userEmbed = new EmbedBuilder()
                .setColor("NotQuiteBlack")
                .setDescription(`Hey ${interaction.user}, You have been banned from ${guildName} | ${banReason}`);
            
            const button = new ButtonBuilder()
                .setCustomId('disabled')
                .setLabel("Appeal")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true);
            const row = new ActionRowBuilder()
                .addComponents(button);
            
            
            return await interaction.update({ embeds: [userEmbed], components: [row] });
        }

        return await interaction.reply("Thank you for your feedback. You can send one more appeal if you think that the last one was not sufficient");
    }
}