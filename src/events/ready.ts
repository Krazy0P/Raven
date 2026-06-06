import { Events, ActivityType } from "discord.js";
import chalk from "chalk";
import logger from "@/util/logger";
export default {
  name: Events.ClientReady,
  once: true,

  execute(client: CustomClient) {
    logger.info(`Logged in as ${chalk.green.bold(client.user?.tag)}`);

    client.user?.setPresence({
      activities: [
        {
          name: "Depression",
          type: ActivityType.Streaming,
          url: "https://www.twitch.tv/valorant",
        },
      ],
    });
  },
};
