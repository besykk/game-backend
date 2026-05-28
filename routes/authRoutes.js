const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middlewares/authMiddleware");

const { getPlayerByName } = require("../models/playerModel");
const { isNotEmptyString } = require("../utils/validators");

function createAuthRoutes() {
    const router = express.Router();

    router.post("/login", async (req, res, next) => {
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

            const isPasswordValid = await bcrypt.compare(password, player.password_hash);

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
    });

    router.get("/me", authMiddleware, (req, res) => {
        res.json({
            message: "Token is valid",
            user: req.user,

        });

    });

    return router;
}

module.exports = createAuthRoutes;