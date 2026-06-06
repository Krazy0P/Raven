import supabase from "@/util/supabase";
import logger from "@/util/logger";

const expCache = new Map<
  string,
  {
    xp: number;
    level: number;
    dirty: boolean;
    weekly_xp: number;
  }
>();

logger.log("Loading user xp.");

const { data } = await supabase.from("chat xp").select("*");
data?.forEach((row) => {
  expCache.set(`${row.user_id}:${row.guild_id}`, {
    xp: row.xp,
    weekly_xp: row.weekly_xp,
    level: row.level,
    dirty: false,
  });
});

logger.log("Loaded user xp successfully!");

setInterval(async () => {
  const dirty = [...expCache.entries()].filter(([, v]) => v.dirty);

  for (let i = 0; i < dirty.length; i += 100) {
    const chunk = dirty.slice(i, i + 100);
    await Promise.all(
      chunk.map(async ([key, data]) => {
        const [userId, guildId] = key.split(":");
        await supabase
          .from("chat xp")
          .update({ xp: data.xp, weekly_xp: data.weekly_xp, level: data.level })
          .eq("user_id", userId!)
          .eq("guild_id", guildId!);
        data.dirty = false;
      }),
    );
  }
}, 60_000);

export default expCache;
