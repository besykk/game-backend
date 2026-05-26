const express = require("express");

const Player = require("../classes/Players");
const { savePlayers } = require("../storage/playerStorage");
const logAction = require("../utils/logger");
const createAdminMiddleware = require("../middlewares/adminMiddleware");

const { isPositiveNumber, isNonNegativeNumber, isNotEmptyString, } = require("../utils/validators");

function createPlayersRoutes(players) {

    const router = express.Router();
    const adminMiddleware = createAdminMiddleware(players);

    router.get("/", (req, res) => {
        res.json(players);
    });

    router.get("/:id", (req, res) => {
        const playerId = Number(req.params.id);

        if (isNaN(playerId)) {
            return res.status(400).json({
                message: "Неверный ID игрока",
            });
        }

        const player = players.find((p) => p.id === playerId);

        if (!player) {
            return res.status(404).json({
                message: "Игрок не найден",
            });
        }

        res.json(player);
    });

    router.post("/", (req, res) => {
        const name = req.body.name;

        if (!isNotEmptyString(name)) {
            return res.status(400).json({
                message: "Введите имя игрока",
            });
        }

        const existingPlayer = players.find((p) => p.name === name);

        if (existingPlayer) {
            return res.status(400).json({
                message: "Игрок с таким именем уже существует",
            });
        }

        const maxId =
            players.length === 0 ? 0 : Math.max(...players.map((p) => p.id));

        const newId = maxId + 1;
        const newPlayer = new Player(newId, name, 1000, "user");

        players.push(newPlayer);
        savePlayers(players);
        logAction(`Player created: ${newPlayer.name} with ID ${newPlayer.id}`);

        res.status(201).json({
            message: "Игрок создан",
            player: newPlayer,
        });
    });

    router.post("/pay", (req, res) => {
        const fromId = Number(req.body.fromId);
        const toId = Number(req.body.toId);
        const amount = Number(req.body.amount);

        if (isNaN(fromId) || isNaN(toId) || isNaN(amount)) {
            return res.status(400).json({
                message: "fromId, toId и amount должны быть числами",
            });
        }

        if (!isPositiveNumber(amount)) {
            return res.status(400).json({
                message: "Сумма должна быть больше 0",
            });
        }

        if (fromId === toId) {
            return res.status(400).json({
                message: "Нельзя перевести деньги самому себе",
            });
        }

        const fromPlayer = players.find((p) => p.id === fromId);
        const toPlayer = players.find((p) => p.id === toId);

        if (!fromPlayer) {
            return res.status(404).json({
                message: "Отправитель не найден",
            });
        }

        if (!toPlayer) {
            return res.status(404).json({
                message: "Получатель не найден",
            });
        }

        const success = fromPlayer.removeMoney(amount);

        if (!success) {
            return res.status(400).json({
                message: "Недостаточно денег",
            });
        }

        toPlayer.addMoney(amount);

        savePlayers(players);
        logAction(`${fromPlayer.name} paid ${toPlayer.name} ${amount}`);

        res.json({
            message: `${fromPlayer.name} перевел ${toPlayer.name} ${amount}`,
            fromPlayer,
            toPlayer,
        });
    });

    router.delete("/:id", adminMiddleware, (req, res) => {
        const playerId = Number(req.params.id);
        const admin = req.admin;

        if (isNaN(playerId)) {
            return res.status(400).json({
                message: "Неверный ID игрока",
            });
        }
        
        if (playerId === adminId) {
            return res.status(400).json({
                message: "Нельзя удалить самого себя",
            });
        }

        const playerIndex = players.findIndex((p) => p.id === playerId);

        if (playerIndex === -1) {
            return res.status(404).json({
                message: "Игрок не найден",
            });
        }

        const deletedPlayer = players[playerIndex];

        players.splice(playerIndex, 1);

        savePlayers(players);
        logAction(
            `Admin ${admin.name} deleted player ${deletedPlayer.name} with ID ${deletedPlayer.id}`
        );

        res.json({
            message: `Игрок ${deletedPlayer.name} удалён`,
            admin: admin.name,
            player: deletedPlayer,
        });
    });

    router.put("/:id/money", adminMiddleware, (req, res) => {
        const playerId = Number(req.params.id);
        const admin = req.admin;
        const money = Number(req.body?.money);

        if (isNaN(playerId)) {
            return res.status(400).json({
                message: "Неверный ID игрока",
            });
        }

        if (!isNonNegativeNumber(money)) {
            return res.status(400).json({
                message: "Нужно передать корректный money",
            });
        }

        const player = players.find((p) => p.id === playerId);

        if (!player) {
            return res.status(404).json({
                message: "Игрок не найден",
            });
        }

        player.money = money;

        savePlayers(players);
        logAction(`Admin ${admin.name} changed ${player.name} money to ${money}`);

        res.json({
            message: `Баланс игрока ${player.name} изменён`,
            admin: admin.name,
            player,
        });
    });

    return router;
}

module.exports = createPlayersRoutes;