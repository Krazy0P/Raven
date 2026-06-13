import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  InteractionContextType,
  TextChannel,
  EmbedBuilder,
  Colors,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock the current channel")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel to lock")
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for locking")
        .setRequired(false),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const channel = (interaction.options.getChannel("channel") ??
      interaction.channel) as TextChannel;
    const reason =
      interaction.options.getString("reason") ?? "No reason provided";

    await channel.permissionOverwrites.edit(interaction.guild!.roles.everyone, {
      SendMessages: false,
    });

    const embed = new EmbedBuilder()
      .setColor(Colors.Red)
      .setTitle("Channel Locked")
      .setDescription(`This channel has been locked.\n**Reason:** ${reason}`)
      .setTimestamp();

    await channel.send({ embeds: [embed] });

    return interaction.editReply(`🔒 Locked ${channel}`);
  },
};
