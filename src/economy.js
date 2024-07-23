const fs = require("fs");
const path = require("path");

class Economy {

    #dataFilePath = path.join(__dirname, "../data/user.json");
    #userDataList = JSON.parse(fs.readFileSync(this.#dataFilePath));

    constructor(userID) {
        if (!this.#userDataList[userID]) {
            this.#userDataList[userID] = {
                pocket: 0,
                bank: 0,
                bankLimit: 5000,
            };
        }

        this.data = this.#userDataList[userID]
        
        this.#saveData();
    }

    #saveData() {
        fs.writeFileSync(this.#dataFilePath, JSON.stringify(this.#userDataList, null, 2));
    }
}

module.exports = { Economy }