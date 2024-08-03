const fs = require("fs");
const path = require("path");
const { Logs, LogType } = require("./log");


class Guild {
    #serverPath = path.join(__dirname,"../../data/server.json");
    #serverData = JSON.parse(fs.readFileSync(this.#serverPath));

    logs;
    constructor( guildID ) {

        if (!this.#serverData[guildID]) {
            this.#serverData[guildID] = {};
        }

        this.guild = this.#serverData[guildID];

        this.logs = new Logs(this.guild)

    }

    appendEmojis(emojiId) {
        try {
            this.guild.emojis.push(emojiId);
        } catch {
            this.guild.emojis = [emojiId];
        }
        this.saveData();
    }

    updateTimestamp(time) {
        this.guild.time = time;
        this.saveData();
    }

    getEmojis() {
        return this.guild.emojis || [];
    }

    getTimestamp() {
        return this.guild.time || 0;
    }

    saveData() {
        fs.writeFileSync(this.#serverPath, JSON.stringify(this.#serverData, null, 2));
    }

}


module.exports = { Guild, LogType }