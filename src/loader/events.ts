import fs from "node:fs";
import chalk from "chalk";
import path from "node:path";
import logger from "@/util/logger";

export default async function loadEvents(client: CustomClient) {
  const eventsPath = path.join(__dirname, "..", "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".ts"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = (await import(filePath)).default;
    if ("name" in event && "execute" in event) {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    } else {
      logger.warn(
          `The command at ${chalk.bold(filePath)} is missing a required ${chalk.bold("name")} or ${chalk.bold("execute")} property.`,
        );
    }
  }
}
