const fs = require("fs");
const path = require("path");

class Guild {

    #serverEmojiPath = path.join(__dirname,"../../data/emoji.json");
    #serverEmojiData = JSON.parse(fs.readFileSync(this.#serverEmojiPath));
    
    #defaultStructPath = path.join(__dirname,"./serverStruct.json");
    #defaultDataStruct = JSON.parse(fs.readFileSync(this.#defaultStructPath));

    constructor( guildID ) {

        if (!this.#serverEmojiData[guildID]) {
            this.#serverEmojiData[guildID] = this.#defaultDataStruct;
        }

        this.guild = this.#serverEmojiData[guildID];

        this.saveData();

    }

    saveData() {
        fs.writeFileSync(this.#serverEmojiPath, JSON.stringify(this.#serverEmojiData, null, 2));
    }
}

module.exports = { Guild }