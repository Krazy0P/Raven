const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bistro')
        .setDescription('Visit a cool bistro'),

    /**
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction) {
        const bistroEmbed = new EmbedBuilder()
            .setColor('Blurple')
            .setTitle('Bistro')
            .setDescription('A smol bistro')
            .setThumbnail('https://i.redd.it/dcvbfnmpsxv81.png')
            .addFields(
                { 
                    name: 'Coffee - ❄❅❆10', 
                    value: 'Get yourself a warm cup of coffee!', 
                    inline: false 
                }
            )

        await interaction.reply({ embeds: [bistroEmbed] });
    }
}