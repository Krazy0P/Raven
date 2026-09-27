import supabase from "@/util/supabase";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionContextType,
  PermissionFlagsBits,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("level")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDescription("Manage level up channel")
    .addSubcommandGroup((subcommands) =>
      subcommands
        .setName("channel")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("set")
            .setDescription("Set the level up channel")
            .addChannelOption((option) =>
              option
                .setName("channel")
                .setDescription("Channel to send level up messages")
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
          .setName("remove")
          .setDescription("Removes the level up channel")),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    interaction.deferReply();

    const subcommandgroup = interaction.options.getSubcommandGroup();
    console.log("works")
    return interaction.reply("worked.")
  },
};
