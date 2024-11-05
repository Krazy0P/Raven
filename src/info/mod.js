const { query } = require("../sqlsetup");

module.exports = {

    LogType: {
        ban: "ban",
        unban: "unban",
        kick: "kick",
        timeout: "timeout",
        strike: "strike"
    },

    calcDuration: {
        s: (str) => parseInt(str),
        m: (str) => parseInt(str) * 60,
        h: (str) => parseInt(str) * 60 * 60,
        d: (str) => parseInt(str) * 60 * 60 * 24
    },

    discordSnowflakeConstant: 1420070400000,

    NoReason: "No reason was specified",

    async appendLog(log, interaction, duration = 0) {
        const time = parseInt(interaction.id / 4194304);
        const convict = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

        let execCmd = `
            INSERT INTO ${log}_logs 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        let execArg = [
            time,                       // id
            interaction.user.username,  // mod_name
            interaction.user.id,        // mod_id
            convict.username,           // convict_name
            convict.id,                 // convict_id
            interaction.guild.name,     // guild_name
            interaction.guild.id,       // guild_id
            reason,                     // reason
        ];

        if (duration !== 0) {
            execCmd = execCmd.replace(")", ", ?)");
            execArg.push(duration);
        }

        await query(execCmd, execArg);

        return execArg;
    },

    async getLogById(logtype, id) {
        return await query(`
            SELECT * 
            FROM ${logtype}_logs 
            WHERE id=?`,
            [id]
        );
    },

    async getAppealsById(id) {
        return await query(`
            SELECT * 
            FROM appeals 
            WHERE id=?`,
            [id]
        );
    },


    async appendAppeal(id,appeal) {
        return await query(`
            INSERT INTO appeals 
            VALUES(?, ?)`, 
            [id, appeal]
        );
    },

    async getStrikes(user_id, guild_id) {
        return await query(`
            SELECT strikes 
            FROM strikes 
            WHERE user_id=? AND guild_id=?`,
            [user_id, guild_id]
        );
    },

    async getStrikeRrwards(guild_id) {
        return await query(`
            SELECT action
            FROM strike_reward
            WHERE guild_id=?`,
            [guild_id]
        );
    },

    async addStrikes(user_id, guild_id, value) {
        const [exists] = await query(`
            SELECT strikes 
            FROM strikes 
            WHERE user_id=? AND guild_id=?`,
            [user_id, guild_id]
        );
        
        let initial_strikes = 0;
        let strike_count = value;
        
        if (exists[0] !== undefined) {
            initial_strikes = exists[0]['strikes'];
            strike_count = initial_strikes + value;

            await query(`
                UPDATE strikes 
                SET strikes=? 
                WHERE user_id=? AND guild_id=?`,
                [strike_count, user_id, guild_id]
            );
            
        } else {
            await query(`
                INSERT INTO strikes 
                VALUES(?, ?, ?)`, 
                [user_id, guild_id, value]
            );
        }
        return [initial_strikes, strike_count];
    },

    async getModLog(user_id) {

    }
}