const bcrypt = require("bcrypt");
const logAction = require("../utils/logger");

const { 
    getAllPlayers,
    getPlayerById,
    getAllInventoryItems,
    getPlayerInventory,
    deleteInventoryItem,
    transferMoney,
    updatePlayerMoney,
    deletePlayerById,
    createPlayer,
} = require("../models/playerModel");


const { 
    isPositiveNumber,
    isNonNegativeNumber,
    isNotEmptyString,
 } = require("../utils/validators");

async function getAllPlayersController(req, res, next) {
    try {
        const players = await getAllPlayers();

        res.json(players);
    } catch (error) {
        next(error);
    }
}

async function getPlayerByIdController(req, res, next) {
    try {
        const playerId = Number(req.params.id);

        if (isNaN(playerId)) {
            return res.status(400).json({
                message: "Неверный ID игрока",
            });
        }

        const player = await getPlayerById(playerId);

        if (!player) {
            return res.status(404).json({
                message: "Игрок не найден",
            });
        }

        res.json(player);
    } catch (error) {
        next(error);
    }
}

async function getAllInventoryItemsController(req, res, next) {
    try {
        const inventory = await getAllInventoryItems();

        res.json(inventory);
    } catch (error) {
        next(error);
    }
}

async function getPlayerInventoryController(req, res, next) {
    try {
        const playerId = Number(req.params.id);

        if (isNaN(playerId)) {
            return res.status(400).json({
                message: "Неверный ID игрока",
            });
        }

        const player = await getPlayerById(playerId);

        if (!player) {
            return res.status(400).json({
                message: "Игрок не найден",
            });
        }

        const inventory = await getPlayerInventory(playerId);

        res.json({
            player,
            inventory,
        });
    } catch (error) {
        next(error);
    }
}

async function deleteInventoryItemController(req, res, next) {
    try {
        const playerId = Number(req.params.id);
        const itemId = Number(req.params.itemId);

        if (isNaN(playerId)) {
            return res.status(400).json({
                message: "Неверный ID игрока",
            });
        }

        if (isNaN(itemId)) {
            return res.status(400).json({
                message: "Неверный ID предмета",
            });
        }

        const player = await getPlayerById(playerId);

        if (!player) {
            return res.status(404).json({
                message: "Игрок не найден",
            });
        }

        const deletedItem = await deleteInventoryItem(playerId, itemId);

        if (!deletedItem) {
            return res.status(404).json({
                message: "Предмет в инвентаре не найден",
            });
        }

        res.json({
            message: `Предмет ${deletedItem.item_name} удален из инвентаря`,
            player,
            item: deletedItem,
        });
    } catch (error) {
        next(error);
    }
}

async function transferMoneyController(req, res, next) {
    try {
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

        const result = await transferMoney(fromId, toId, amount);

        res.json({
            message: `${result.fromPlayer.name} перевел ${result.toPlayer.name} ${amount}`,
            fromPlayer: result.fromPlayer,
            toPlayer: result.toPlayer,
        });
    } catch (error) {
        if (error.message === "SENDER_NOT_FOUND") {
            return res.status(400).json({
                message: "Отправитель не найден",
            });
        }

        if (error.message === "RECEIVER_NOT_FOUND") {
            return res.status(400).json({
                message: "Получатель не найден",
            });
        }

        if (error.message === "NOT_ENOUGH_MONEY") {
            return res.status(400).json({
                message: "Недостаточно денег",
            });
        }

        next(error);
    }
}

async function updatePlayerMoneyController(req, res, next) {
    try {
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

        const updatePlayer = await updatePlayerMoney(playerId, money);

        if (!updatePlayer) {
            return res.status(400).json({
                message: "Игрок не найден",
            });
        }

        res.json({
            message: `Баланс игрока ${updatePlayer.name} изменен`,
            admin: admin.name,
            player: updatePlayer,
        });
    } catch (error) {
        next(error);
    }
}

async function deletePlayerByIdController(req, res, next) {
    try {
        const playerId = Number(req.params.id);
        const admin = req.admin;

        if (isNaN(playerId)) {
            return res.status(400).json({
                message: "Неверный ID игрока",
            });
        }

        if (playerId === admin.id) {
            return res.status(400).json({
                message: "Нельзя удалить самого себя",
            });
        }

        const deletedPlayer = await deletePlayerById(playerId);

        if (!deletedPlayer) {
            return res.status(404).json({
                message: "Игрок не найден",
            });
        }

        res.json({
            message: `Игрок ${deletedPlayer.name} удален`,
            admin: admin.name,
            player: deletedPlayer,
        });
    } catch (error) {
        next(error);
    }
}

async function createPlayerController(req, res, next) {
    try {
        const name = req.body.name;

        if (!isNotEmptyString(name)) {
            return res.status(400).json({
                message: "Введите им игрока",
            });
        }

        const defaultPassword = "123456";
        const passwordHash = await bcrypt.hash(defaultPassword, 10);

        const newPlayer = await createPlayer(name, passwordHash);

        logAction(`Player created: ${newPlayer.name} with ID ${newPlayer.id}`);

        res.status(201).json({
            message: "Игрок создан",
            defaultPassword,
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

module.exports = {
    getAllPlayersController,
    getPlayerByIdController,
    getAllInventoryItemsController,
    getPlayerInventoryController,
    deleteInventoryItemController,
    transferMoneyController,
    updatePlayerMoneyController,
    deletePlayerByIdController,
    createPlayerController,
};