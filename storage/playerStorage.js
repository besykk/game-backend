const config = require("../config")

const fs = require("fs");
const Player = require("../classes/Players");
const { FILE } = require("dns");

const FILE_PATH = config.files.players;

function savePlayers(players) {
    const data = JSON.stringify(players, null, 4);

    fs.writeFileSync(FILE_PATH, data);

    console.log("Игроки сохранены");
}

function loadPlayers() {
    if (!fs.existsSync(FILE_PATH)) {
        return [];
    }

    const data = fs.readFileSync(FILE_PATH, "utf-8");

    if (!data) {
        return [];
    }

    const rawPlayers = JSON.parse(data);

    return rawPlayers.map((player) => {
        const newPlayer = new Player(player.id, player.name, player.money, player.role);
        newPlayer.inventory = player.inventory || [];
        return newPlayer;
    });
}

module.exports = {
    savePlayers,
    loadPlayers,
};