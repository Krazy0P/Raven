import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
} from "discord.js";
import {
  getOrCreateUser,
  addToWallet,
  removeFromWallet,
  formatCoins,
  isOnCooldown,
  formatCooldown,
} from "@/util/economy";
import supabase from "@/util/supabase";

const COOLDOWN = 2 * 60 * 60 * 1000; // 2 hours
const SUCCESS_RATE = 0.4; // 50% success

export default {
  data: new SlashCommandBuilder()
    .setName("crime")
    .setDescription("Commit a crime for big rewards (risky!)"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const eco = await getOrCreateUser(
      interaction.user.id
    );
    const remaining = isOnCooldown(eco.last_crime, COOLDOWN);

    if (remaining > 0) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(`⏰ Lay low for **${formatCooldown(remaining)}**`),
        ],
      });
    }

    await supabase
      .from("economy")
      .update({ last_crime: new Date().toISOString() })
      .eq("user_id", interaction.user.id);

    const success = Math.random() < SUCCESS_RATE;

    if (success) {
      const earned = Math.floor(Math.random() * 700) + 300;
      await addToWallet(interaction.user.id, earned);
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle("Crime Successful! Great job I guess.")
            .setDescription(`You got away with ${formatCoins(earned)}!`),
        ],
      });
    } else {
      const fine = Math.floor(Math.random() * 300) + 100;
      await removeFromWallet(interaction.user.id, fine);
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle("Busted! Better luck next time kid.")
            .setDescription(`You got caught and fined ${formatCoins(fine)}!`),
        ],
      });
    }
  },
};
