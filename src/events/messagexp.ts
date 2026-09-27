import { getUserExp } from "@/util/messagexp";
import supabase from "@/util/supabase";
import {
  Colors,
  EmbedBuilder,
  Events,
  Message,
  TextChannel,
  type Channel,
} from "discord.js";

export default {
  name: Events.MessageCreate,

  async execute(message: Message) {
    if (message.author.bot || !message.guild) return;

    const cached = await getUserExp(message.author.id, message.guild.id);
    if (!cached) return;

    cached.xp += 1;
    cached.weekly_xp += 1;
    cached.dirty = true;

    if (cached.xp >= parseInt(process.env.THRESHOLD_XP!) * cached.level) {
      cached.xp = 0;
      cached.level += 1;

      const embed = new EmbedBuilder()
        .setTitle("Level Up!")
        .setDescription(
          `${message.author} has reached **Level ${cached.level}**!`,
        )
        .setThumbnail(message.author.displayAvatarURL())
        .setColor(Colors.Gold)
        .setTimestamp();

      const { data, error } = await supabase
        .from("level up channel")
        .select("*")
        .eq("guild_id", message.guild.id)
        .single();

      let channel: TextChannel;
      if (error) return;
      if (!data) channel = message.channel as TextChannel;
      else
        channel = message.guild.channels.cache.get(
          data.channel_id,
        )! as TextChannel;

      await channel.send({ embeds: [embed] }).catch(() => {});
    }
  },
};
