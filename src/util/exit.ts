import { Client } from "discord.js";
import expCache from "@/util/messagexp";
import supabase from "@/util/supabase";
import logger from "@/util/logger";

export default function registerShutdownHandler(client: Client) {
  process.on("SIGINT", async () => {
    console.log("");
    logger.info("Shutting down...");

    logger.info("Updating chat experience data...");
    let count = 0;
    for (const [key, data] of expCache.entries()) {
      if (!data.dirty) continue;
      const [userId, guildId] = key.split(":");
      await supabase
        .from("chat xp")
        .update({ xp: data.xp, level: data.level })
        .eq("user_id", userId!)
        .eq("guild_id", guildId!);
      count++;
    }
    logger.info(`Updated ${count} rows`);

    client.destroy();
    process.exit(0);
  });
}
