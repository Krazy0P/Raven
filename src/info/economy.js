const { query } = require("../sqlsetup");

class Economy {
    constructor( user ) {
        this.user = user
    }

    async addUser() {
        await query(
            "insert into economy.bank (id) values (?)",
            [this.user.id]
        )
    }

    async getUser() {
        const [result] = await query(
            "select pocket, bank, bank_limit from economy.bank where id=?",
            [ this.user.id ]
        )
        return result[0] || { pocket: 0, bank: 0, bank_limit: 5000 };
    }
}

module.exports = { Economy }