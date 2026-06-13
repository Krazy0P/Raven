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
  isOnCooldown,
  formatCooldown,
} from "@/util/economy";
import supabase from "@/util/supabase";

const DAILY_AMOUNT = 1000;
const COOLDOWN = 24 * 60 * 60 * 1000;

export default {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim your daily coins"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const eco = await getOrCreateUser(interaction.user.id);
    const remaining = isOnCooldown(eco.last_daily, COOLDOWN);

    if (remaining > 0) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(
              `Aw man... Come back in **${formatCooldown(remaining)}**`,
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
