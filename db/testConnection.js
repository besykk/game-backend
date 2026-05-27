require("dotenv").config();

const pool = require("./connection");

async function testConnection() {
    try {
        const [rows] = await pool.query("SELECT * FROM players");

        console.log("Подключение к MySQL работает");
        console.log(rows);

        process.exit(0);
    } catch (error) {
        console.error("Ошибка подключения к MySQL:");
        console.error(error);
        process.exit(1);
    }
}

testConnection();