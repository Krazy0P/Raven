import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ChatInputCommandInteraction,
  TextChannel,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purges a given number of messages")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addIntegerOption((option) =>
      option
        .setName("count")
        .setDescription("Number of messages to delete")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const count = interaction.options.getInteger("count")!;

    const channel = interaction.channel as TextChannel;

    const messages = await channel.messages.fetch({ limit: count });
    const deleted = await channel.bulkDelete(messages, true);

    const guildEmbed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(
        `${deleted.size} messages has been deleted successfully.`,
      );

    await interaction.editReply({ embeds: [guildEmbed] });
    setTimeout(() => interaction.deleteReply(), 2000);
  },
};
