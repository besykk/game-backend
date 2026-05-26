const readline = require("readline");

const logAction = require("./utils/logger")

const Player = require("./classes/Players");
const Shop = require("./classes/Shop");
const handleCommand = require("./commands/handleCommand");
const { savePlayers, loadPlayers } = require("./storage/playerStorage");

console.log("Game backend started");

let players = loadPlayers();

if (players.length === 0) {
    players = [
        new Player(1, "Grisha", 15500, "admin"),
        new Player(2, "Anton", 8920, "user"),
        new Player(3, "Max", 3500, "user"),
    ];
}

let currentPlayer = players[0];
const shop = new Shop();

console.log(`Вы вошли как: ${currentPlayer.name}`);
console.log("Введите /help, чтобы посмотреть команды");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function showHelp() {
    console.log("----- Commands -----");
    console.log("/money - показать баланс");
    console.log("/inventory - показать инвентарь");
    console.log("/buy Item - купить предмет");
    console.log("/pay ID Amount - передать деньги");
    console.log("/players - список игроков онлайн");
    console.log("/switch Player - смена игрока");
    console.log("/save - сохранить игроков");
    console.log("/create Name - создать нового игрока");
    console.log("/delete ID - удалить игрока по ID");
    console.log("/exit - выйти");

}

rl.on("line", (input) => {
    const command = input.trim();

    if (command === "/exit") {
        console.log("Сервер восстановлен");
        rl.close();
        return;
    }

    if (command === "/help") {
        showHelp();
        return;
    }

    if (command.startsWith("/switch")) {
        const args = command.split(" ");
        const playerName = args[1];

        const foundPlayer = players.find((player) => player.name === playerName);

        if (!foundPlayer) {
            console.log("Игрок не найден");
            return;
        }

        currentPlayer = foundPlayer;
        console.log(`Вы переключились на игрока: ${currentPlayer.name}`);
        return;
    }

    if (command === "/save") {
        savePlayers(players);
        return;
    }

    handleCommand(currentPlayer, players, shop, command);

});