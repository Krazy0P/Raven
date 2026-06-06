import supabase from "@/util/supabase";
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Check your server's chat leaderboard"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const guild = interaction.guild!;

    const { data, error } = await supabase
      .from("chat xp")
      .select("*")
      .eq("guild_id", guild.id)
      .order("level", { ascending: false })
      .order("xp", { ascending: false })
      .limit(10);

    const embed = new EmbedBuilder()
      .setTitle(`${interaction.guild!.name}`)
      .setDescription("Server Leaderboard")
      .setThumbnail(interaction.guild!.iconURL())
      .setColor(Colors.Gold)
      .setFooter({
        text: `Top ${data?.length} users • Cache is uploaded to server every 60s`,
      })
      .setTimestamp();

    data?.forEach((value, index) => {
      embed.addFields({
        name: ``,
        value: `
          **#${index + 1} - <@${value.user_id}>**
          Level: \`${value.level}\`
          Exp: \`${value.xp}\`
        `,
      });
    });

    return interaction.editReply({ embeds: [embed] });
  },
};
