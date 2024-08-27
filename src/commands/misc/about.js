const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("about")
        .setDescription("Info about the bot!")
        .setDMPermission(true),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x9c87ca)
            .setTitle("Owner")
            .setDescription("<@635389194377887766>")
            .setAuthor({
                name: interaction.client.user.username,
                iconURL:interaction.client.user.avatarURL(), 
            })
            .addFields(
                { name: "Created On", value: "<t:1668320684:f>" },
                { name: "About Me", value: "Hey there! I was made for fun." },
            )
            .setThumbnail("https://i.pinimg.com/564x/11/b2/cd/11b2cdcdc580c7a6e64f3343eb02d1be.jpg")
            .setTimestamp()
            .setFooter({ text: "Made with Warmth", iconURL: "https://cdn.discordapp.com/emojis/883003301132632085.gif?size=96" });
        const btn = interaction.client.buttons.get('appeal').data;
        btn.setLabel("something")
        console.log(btn)
        const row = new ActionRowBuilder()
            .addComponents(btn);
        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
