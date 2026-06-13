import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("Info about the bot!"),

  async execute(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
      .setColor(0x9c87ca)
      .setAuthor({
        name: interaction.client.user.username,
        iconURL: interaction.client.user.avatarURL()!,
      })
      .addFields(
        {
          name: "Owner",
          value: "<@635389194377887766>",
          inline: true,
        },
        {
          name: "Created On",
          value: "<t:1775397361:f>",
          inline: true,
        },
        {
          name: "About Me",
          value:
            "This bot was one of my earliest programming project which turned into this beautiful bot."
        },
        {
          name: "Tech used",
          value: `
- discord.js
- TypeScript
- Bun
          `,
        },
      )
      .setThumbnail("https://i.pinimg.com/736x/63/0a/0a/630a0a9953c7caa78b6766b158dbd570.jpg")
      .setTimestamp()
      .setFooter({
        text: "Made with Warmth",
        iconURL:
          "https://cdn.discordapp.com/emojis/883003301132632085.gif?size=96",
      });
    await interaction.reply({ embeds: [embed] });
  },
};
