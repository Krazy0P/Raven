const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("about")
        .setDescription("Info about the bot!"),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x9c87ca)
            .setTitle("Owner")
            .setDescription("<@635389194377887766>")
            .setAuthor({
                name: interaction.client.user.username,
                iconURL:`https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.png?size=4096`, // Hu Tao peeking
            })
            .addFields(
                { name: "Created On", value: "<t:1668320684:f>" },
                { name: "About Me", value: "Hey there! I was made for fun." },
            )
            .setThumbnail("https://i.pinimg.com/564x/11/b2/cd/11b2cdcdc580c7a6e64f3343eb02d1be.jpg") // Xiao gif
            .setTimestamp()
            .setFooter({ text: "Made with warmth", iconURL: "https://cdn.discordapp.com/emojis/883003301132632085.gif?size=96" }); // Heart gif

        await interaction.reply({ embeds: [embed] });
    },
};
