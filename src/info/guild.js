const { query } = require("../sqlsetup");

class Guild {
    constructor(interaction) {
        this.interaction = interaction;
    }

    async updateEmojis(emojiID) {
        await query("insert into emoji_logs values (?, ?)", [
            this.interaction.guild.id,
            emojiID,
        ]);
    }

    async getEmojis() {
        const [result] = await query(
            "select emoji_id from emoji_logs where guild_id=?",
            [this.interaction.guild.id]
        );
        let emojis = [];

        for (const element of result) 
            emojis.push(element.emoji_id);

        return emojis;
    }

    async updateTimestamp() {
        const time = parseInt(this.interaction.id / 4194304) + 1420070400000;
        
        await query("insert into command_logs values(?, ?, ?)", [
            this.interaction.user.id,
            this.interaction.commandName,
            time
        ]);
    }

    async getTimestamp() {
        const [result] = await query(
            "select timestamp from command_logs where user_id=? and command_name=? order by timestamp desc",
            [this.interaction.user.id, this.interaction.commandName]
        );
        const data = result[0];
        return data ? data.timestamp : 0;
    }
}
module.exports = { Guild };
