const fs = require("fs");
const path = require("path");
require("../../data/user.json")

class Economy {

    #dataFilePath = path.join(__dirname, "../../data/user.json");
    #userDataList = JSON.parse(fs.readFileSync(this.#dataFilePath));

    #defaultStructurePath = path.join(__dirname,"./defaultStructure.json")
    #defaultDatStructure = JSON.parse(fs.readFileSync(this.#defaultStructurePath))

    constructor(userID) {

        if (!this.#userDataList[userID]) {
            this.#userDataList[userID] = this.#defaultDatStructure;
        }
        
        this.data = this.#userDataList[userID]
        
        this.#saveData();
    }

    #saveData() {
        fs.writeFileSync(this.#dataFilePath, JSON.stringify(this.#userDataList, null, 2));
    }
}

module.exports = { Economy }