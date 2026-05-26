const logAction = require("../utils/logger");
const config = require("../config");

function showPlayers(players) {
    console.log("----- ONLINE PLAYERS -----");

    players.forEach((player, index) => {
        console.log(`ID: ${player.id}. ${player.name} | money: ${player.money} | role: ${player.role}`);
    });
}

function handleCommand(player, players, shop, command) {
    const args = command.split(" ");
    const commandName = args[0];
    const itemName = args[1];
    const targetId = Number(args[1]);
    const amount = Number(args[2]);

    if (commandName === "/money") {
        player.showMoney();
        return;
    }

    if (commandName === "/inventory") {
        player.showInventory();
        return;
    }

    if (commandName === "/players") {
        showPlayers(players);
        return;
    }

    if (commandName === "/buy") {
        if (!itemName) {
            console.log("Введите название предмета");
            console.log("Пример: /buy Phone");
            return;
        }

        shop.buy(player, itemName);
        logAction(`${player.name} used command: /buy ${itemName}`);
        return;
    }

    if (commandName === "/create") {

        if (player.role !== config.roles.admin) {
            console.log("У вас нет прав на создание игрока");
            return;
        }

        const newPlayerName = args[1];

        if (!newPlayerName) {
            console.log("Введите имя игрока");
            console.log("Пример: /create Ilya");
            return;
        }
        
        const existingPlayer = players.find((p) => p.name === newPlayerName);

        if (existingPlayer) {
            console.log("Игрок с таким именем уже существует");
            return;
        }

        const maxId = Math.max(...players.map((p) => p.id));
        const newId = maxId + 1;

        const Player = require("../classes/Players");
        const newPlayer = new Player(newId, newPlayerName, config.player.defaultMoney);

        players.push(newPlayer);

        console.log(`Игрок ${newPlayer.name} создан. ID: ${newPlayer.id}`);
        logAction(`Admin ${player.name} created player ${newPlayer.name} with ID ${newPlayer.id}`);
        return;
    }

    if (commandName === "/delete") {

        if (player.role !== config.roles.admin) {
            console.log("У вас нет прав удалять игрока");
            return;
        }

        const deleteId = Number(args[1]);

        if (!args[1]) {
            console.log("Введите ID игрока");
            console.log("Пример: /delete 4");
            return;
        }

        if (isNaN(deleteId)) {
            console.log("Неверный ID игрока");
            return;
        }

        if (deleteId === player.id) {
            console.log("Нельзя удалить самого себя");
            return;
        }

        const playerIndex = players.findIndex((p) => p.id === deleteId);

        if (playerIndex === -1) {
            console.log("Игрок не найден");
            return;
        }

        const deletedPlayer = players[playerIndex];

        players.splice(playerIndex, 1);

        console.log(`Игрок ${deletedPlayer.name} удалён`);
        logAction(`Admin ${player.name} deleted player ${deletedPlayer.name} with ID ${deletedPlayer.id}`);
        return;
    }

    if (commandName === "/pay") {
        if (args.lenght < 3) {
            console.log("Использование: /pay ID сумма");
            console.log("Пример: /pay 2 1000");
            return;
        }

        if (isNaN(targetId)) {
            console.log("Неверный ID игрока");
            return;
        }

        const targetPlayer = players.find((p) => p.id === targetId);

        if (!targetPlayer) {
            console.log("Игрок не найден");
            return;
        }

        if (targetPlayer.id === player.id) {
            console.log("Нельзя перевести деньги самому себе");
            return;
        }

        if (isNaN(amount) || amount <= 0) {
            console.log("Неверная сумма");
            return;
        }

        const success = player.removeMoney(amount);

        if (!success) {
            return;
        }

        targetPlayer.addMoney(amount);

        console.log(`${player.name} перевел ${targetPlayer.name} ${amount}`);
        logAction(`${player.name} paid ${targetPlayer.name} ${amount}`);
        return;
    }

    console.log("Неизвестная команда");
}

module.exports = handleCommand;