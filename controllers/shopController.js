const {
    getAllShopItems,
    buyItem,
    createShopItem,
    deleteShopItemByName,
} = require("../models/shopModel");

const { 
    isNotEmptyString,
    isPositiveNumber,
} = require("../utils/validators");

async function getAllShopItemsController(req, res, next) {
    try {
        const items = await getAllShopItems();

        res.json(items);
    } catch (error) {
        next(error);
    }
}

async function buyItemController(req, res, next) {
    try {
        const playerId = Number(req.body.playerId);
        const itemName = req.body.itemName;

        if (isNaN(playerId)) {
            return res.status(400).json({
                message: "playerId должен быть числом",
            });
        }

        if (!isNotEmptyString(itemName)) {
            return res.status(400).json({
                message: "Введите название предмета",
            });
        }

        const result = await buyItem(playerId, itemName);

        res.json({
            message: `${result.player.name} купил ${result.item.name} за ${result.item.price}`,
            player: result.player,
            item: result.item,
        });
    } catch (error) {
        if (error.message === "PLAYER_NOT_FOUND") {
            return res.status(404).json({
                message: "Игрок не найден",
            });
        }

        if (error.message === "ITEM_NOT_FOUND") {
            return res.status(404).json({
                message: "Такого предмета нет в магазине",
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

async function createShopItemController(req, res, next) {
    try {
        const admin = req.admin;
        const name = req.body?.name;
        const price = Number(req.body?.price);

        if (!isNotEmptyString(name)) {
            return res.status(400).json({
                message: "Введите название предмета",
            });
        }

        if (!isPositiveNumber(price)) {
            return res.status(400).json({
                message: "Введите корректную цену",
            });
        }

        const newItem = await createShopItem(name, price);

        res.status(201).json({
            message: "Предмет добавлен в магазин",
            admin: admin.name,
            item: newItem,
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                message: "Такой предмет уже есть в магазине",
            });
        }

        next(error);
    }
}

async function deleteShopItemController(req, res, next) {
    try {
        const admin = req.admin;
        const itemName = req.params.name;

        const deletedItem = await deleteShopItemByName(itemName);

        if (!deletedItem) {
            return res.status(404).json({
                message: "Предмет не найден",
            });
        }

        res.json({
            message: `Предмет ${deletedItem.name} удалён из магазина`,
            admin: admin.name,
            item: deletedItem,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllShopItemsController,
    buyItemController,
    createShopItemController,
    deleteShopItemController,
};