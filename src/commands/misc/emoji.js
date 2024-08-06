const { SlashCommandBuilder } = require("discord.js");
const { Guild } = require("../../info/guild");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("emoji")
        .setDescription("Adds a random emoji to your server")
        .setDMPermission(false),
    
    async execute(interaction) {

        const guildId = await interaction.guild.id;

        const emojiGuild = new Guild(guildId);

        const coolDown = 10; // cooldown in seconds

        if ((emojiGuild.getTimestamp() + (coolDown * 1000)) > (interaction.id / 4194304 + 1420070400000)) {
            return await interaction.reply(`You can use the command again in <t:${parseInt(emojiGuild.getTimestamp()/1000) + (coolDown - 10)}:R>`)
        } else {
            emojiGuild.updateTimestmap(parseInt(interaction.id / 4194304) + 1420070400000);
        }

        const response = await fetch("https://emoji.gg/");
        const body = await response.text();

        let emojis = body.split(" ")
            .filter(text => 
                text.includes("data-src=\"https://cdn3.emoji.gg/emojis")
            )
            .map(text => 
                text.substring(39,text.length-1)
            )

        let emojiID = emojis.at(Number(Math.random() * emojis.length));

        let i = 1;

        for (;emojiGuild.getEmojis().includes(emojiID) && i <= emojis.length;i++) {
            emojis = emojis.splice(emojis.indexOf(emojiID),1);
            emojiID = emojis.at(Number(Math.random() * emojis.length));
        }
        if (i===emojis.length) {
            return await interaction.reply("Oops! something went wrong");
        } else {
            emojiGuild.appendEmojis(emojiID);
        }


        let emojiString = "";

        await interaction.guild.emojis.create({
            name: emojiID.substring( emojiID.indexOf("-") + 1 , emojiID.lastIndexOf(".") ).replace("-","_"),
            attachment: `https://cdn3.emoji.gg/emojis/${emojiID}`
        }).then((emoji) => {
            emojiString = `<:${emoji.name}:${emoji.id}>`
        })
        .catch((error) => {
            console.log(error)
        })

        await interaction.reply(`Emoji has been added!`)
        await interaction.followUp(emojiString)
    }
}