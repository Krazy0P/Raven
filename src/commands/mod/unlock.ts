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
    .setName("unlock")
    .setDescription("Unlock the current channel")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel to unlock")
        .setRequired(false),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const channel = (interaction.options.getChannel("channel") ??
      interaction.channel) as TextChannel;

    await channel.permissionOverwrites.edit(interaction.guild!.roles.everyone, {
      SendMessages: null, // reset to default (inherit)
    });

    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle("Channel Unlocked")
      .setDescription("This channel has been unlocked.")
      .setTimestamp();

    await channel.send({ embeds: [embed] });

    return interaction.editReply(`🔓 Unlocked ${channel}`);
  },
};
