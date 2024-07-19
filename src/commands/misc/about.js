const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("about")
        .setDescription("Info about the bot!"),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x9c87ca)
            .setTitle("Owner")
            //.setURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ") // Rickroll 
            .setDescription("<@635389194377887766>")
            .setAuthor({
                name: interaction.client.user.username,
                iconURL:`https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.png?size=4096`, // Hu Tao peeking
                //url: "https://www.youtube.com",
            })
            .addFields(
                { name: "Created On", value: "<t:1668320684:f>" },
                { name: "About Me", value: "Hey there! I was made for fun."}
            )
            .setThumbnail("https://i.pinimg.com/564x/11/b2/cd/11b2cdcdc580c7a6e64f3343eb02d1be.jpg") // Xiao gif
            //.setImage("https://i.pinimg.com/564x/8f/d0/e6/8fd0e6fbe7dddb6f60755de67ff2ba80.jpg") // Hu Tao upside down
            .setTimestamp()
            .setFooter({ text: "Made with warmth", iconURL: "https://cdn.discordapp.com/emojis/883003301132632085.gif?size=96" }); // Heart gif

        await interaction.reply({ embeds: [embed] });
    },
};
