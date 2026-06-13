import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
} from "discord.js";
import {
  getOrCreateUser,
  addToWallet,
  formatCoins,
  isOnCooldown,
  formatCooldown,
} from "@/util/economy";
import supabase from "@/util/supabase";

const COOLDOWN = 60 * 60 * 1000; // 1 hour
const JOBS = [
  { job: "Programmer", msg: "You wrote some code", min: 100, max: 300 },
  { job: "Chef", msg: "You cooked some food", min: 80, max: 250 },
  { job: "Driver", msg: "You drove someone around", min: 60, max: 200 },
  { job: "Streamer", msg: "You streamed for your fans", min: 50, max: 400 },
  { job: "Teacher", msg: "You taught a class", min: 90, max: 280 },
];

export default {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Work to earn coins"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const eco = await getOrCreateUser(interaction.user.id);
    const remaining = isOnCooldown(eco.last_work, COOLDOWN);

    if (remaining > 0) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(
              `⏰ You need to rest! Come back in **${formatCooldown(remaining)}**`,
            ),
        ],
      });
    }

    const job = JOBS[Math.floor(Math.random() * JOBS.length)]!;
    const earned =
      Math.floor(Math.random() * (job.max - job.min + 1)) + job.min;

    await addToWallet(interaction.user.id, earned);
    await supabase
      .from("economy")
      .update({
        last_work: new Date().toISOString(),
        work_hours: eco.work_hours! + 1,
      })
      .eq("user_id", interaction.user.id);

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Green)
          .setTitle(`💼 ${job.job}`)
          .setDescription(`${job.msg} and earned ${formatCoins(earned)}!`),
      ],
    });
  },
};
