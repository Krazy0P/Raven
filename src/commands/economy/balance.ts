import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
} from "discord.js";
import { getOrCreateUser, formatCoins } from "@/util/economy";

export default {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your balance")
    .addUserOption((option) =>
      option.setName("user").setDescription("User to check").setRequired(false),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const user = interaction.options.getUser("user") || interaction.user;
    const eco = await getOrCreateUser(user.id);

    const embed = new EmbedBuilder()
      .setTitle(`${user.globalName ?? user.username}'s Balance`)
      .setThumbnail(user.displayAvatarURL())
      .setColor(Colors.Gold)
      .addFields(
        {
          name: "Wallet",
          value: formatCoins(eco.wallet!),
          inline: true,
        },
        {
          name: "Bank",
          value: `${formatCoins(eco.bank!)}/${eco.bank_limit?.toLocaleString()}`,
          inline: true,
        },
        {
          name: "Total",
          value: formatCoins(eco.wallet! + eco.bank!),
        },
      )
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  },
};
