const { Events, ActivityType, Client } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}`);
        
        client.user.setPresence({
            activities: [{
                name: 'VALORANT',
                type: ActivityType.Streaming,
                url: 'https://www.twitch.tv/valorant'
            }],
        });

        require('../deploy')
    },
};