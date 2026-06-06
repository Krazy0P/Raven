import { Client, Collection, GatewayIntentBits } from "discord.js";
import loadCommands from "@/loader/cmds";
import loadEvents from "@/loader/events";
import loadComponents from "./loader/components";
import registerShutdownHandler from "@/util/exit";
import logger from "./util/logger";

const client: CustomClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

client.commands = new Collection();
client.cooldowns = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

loadCommands(client);
loadEvents(client);
loadComponents(client);

registerShutdownHandler(client);

setInterval(() => {
  const mem = process.memoryUsage();
  logger.debug(`RAM: ${Math.round(mem.rss / 1024 / 1024)}MB | Heap: ${Math.round(mem.heapUsed / 1024 / 1024)}/${Math.round(mem.heapTotal / 1024 / 1024)}MB`);
}, 1000);

client.login(process.env.DISCORD_TOKEN);
