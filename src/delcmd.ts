import { REST, Routes } from "discord.js";
import logger from "@/util/logger";

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

const args = process.argv.slice(2);

if (args[0] === "all") {
  rest
    .put(Routes.applicationCommands(process.env.CLIENT_ID!), { body: [] })
    .then(() => logger.info("Successfully deleted all application commands."))
    .catch(console.error);
} else {
  logger.info(`Deleting ${args.length} command(s)`);

  for (const commandID of args) {
    rest
      .delete(Routes.applicationCommand(process.env.CLIENT_ID!, commandID))
      .then(() => logger.info(`Successfully deleted command ${commandID}`))
      .catch(console.error);
  }
}
