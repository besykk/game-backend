require("dotenv").config();

const express = require("express");

const logAction = require("./utils/logger");
const Shop = require("./classes/Shop");
const Player = require("./classes/Players");
const { loadPlayers, savePlayers } = require("./storage/playerStorage");
const { saveShop, loadShop } = require("./storage/shopStorage");
const { player } = require("./config");
const createPlayersRoutes = require("./routes/playersRoutes")
const createShopRoutes = require("./routes/shopRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");
const notFoundMiddleware = require("./middlewares/notFoundMiddleware");

const { checkDatabaseConnection } = require("./models/healthModel");
const createAuthRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let players = loadPlayers();

if (players.length === 0) {
    players = [
        new Player(1, "Grisha", 15500, "admin"),
        new Player(2, "Anton", 1000, "user"),
        new Player(3, "Max", 3500, "user"),
    ];
}

app.use("/auth", createAuthRoutes());

app.use("/players", createPlayersRoutes(players));

const shop = new Shop();

const savedItems = loadShop();

if (savedItems.length > 0) {
    shop.items = savedItems;
}

app.use("/shop", createShopRoutes(players, shop));

app.get("/", (req, res) => {
    res.send("Game backend API is working");
});

app.get("/health", async (req, res, next) => {
    try {
        const dbStatus = await checkDatabaseConnection();

        res.json({
            status: "ok",
            api: "working",
            database: dbStatus.status === 1 ? "connected" : "uknown",
        });
    } catch (error) {
        next(error);
    }
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

