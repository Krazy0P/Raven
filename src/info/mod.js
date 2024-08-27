const { query } = require("../sqlsetup");

module.exports = {

    LogType: {
        ban: "ban",
        unban: "unban",
        kick: "kick",
        timeout: "timeout",
    },

    discordSnowflakeConstant: 1420070400000,

    NoReason: "No reason was specified",

    async appendLog(log, interaction, duration = 0) {
        const time = parseInt(interaction.id / 4194304);
        const convict = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

        let execCmd = `insert into ${log}_logs values (?, ?, ?, ?, ?, ?, ?, ?)`;
        let execArg = [
            time, // id
            interaction.user.username, // mod_name
            interaction.user.id, // mod_id
            convict.username, // convict_name
            convict.id, // convict_id
            interaction.guild.name, // guild_name
            interaction.guild.id, // guild_id
            reason, // reason
        ];

        if (duration !== 0) {
            execCmd = execCmd.replace(")", ", ?)");
            execArg.push(duration);
        }

        await query(execCmd, execArg);

        return execArg;
    },

    async getLogById(logtype, id) {
        return await query(`select * from server_logs.${logtype}_logs where id=?`,[id]);
    },

    async getAppealsById(id) {
        return await query("select * from server_logs.appeals where id=?",[id]);
    },


    async appendAppeal(id,appeal) {
        return await query("insert into server_logs.appeals values(?, ?)", [id, appeal]);
    }
}