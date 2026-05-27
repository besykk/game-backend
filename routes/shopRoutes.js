const express = require("express");

const { savePlayers } = require("../storage/playerStorage");
const { saveShop } = require("../storage/shopStorage");
const logAction = require("../utils/logger");
const createAdminMiddleware = require("../middlewares/adminMiddleware");

const { isPositiveNumber, isNotEmptyString, } = require("../utils/validators");

const { getAllShopItems, createShopItem, deleteShopItemByName, buyItem, } = require("../models/shopModel");

function createShopRoutes(players, shop) {
    const router = express.Router();

    const adminMiddleware = createAdminMiddleware();

    router.get("/", async (req, res, next) => {
        try {
            const items = await getAllShopItems();

            res.json(items);
        } catch (error) {
            next(error);
        }
    });

    router.post("/buy", async (req, res, next) => {
        try {
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

            const result = await buyItem(playerId, itemName);

            logAction(`${result.player.name} bought ${result.item.name} for ${result.item.price}`);

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
    });

    router.post("/items", adminMiddleware, async (req, res, next) => {
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

            logAction(`Admin ${admin.name} added shop item ${newItem.name} for ${newItem.price}`);

            res.status(201).json({message: "Предмет добавлен в магаизн", item: newItem,});
        } catch (error) {
            if (error.code == "ER_DUP_ENTRY") {
                return res.status(400).json({message: "Такой предмет уже есть в магазине",});
            }
        }
    });

    router.delete("/items/:name", adminMiddleware, async (req, res, next) => {
        try {
            const admin = req.admin;
            const itemName = req.params.name;

            const deletedItem = await deleteShopItemByName(itemName);

            if (!deletedItem) {
                return res.status(404).json({
                    message: "Предмет не найден",
                });
            }

            logAction(`Admin ${admin.name} deleted shop item ${deletedItem.name}`);

            res.json({
                message: `Предмет ${deletedItem.name} удалён из магазина`,
                item: deletedItem,
            });
        } catch (error) {
            next(error);
        }
    });

    return router;
}

module.exports = createShopRoutes;