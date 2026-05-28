const express = require("express");

const adminMiddleware = require("../middlewares/adminMiddleware");

const { 
    isPositiveNumber, 
    isNonNegativeNumber, 
    isNotEmptyString, 
} = require("../utils/validators");

const { 
    getAllPlayers, 
    getPlayerById, 
    createPlayer, 
    transferMoney, 
    updatePlayerMoney, 
    deletePlayerById, 
    getPlayerInventory, 
    deleteInventoryItem,
    getAllInventoryItems,
} = require("../models/playerModel");

const {
    getAllPlayersController,
    getPlayerByIdController,
    getAllInventoryItemsController,
    getPlayerInventoryController,
    deleteInventoryItemController,
    transferMoneyController,
    updatePlayerMoneyController,
    deletedPlayerByIdController,
    createPlayerController
} = require("../controllers/playerController")

function createPlayersRoutes(players) {

    const router = express.Router();

    router.get("/", getAllPlayersController);

    router.get("/inventory/all", getAllInventoryItemsController);

    router.get("/:id/inventory", getPlayerInventoryController);

    router.delete("/:id/inventory/:itemId", deleteInventoryItemController);

    router.get("/:id", getPlayerByIdController);

    router.post("/", adminMiddleware, createPlayerController);
 
    router.post("/pay", transferMoneyController);

    router.delete("/:id", adminMiddleware, deletedPlayerByIdController); 

    router.put("/:id/money", adminMiddleware, updatePlayerMoneyController);

    return router;
};

module.exports = createPlayersRoutes;