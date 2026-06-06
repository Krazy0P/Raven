import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { REST, Routes, SlashCommandBuilder } from "discord.js";
import chalk from "chalk";
import logger from "@/util/logger";

interface Command {
  data: SlashCommandBuilder;
  execute: (...args: unknown[]) => Promise<void>;
}

const commands: ReturnType<SlashCommandBuilder["toJSON"]>[] = [];

const foldersPath = path.join(import.meta.dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command: Partial<Command> = (await import(pathToFileURL(filePath).href)).default;
    
    if ("data" in command && "execute" in command) {
      commands.push(command.data!.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

try {
  logger.info(`Started refreshing ${chalk.bold(commands.length)} application commands.`);

  const data = await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID!),
    { body: commands },
  ) as unknown[];

  logger.info(`Successfully reloaded ${chalk.bold(data.length)} application commands.`);
} catch (error) {
  logger.error(error);
}
process.exit(0)