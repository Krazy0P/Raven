import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ChatInputCommandInteraction,
  InteractionContextType,
} from "discord.js";
import duration from "@/util/duration";
import supabase from "@/util/supabase";

export default {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Puts the user on timeout")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to timeout on")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("Set the time duration for the timeout")
        .setRequired(true)
        .setMinLength(2),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Specify a reason for the timeout")
        .setRequired(false)
        .setMaxLength(512),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const convictUser = interaction.options.getUser("user")!;
    const time = interaction.options.getString("time")!.toLowerCase().trim();
    const timePostfix = time.at(-1)!;
    const reason =
      interaction.options.getString("reason") || "No reason was specified";
    const guild = interaction.guild!;

    if (convictUser.id === interaction.user.id) {
      const returnEmbed = new EmbedBuilder()
        .setColor("DarkRed")
        .setDescription(`Bruh, you can't put timeout on yourself`);
      return interaction.reply({
        embeds: [returnEmbed],
        flags: "Ephemeral",
      });
    }

    const guildUser = await guild.members
      .fetch({ user: convictUser.id, force: true })
      .catch();

    if (!guildUser) {
      return await interaction.reply({
        content: "User is not in this server",
        flags: "Ephemeral",
      });
    } else if (!guildUser.moderatable) {
      return await interaction.reply({
        content: `Sadly, I can't set timeout on ${convictUser}`,
        flags: "Ephemeral",
      });
    } else if (
      !Object.keys(duration).includes(timePostfix) ||
      Number.isNaN(parseInt(time.substring(0, time.length - 1)))
    ) {
      return await interaction.reply({
        content: "Well check the time duration again",
        flags: "Ephemeral",
      });
    }

    let timeDuration = duration[timePostfix as keyof typeof duration](
      time.substring(0, time.length - 1),
    );

    if (timeDuration > 2419200) {
      timeDuration = 2419200;
    } else if (timeDuration == 0) {
      return await interaction.reply({
        content: "Time duration cannot be zero",
        flags: "Ephemeral",
      });
    }

    await interaction.deferReply();

    await supabase.from("actions").insert({
      mod_name: interaction.user.globalName!,
      mod_id: interaction.user.id,
      convict_name: convictUser.globalName!,
      convict_id: convictUser.id,
      guild_name: guild.name,
      guild_id: guild.id,
      action: "timeout",
      reason: reason,
      duration: timeDuration,
    });

    let userTimeDuration: String = time;

    switch (timePostfix) {
      case "s":
        userTimeDuration = userTimeDuration.replace("s", " seconds");
        break;

      case "m":
        userTimeDuration = userTimeDuration.replace("s", " minutes");
        break;

      case "h":
        userTimeDuration = userTimeDuration.replace("s", " hours");
        break;

      case "d":
        userTimeDuration = userTimeDuration.replace("s", " days");
        break;
    }

    if (time.slice(0, -1) === "1")
      userTimeDuration = userTimeDuration.slice(0, -1);

    const userEmbed = new EmbedBuilder()
      .setColor("NotQuiteBlack")
      .setDescription(
        `Hey ${convictUser}, You have been timed out in ${guildUser.guild.name} for ${userTimeDuration} | ${reason}`,
      );
      
    await convictUser.send({ embeds: [userEmbed] }).catch(() => {});

    const guildEmbed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(
        `${convictUser} has been timed out successfully for ${userTimeDuration}. | ${reason}`,
      );

    await guildUser.timeout(timeDuration * 1000, reason).catch((error) => {
      console.log(error);
      interaction.editReply("Something went wrong");
    });

    await interaction.editReply({ embeds: [guildEmbed] });
  },
};
