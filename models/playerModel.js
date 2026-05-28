const pool = require("../db/connection");

async function getAllPlayers() {
    const [rows] = await pool.query("SELECT * FROM players");

    return rows;
}

async function getPlayerById(id) {
    const [rows] = await pool.query("SELECT * FROM players WHERE id = ?", [id]);

    return rows[0];
}

async function createPlayer(name, passwordHash) {
    const [result] = await pool.query(
        "INSERT INTO players (name, money, role, password_hash) VALUES (?, ?, ?, ?)",
        [name, 1000, "user", passwordHash]);
    return {
        id: result.insertId,
        name, 
        money: 1000,
        role: "user",
    };
}

async function transferMoney(fromId, toId, amount) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [fromRows] = await connection.query("SELECT * FROM players WHERE id = ?", [fromId]);

        const [toRows] = await connection.query("SELECT * FROM players where id = ?", [toId]);

        const fromPlayer = fromRows[0];
        const toPlayer = toRows[0];

        if (!fromPlayer) {
            throw new Error("SENDER_NOT_FOUND");
        }

        if (!toPlayer) {
            throw new Error("RECEIVER_NOT_FOUND");
        }

        if (fromPlayer.money < amount) {
            throw new Error("NOT_ENOUGH_MONEY");
        }

        await connection.query("UPDATE players SET money = money - ? WHERE id = ?", [amount, fromId]);

        await connection.query("UPDATE players SET money = money + ? WHERE id = ?", [amount, toId]);

        await connection.commit();

        const [updateFromRows] = await connection.query("SELECT * FROM players WHERE id = ?", [fromId]);

        const [updateToRows] = await connection.query("SELECT * FROM players WHERE id = ?", [toId]);

        return {
            fromPlayer: updateFromRows[0],
            toPlayer: updateToRows[0],
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function updatePlayerMoney(playerId, money) {
    const [result] = await pool.query("UPDATE players SET money = ? WHERE id = ?", [money, playerId]);

    if (result.affectedRows === 0) {
        return null;
    }

    return getPlayerById(playerId);
}

async function deletePlayerById(playerId) {
    const player = await getPlayerById(playerId);

    if (!player) {
        return null;
    }

    await pool.query("DELETE FROM players WHERE id = ?", [playerId]);

    return player;
}

async function getPlayerInventory(playerId) {
    const [rows] = await pool.query("SELECT id, item_name FROM inventory_items WHERE player_id = ?", [playerId]);

    return rows;
}

async function deleteInventoryItem(playerId, itemId) {
    const [rows] = await pool.query("SELECT * FROM inventory_items WHERE id = ? AND player_id = ?", [itemId, playerId]);

    const item = rows[0];

    if (!item) {
        return null;
    }

    await pool.query("DELETE FROM inventory_items WHERE id = ? AND player_id = ?", [itemId, playerId]);

    return item;
    
}

async function getAllInventoryItems() {
    const [rows] = await pool.query(`
        SELECT
            inventory_items.id,
            inventory_items.player_id,
            players.name AS player_name,
            inventory_items.item_name
        FROM inventory_items
        JOIN players ON inventory_items.player_id = players.id
    `);
    
    return rows;
}

async function getPlayerByName(name) {
    const [rows] = await pool.query(
        "SELECT * FROM players WHERE name = ?",
        [name]
    );

    return rows[0];
}

async function registerPlayer(name, passwordHash) {
    const [result] = await pool.query(
        "INSERT INTO players (name, money, role, password_hash) VALUES (?, ?, ?, ?)",
        [name, 1000, "user", passwordHash]
    );

    return {
        id: result.insertId,
        name,
        money: 1000,
        role: "user",
    };
}

module.exports = {
    getAllPlayers,
    getPlayerById,
    createPlayer,
    registerPlayer,
    transferMoney,
    updatePlayerMoney,
    deletePlayerById,
    getPlayerInventory,
    deleteInventoryItem,
    getAllInventoryItems,
    getPlayerByName,
};