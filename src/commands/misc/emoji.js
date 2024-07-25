const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("emoji")
        .setDescription("Adds a random emoji to your server"),
    
    async execute(interaction) {

        const response = await fetch("https://emoji.gg/");
        const body = await response.text();

        const srcs = body.split(" ")
            .filter(text => text.includes("data-src=\"https://cdn3.emoji.gg/emojis"))
            .map(text => text.substring(39,text.length-1))

        const emojiID = srcs.at(Number(Math.random() * srcs.length));

        const filePath = "../../../data/emoji.json";

        const serverEmojiPath = path.join(__dirname,filePath);
        const serverEmojiData = JSON.parse(fs.readFileSync(serverEmojiPath));

        let i = 1;

        const guildId = await interaction.guild.id;

        if (serverEmojiData[guildId] === undefined) {
            serverEmojiData[guildId] = [emojiID]
        } 
        else {
            for (;serverEmojiData[guildId].includes(emojiID) && i <= srcs.length;i++) {
                emojiID = srcs.at(Number(Math.random() * srcs.length))
            }
            if (i===srcs.length) {
                return await interaction.reply("Oops! something went wrong");
            } else {
                serverEmojiData[guildId].push(emojiID)
            }
        }

        fs.writeFileSync(serverEmojiPath, JSON.stringify(serverEmojiData,null,2));

        await interaction.guild.emojis.create({
            name: emojiID.substring( emojiID.indexOf("-") + 1 , emojiID.lastIndexOf(".") ).replace("-","_"),
            attachment: `https://cdn3.emoji.gg/emojis/${emojiID}`
        }).catch((error) => {
            console.log(error)
        })

        await interaction.reply("Emoji has been added!")
    }
}