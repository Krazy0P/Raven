const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: 'server_logs'
}).promise();

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err.stack);
        return;
    }
    console.log("Connected to the database");
});

async function query(args, param) {

    try {
        return await connection.query(args, param);
    } catch (error) {
        console.log(error)
    }
}

module.exports = { connection, query }