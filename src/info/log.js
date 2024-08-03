

const LogType =  {
    kick: 'kick',
    ban: 'ban'
}

class Logs {

    guildLogs;

    constructor(guild) {
        if (!guild.logs)
            guild.logs = {};

        this.guildLogs = guild.logs;
    }

    getLog(log) {
        return this.guildLogs[log] || {};
    }

    appendLog(log,interaction, reason) {
        const time = String(parseInt(interaction.id/4194304) + 1420070400000);
        const convict = interaction.options.getUser("user");



        
        const data = {
            moderatorName: interaction.user.globalName,
            moderatorId: interaction.user.id,

            convictName: convict.globalName,
            convictId: convict.id,

            reason: reason,
            time: time
            
        }

        if (!this.guildLogs[log])
            this.guildLogs[log] = {}

        this.guildLogs[log][time] = data;

    }
}

module.exports = { Logs, LogType }