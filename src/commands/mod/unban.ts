import supabase from "@/util/supabase";
import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ChatInputCommandInteraction,
  InteractionContextType,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unbans a user from in the server")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select a user to unban in the server")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Specify a reason for the unban")
        .setRequired(false)
        .setMaxLength(512),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const convictUser = interaction.options.getUser("user")!;
    const reason = interaction.options.getString("reason") || "No reason was specified";
    const guild = interaction.guild!;

    if (convictUser.id === interaction.user.id) {
      const returnEmbed = new EmbedBuilder()
        .setColor("DarkRed")
        .setDescription(
          `If you're trying to unban yourself, how did you send this command?`,
        );
      return interaction.reply({
        embeds: [returnEmbed],
        flags: 'Ephemeral'
      })
    }
    
    try {
      await guild.bans.remove(convictUser);
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
      .setColor("Red")
      .setDescription("The user is not banned in this server!");
      return await interaction.reply({ embeds: [errorEmbed], flags: 'Ephemeral' });
    }
    
    await interaction.deferReply();

    await supabase.from("actions").insert({
      mod_name: interaction.user.globalName!,
      mod_id: interaction.user.id,
      convict_name: convictUser.globalName!,
      convict_id: convictUser.id,
      guild_name: guild.name,
      guild_id: guild.id,
      action: "unban",
      reason: reason
    });
    const guildEmbed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(
        `${convictUser} has been ubanned successfully. | ${reason}`,
      );

    return await interaction.editReply({ embeds: [guildEmbed] });
  },
};
