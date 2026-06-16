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

const DAILY_AMOUNT = 1000;

export default {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim your daily coins"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const eco = await getOrCreateUser(interaction.user.id);

    const today = new Date();

    if (eco.last_daily) {
      const lastClaim = new Date(eco.last_daily);

      // already claimed today
      if (today.toDateString() === lastClaim.toDateString()) {
        const midnight = new Date(today);
        midnight.setHours(24, 0, 0, 0);
        const seconds = Math.floor(midnight.getTime() / 1000);

        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Red)
              .setDescription(`Aw man... Come back **<t:${seconds}:R>**`),
          ],
        });
      }

      // check if streak should continue or reset
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastClaim.toDateString() !== yesterday.toDateString()) {
        // more than 1 day gap → reset streak
        eco.daily_streak = 0;
      }
    }

    eco.daily_streak = (eco.daily_streak ?? 0) + 1;
    const daily = DAILY_AMOUNT + (eco.daily_streak - 1) * 200;

    await addToWallet(interaction.user.id, daily);

    eco.last_daily = new Date().toISOString();

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Green)
          .setDescription(
            `You claimed your daily ${formatCoins(daily)}!\n🔥 Streak: **${eco.daily_streak}**`,
          ),
      ],
    });
  },
};