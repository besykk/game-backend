const pool = require("../db/connection");

async function checkDatabaseConnection() {
    const [rows] = await pool.query("SELECT 1 AS status");

    return rows[0];
}

module.exports = {
    checkDatabaseConnection,
};