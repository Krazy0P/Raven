import supabase from "@/util/supabase";
import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ChatInputCommandInteraction,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks a user from the server")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select a user to kick from the server")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Specify a reason for the kick")
        .setRequired(false)
        .setMaxLength(512),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const convictUser = interaction.options.getUser("user")!;
    const reason =
      interaction.options.getString("reason") || "No reason was specified";
    const guild = interaction.guild!;

    if (convictUser.id === interaction.user.id) {
      const returnEmbed = new EmbedBuilder()
        .setColor("DarkRed")
        .setDescription(
          `Bruh, you can't kick yourself`,
        );
      return interaction.reply({
        embeds: [returnEmbed],
        flags: 'Ephemeral'
      })
    }

    const guildUser = await guild.members
      .fetch({ user: convictUser.id, force: true })
      .catch();

    if (!guildUser) {
      return await interaction.reply({
        content: "User is not in this server",
        flags: 'Ephemeral'
      });
    } else if (!guildUser.kickable) {
      return await interaction.reply({
        content: `Sadly, I can't kick ${convictUser}`,
        flags: 'Ephemeral'
      });
    }

    await supabase.from("actions").insert({
      mod_name: interaction.user.globalName!,
      mod_id: interaction.user.id,
      convict_name: convictUser.globalName!,
      convict_id: convictUser.id,
      guild_name: guild.name,
      guild_id: guild.id,
      action: "kick",
      reason: reason,
    });

    const userEmbed = new EmbedBuilder()
      .setColor("NotQuiteBlack")
      .setDescription(
        `Hey ${convictUser}, You have been kicked from ${guildUser.guild.name} | ${reason}`,
      );

    const guildEmbed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(
        `${convictUser} has been kicked successfully. | ${reason}`,
      );

    await convictUser.send({ embeds: [userEmbed] }).catch(() => {});

    await guildUser.kick(reason).catch((error) => {
      console.log(error);
      return interaction.reply("Something went wrong");
    });

    return await interaction.reply({ embeds: [guildEmbed] });
  },
};
