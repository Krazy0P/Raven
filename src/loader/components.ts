import fs from "node:fs";
import chalk from "chalk";
import path from "node:path";
import logger from "@/util/logger";

export default async function loadComponents(client: CustomClient) {
  if (!client.buttons) {
    logger.error("Client does not have commands property");
    process.exit(1);
  }
  const componentFolderPath = path.join(__dirname, "..", "components");
  const componentFolders = fs.readdirSync(componentFolderPath);

  for (const folder of componentFolders) {
    const folderPath = path.join(componentFolderPath, folder);
    const subFolders = fs.readdirSync(folderPath);

    for (const file of subFolders) {
      const filePath = path.join(folderPath, file);
      const component = (await import(filePath)).default;

      if ("data" in component && "execute" in component) {
        switch (folder) {
          case "buttons":
            client.buttons.set(component.data.data.custom_id, component);
            break;
          case "modals":
            client.modals.set(component.data.data.custom_id, component);
            break;
        }
      } else {
        logger.warn(
          `${chalk.yellow.bold("[WARNING]")} The command at ${chalk.bold(filePath)} is missing a required ${chalk.bold("data")} or ${chalk.bold("execute")} property.`,
        );
      }
    }
  }
}
