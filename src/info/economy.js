const fs = require("fs");
const path = require("path");

class Economy {

    #dataFilePath = path.join(__dirname, "../../data/user.json");
    #userDataList = JSON.parse(fs.readFileSync(this.#dataFilePath));

    defaultStructPath = path.join(__dirname,"./userStruct.json")
    defaultDataStruct = JSON.parse(fs.readFileSync(this.defaultStructPath))

    constructor( userID ) {

        if (!this.#userDataList[userID]) {
            this.#userDataList[userID] = this.defaultDataStruct;
        }
        
        this.data = this.#userDataList[userID];
        
        this.saveData();
    }

    saveData() {
        fs.writeFileSync(this.#dataFilePath, JSON.stringify(this.#userDataList, null, 2));
    }
}

module.exports = { Economy }