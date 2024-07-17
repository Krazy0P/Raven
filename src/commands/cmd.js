const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Info about the bot!'),

    async execute(itneraction) {
        await itneraction.reply('Hey there!')
    }

}