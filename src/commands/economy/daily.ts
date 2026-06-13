import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
} from "discord.js";
import {
  getOrCreateUser,
  addToWallet,
  formatCoins,
} from "@/util/economy";
import supabase from "@/util/supabase";

const DAILY_AMOUNT = 1000;

export default {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim your daily coins"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const eco = await getOrCreateUser(interaction.user.id);
    const due_date = new Date(eco.last_daily!);
    due_date.setDate(due_date.getDate() + 1);
    const today = new Date();

    if (today.toDateString() !== due_date.toDateString()) {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const seconds = Math.floor(midnight.getTime() / 1000);

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(
              `Aw man... Come back in **<t:${seconds}:R>**`,
            ),
        ],
      });
    }

    const daily = DAILY_AMOUNT + eco.daily_streak! * 200;

    await addToWallet(interaction.user.id, daily);

    await supabase
      .from("economy")
      .update({ last_daily: new Date().toISOString() })
      .eq("user_id", interaction.user.id);

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Green)
          .setDescription(`You claimed your daily ${formatCoins(daily)}!`),
      ],
    });
  },
};
