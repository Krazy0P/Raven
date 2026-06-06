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
      .setTitle("Owner")
      .setDescription("<@635389194377887766>")
      .setAuthor({
        name: interaction.client.user.username,
        iconURL: interaction.client.user.avatarURL()!,
      })
      .addFields(
        { name: "Created On", value: "<t:1775397361:f>" },
        { name: "About Me", value: "Hey there! I was made for fun." },
      )
      .setThumbnail(
        "https://media.discordapp.net/attachments/1421777937924886602/1510634908010156253/image.png?ex=6a1d87e4&is=6a1c3664&hm=357680bfc10534df60483b2af8a8989edac974e4ea3cdfa809bd742cd3b1aa91&=&format=webp&quality=lossless&width=989&height=989",
      )
      .setTimestamp()
      .setFooter({
        text: "Made with Warmth",
        iconURL:
          "https://cdn.discordapp.com/emojis/883003301132632085.gif?size=96",
      });
    await interaction.reply({ embeds: [embed] });
  },
};
