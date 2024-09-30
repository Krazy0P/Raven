const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: 'servers',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit:0
}).promise();


async function query(args, param) {
    let connection;
    try {
        connection = await pool.getConnection();
        return await connection.query(args, param);
    } catch (error) {
        console.log(error);
    } finally {
        if (connection)
            connection.release();
    }
}

module.exports = { query }