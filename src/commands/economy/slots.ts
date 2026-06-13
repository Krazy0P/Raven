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
} from "@/util/economy";

const EMOJIS = ["🍒", "🍋", "🍊", "🍇", "💎", "7️⃣"];
const MULTIPLIERS: Record<string, number> = {
  "🍒": 2,
  "🍋": 2.5,
  "🍊": 3,
  "🍇": 4,
  "💎": 10,
  "7️⃣": 20,
};

export default {
  data: new SlashCommandBuilder()
    .setName("slots")
    .setDescription("Play the slot machine")
    .addIntegerOption((option) =>
      option
        .setName("bet")
        .setDescription("Amount to bet")
        .setRequired(true)
        .setMinValue(10),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const bet = interaction.options.getInteger("bet", true);
    const eco = await getOrCreateUser(interaction.user.id);

    if (eco.wallet! < bet) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(
              `You only have ${formatCoins(eco.wallet!)} in your wallet!`,
            ),
        ],
      });
    }

    const slots = Array.from(
      { length: 3 },
      () => EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    ) as ("🍒" | "🍋" | "🍊" | "🍇" | "💎" | "7️⃣")[];
    const display = `[ ${slots.join(" | ")} ]`;

    const allMatch = slots.every((s) => s === slots[0]);
    const twoMatch =
      slots[0] === slots[1] || slots[1] === slots[2] || slots[0] === slots[2];

    let result = "";
    let color: number = Colors.Red;

    if (allMatch) {
      const winnings = Math.floor(bet * MULTIPLIERS[slots[0]!]!);
      await addToWallet(interaction.user.id, winnings - bet);
      result = `JACKPOT! You won ${formatCoins(winnings)}!`;
      color = Colors.Gold;
    } else if (twoMatch) {
      const winnings = Math.floor(bet * 1.5);
      await addToWallet(interaction.user.id, winnings - bet);
      result = `Two match! You won ${formatCoins(winnings)}!`;
      color = Colors.Green;
    } else {
      await removeFromWallet(interaction.user.id, bet);
      result = `You lost ${formatCoins(bet)}!`;
    }

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle("🎰 Slot Machine")
          .setDescription(`${display}\n\n${result}`)
          .setColor(color)
          .setTimestamp(),
      ],
    });
  },
};
