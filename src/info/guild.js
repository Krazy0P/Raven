const fs = require("fs");
const path = require("path");

class Guild {
    #serverEmojiPath = path.join(__dirname,"../../data/emoji.json");
    #serverEmojiData = JSON.parse(fs.readFileSync(this.#serverEmojiPath));

    constructor( guildID ) {

        if (!this.#serverEmojiData[guildID]) {
            this.#serverEmojiData[guildID] = {};
        }

        this.guild = this.#serverEmojiData[guildID];

        this.saveData();

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
        fs.writeFileSync(this.#serverEmojiPath, JSON.stringify(this.#serverEmojiData, null, 2));
    }
}



module.exports = { Guild }