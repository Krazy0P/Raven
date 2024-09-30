const { query } = require("../sqlsetup");

module.exports = {

    LogType: {
        ban: "ban",
        unban: "unban",
        kick: "kick",
        timeout: "timeout",
        strike: "strike"
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
        return await query(`select * from ${logtype}_logs where id=?`,[id]);
    },

    async getAppealsById(id) {
        return await query("select * from appeals where id=?",[id]);
    },


    async appendAppeal(id,appeal) {
        return await query("insert into appeals values(?, ?)", [id, appeal]);
    },

    async getStrikes(user_id, guild_id) {
        return await query("select strikes from strikes where user_id=? and guild_id=?",[user_id, guild_id]);
    },

    async getStrikeRrwards(guild_id) {
        return await query("select action");
    },

    async addStrikes(user_id, guild_id, value) {
        const [exists] = await query("select strikes from strikes where user_id=? and guild_id=?",[user_id, guild_id]);
        
        let initial_strikes = 0;
        let strike_count = value;
        
        if (exists[0] !== undefined) {
            initial_strikes = exists[0]['strikes'];
            strike_count = initial_strikes + value;

            await query("update strikes set strikes=? where user_id=? and guild_id=?",[strike_count, user_id, guild_id]);
            
        } else {
            await query("insert into strikes values(?, ?, ?)", [user_id, guild_id, value]);
        }
        return [initial_strikes, strike_count];
    }
}