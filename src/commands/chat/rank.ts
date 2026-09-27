import supabase from "@/util/supabase";
import { generateRankCard } from "@/util/rankCard";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
  AttachmentBuilder,
} from "discord.js";
import { getUserExp } from "@/util/messagexp";

export default {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Check your XP and level")
    .addUserOption((option) =>
      option.setName("user").setDescription("User to check").setRequired(false),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const user = interaction.options.getUser("user") || interaction.user;
    const guild = interaction.guild!;

    const cached = await getUserExp(user.id, guild.id);
    if (!cached) {
      await interaction.editReply({ content: "Failed to load user XP data." });
      return;
    }

    const { count } = await supabase
      .from("chat xp")
      .select("*", { count: "exact", head: true })
      .eq("guild_id", guild.id)
      .or(
        `level.gt.${cached.level},and(level.eq.${cached.level},xp.gt.${cached.xp})`,
      );

    const buffer = await generateRankCard({
      username: user.globalName ?? user.username,
      avatarURL: user.displayAvatarURL({ extension: "png", size: 256 }),
      level: cached.level,
      xp: cached.xp,
      requiredXP: parseInt(process.env.THRESHOLD_XP!),
      rank: (count ?? 0) + 1,
    });

    const attachment = new AttachmentBuilder(buffer, { name: "rank.png" });

    // const requiredXP = data.level * parseInt(process.env.THRESHOLD_XP!);
    // const progress = Math.floor((data.xp / requiredXP) * 20); // 20 char bar
    // const bar = "█".repeat(progress) + "░".repeat(20 - progress);

    // const embed = new EmbedBuilder()
    //   .setTitle(`${user.globalName ?? user.username}'s XP`)
    //   .setThumbnail(user.displayAvatarURL())
    //   .setColor(Colors.Blurple)
    //   .addFields(
    //     { name: "Level", value: `${data.level}`, inline: true },
    //     { name: "XP", value: `${data.xp} / ${requiredXP}`, inline: true },
    //     { name: "Progress", value: `\`${bar}\`` },
    //   )
    //   .setFooter({ text: `User ID: ${user.id}` })
    //   .setTimestamp();

    return interaction.editReply({
      //embeds: [embed],
      content: "-# Rank refreshes every 60s",
      files: [attachment],
    });
  },
};
