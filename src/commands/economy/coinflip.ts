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

export default {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Flip a coin and bet")
    .addIntegerOption((option) =>
      option
        .setName("bet")
        .setDescription("Amount to bet")
        .setMinValue(10)
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("side")
        .setDescription("heads or tails")
        .addChoices(
          { name: "Heads", value: "heads" },
          { name: "Tails", value: "tails" },
        )
        .setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const bet = interaction.options.getInteger("bet", true);
    const side = interaction.options.getString("side", true);
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

    const result = Math.random() < 0.5 ? "heads" : "tails";
    const won = result === side;

    if (won) {
      await addToWallet(interaction.user.id, bet);
    } else {
      await removeFromWallet(interaction.user.id, bet);
    }

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`🪙 Coinflip — ${result.toUpperCase()}`)
          .setDescription(
            won
              ? `You guessed right! +${formatCoins(bet)}`
              : `Wrong guess dear... -${formatCoins(bet)}`,
          )
          .setColor(won ? Colors.Green : Colors.Red)
          .setTimestamp(),
      ],
    });
  },
};
