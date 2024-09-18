const fs = require("node:fs");
const dotenv = require("dotenv");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
	],
});

client.commands = new Collection();
client.cooldowns = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

const componentFolderPath = path.join(__dirname, "components");
const componentFolders = fs.readdirSync(componentFolderPath);

for (const folder of componentFolders) {
    const folderPath = path.join(componentFolderPath, folder);
    const subFolders = fs.readdirSync(folderPath);

    for (const file of subFolders) {
        const filePath = path.join(folderPath,file);
        const component = require(filePath);

        if ("data" in component && "execute" in component) {
            switch (folder) {
                case "buttons":
                    client.buttons.set(component.data.data.custom_id, component);
                    break;
                case "modals":
                    client.modals.set(component.data.data.custom_id,component);
                    break;
            }
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.login(process.env.DISCORD_TOKEN);
