// withdraw.ts
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
} from "discord.js";
import { getOrCreateUser, formatCoins } from "@/util/economy";
import supabase from "@/util/supabase";

export default {
  data: new SlashCommandBuilder()
    .setName("withdraw")
    .setDescription("Withdraw coins from your bank")
    .addStringOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount to withdraw or 'all'")
        .setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const input = interaction.options.getString("amount", true);
    const eco = await getOrCreateUser(interaction.user.id);
    const amount = input === "all" ? eco.bank! : parseInt(input)!;

    if (isNaN(amount) || amount <= 0) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription("Invalid amount."),
        ],
      });
    }

    if (eco.bank! < amount) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(
              `You only have ${formatCoins(eco.bank!)} in your bank!`,
            ),
        ],
      });
    }

    await supabase
      .from("economy")
      .update({ wallet: eco.wallet! + amount, bank: eco.bank! - amount })
      .eq("user_id", interaction.user.id);

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Green)
          .setDescription(`Withdrew ${formatCoins(amount)} from your bank!`),
      ],
    });
  },
};
