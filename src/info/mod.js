const { query } = require("../sqlsetup");

module.exports = {

    LogType: {
        ban: "ban",
        unban: "unban",
        kick: "kick",
        timeout: "timeout",
    },

    NoReason: "No reason was specified",

    async appendLog(log, interaction, duration = 0) {
        const time = parseInt(interaction.id / 4194304) + 1420070400000;
        const convict = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

        let execCmd = `insert into ${log}_logs values (?, ?, ?, ?, ?, ?, ?)`;
        let execArg = [
            time, // id
            interaction.user.username, // mod_name
            interaction.user.id, // mod_id
            convict.username, // convict_name
            convict.id, // convict_id
            reason, // reason
            interaction.guild.id, // guild_id
        ];

        if (duration !== 0) {
            execCmd = execCmd.replace(")", ", ?)");
            execArg.push(duration);
        }

        query(execCmd, execArg);
    }
}