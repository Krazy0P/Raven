const { REST, Routes } = require('discord.js');
const dotenv = require("dotenv");
dotenv.config();

const rest = new REST().setToken(process.env.DISCORD_TOKEN)

const args = process.argv.slice(2);

console.log(`Deleting ${args.length} command(s)`);

for (const commandID of args) {
    rest.delete(Routes.applicationCommand(process.env.CLIENT_ID, commandID))
    .then(() => console.log(`Successfully deleted command ${commandID}`))
    .catch(console.error);
}
    
