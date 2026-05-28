const express = require("express");

const logAction = require("../utils/logger");
const adminMiddleware = require("../middlewares/adminMiddleware");

const { 
    isPositiveNumber, 
    isNotEmptyString, 
} = require("../utils/validators");

const { 
    getAllShopItems, 
    createShopItem, 
    deleteShopItemByName, 
    buyItem, 
} = require("../models/shopModel");

const {
    getAllShopItemsController,
    buyItemController,
    createShopItemController,
    deleteShopItemController,
} = require("../controllers/shopController");

function createShopRoutes(players, shop) {
    const router = express.Router();

    router.get("/", getAllShopItemsController);

    router.post("/buy", buyItemController);

    router.post("/items", adminMiddleware, createShopItemController);

    router.delete("/items/:name", adminMiddleware, deleteShopItemController); 

    return router;
}

module.exports = createShopRoutes;