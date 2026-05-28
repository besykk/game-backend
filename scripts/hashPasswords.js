require("dotenv").config();

const bcrypt = require("bcrypt");
const pool = require("../db/connection");

async function hashPasswords() {
    try {
        const defaultPassword = "123456";
        const saltRounds = 10;

        const passwordHash = await bcrypt.hash(defaultPassword, saltRounds);

        await pool.query(
            "UPDATE players SET password_hash = ?",
            [passwordHash]
        );

        console.log("Пароли успешно захешированы");
        console.log("Пароль для всех тестовых игроков: 123456");

        process.exit(0);
    } catch (error) {
        console.error("Ошибка при хешировании паролей:");
        console.error(error);
        process.exit(1);
    }
}

hashPasswords();