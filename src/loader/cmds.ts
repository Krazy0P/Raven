import fs from "node:fs";
import chalk from "chalk";
import path from "node:path";
import logger from "@/util/logger";

export default async function loadCommands(client: CustomClient) {
  if (!client.commands) {
    logger.error("Client does not have commands property");
    process.exit(1);
  }

  const foldersPath = path.join(__dirname, "..", "commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".ts"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = (await import(filePath)).default;

      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
      } else {
        logger.warn(
          `The command at ${chalk.bold(filePath)} is missing a required ${chalk.bold("data")} or ${chalk.bold("execute")} property.`,
        );
      }
    }
  }
}
