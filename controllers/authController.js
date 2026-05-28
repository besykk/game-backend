const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {
    getPlayerByName,
    registerPlayer,
} = require("../models/playerModel");

const { isNotEmptyString } = require("../utils/validators");

async function registerController(req, res, next) {
    try {
        const name = req.body?.name;
        const password = req.body?.password;

        if (!isNotEmptyString(name)) {
            return res.status(400).json({
                message: "Введите имя",
            });
        }

        if (!isNotEmptyString(password)) {
            return res.status(400).json({
                message: "Введите пароль",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Пароль должен быть минимум 6 символов",
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newPlayer = await registerPlayer(name, passwordHash);

        res.status(201).json({
            message: "Регистрация успешна",
            player: newPlayer,
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                message: "Игрок с таким именем уже существует",
            });
        }

        next(error);
    }
}

async function loginController(req, res, next) {
    try {
        const name = req.body?.name;
        const password = req.body?.password;

        if (!isNotEmptyString(name)) {
            return res.status(400).json({
                message: "Введите имя",
            });
        }

        if (!isNotEmptyString(password)) {
            return res.status(400).json({
                message: "Введите пароль",
            });
        }

        const player = await getPlayerByName(name);

        if (!player) {
            return res.status(404).json({
                message: "Игрок не найден",
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            player.password_hash
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Неверный пароль",
            });
        }

        const token = jwt.sign(
            {
                id: player.id,
                name: player.name,
                role: player.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

        res.json({
            message: "Login success",
            token,
            player: {
                id: player.id,
                name: player.name,
                role: player.role,
            },
        });
    } catch (error) {
        next(error);
    }
}

function meController(req, res) {
    res.json({
        message: "Token is valid",
        user: req.user,
    });
}

module.exports = {
    registerController,
    loginController,
    meController,
};