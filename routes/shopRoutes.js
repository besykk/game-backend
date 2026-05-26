const express = require("express");

const { savePlayers } = require("../storage/playerStorage");
const { saveShop } = require("../storage/shopStorage");
const logAction = require("../utils/logger");
const createAdminMiddleware = require("../middlewares/adminMiddleware");

const { isPositiveNumber, isNotEmptyString, } = require("../utils/validators");

function createShopRoutes(players, shop) {
    const router = express.Router();

    const adminMiddleware = createAdminMiddleware(players);

    router.get("/", (req, res) => {
        res.json(shop.items);
    });

    router.post("/buy", (req, res) => {
        const playerId = Number(req.body.playerId);
        const itemName = req.body.itemName;

        if (isNaN(playerId)) {
            return res.status(400).json({
                message: "playerId должен быть числом",
            });
        }

        if (!itemName) {
            return res.status(400).json({
                message: "Введите название предмета",
            });
        }

        const player = players.find((p) => p.id === playerId);

        if (!player) {
            return res.status(404).json({
                message: "Игрок не найден",
            });
        }

        const item = shop.items.find((item) => item.name === itemName);

        if (!item) {
            return res.status(404).json({
                message: "Такого предмета нет в магазине",
            });
        }

        const success = player.removeMoney(item.price);

        if (!success) {
            return res.status(400).json({
                message: "Недостаточно денег",
            });
        }

        player.addItem(item.name);

        savePlayers(players);
        logAction(`${player.name} bought ${item.name} for ${item.price}`);

        res.json({
            message: `${player.name} купил ${item.name} за ${item.price}`,
            player,
        });
    });

    router.post("/items", adminMiddleware, (req, res) => {
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

        const existingItem = shop.items.find((item) => item.name === name);

        if (existingItem) {
            return res.status(400).json({
                message: "Такой предмет уже есть в магазине",
            });
        }

        const newItem = {
            name,
            price,
        };

        shop.items.push(newItem);

        saveShop(shop.items);
        logAction(`Admin ${admin.name} added shop item ${newItem.name} for ${newItem.price}`);

        res.status(201).json({
            message: "Предмет добавлен в магазин",
            item: newItem,
            shop: shop.items,
        });
    });

    router.delete("/items/:name", adminMiddleware, (req, res) => {
        const admin = req.admin;
        const itemName = req.params.name;

        const itemIndex = shop.items.findIndex((item) => item.name === itemName);

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Предмет не найден",
            });
        }

        const deletedItem = shop.items[itemIndex];

        shop.items.splice(itemIndex, 1);

        saveShop(shop.items);
        logAction(`Admin ${admin.name} deleted shop item ${deletedItem.name}`);

        res.json({
            message: `Предмет ${deletedItem.name} удалён из магазина`,
            item: deletedItem,
            shop: shop.items,
        });
    });

    return router;
}

module.exports = createShopRoutes;