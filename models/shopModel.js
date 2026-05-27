const pool = require("../db/connection");

async function getAllShopItems() {
    const [rows] = await pool.query("SELECT * FROM shop_items");

    return rows;
}

async function createShopItem(name, price) {
    const [result] = await pool.query("INSERT INTO shop_items (name, price) VALUES (?, ?)", [name, price]);

    return {
        id: result.insertId,
        name,
        price,
    };
}

async function deleteShopItemByName(name) {
    const [rows] = await pool.query("SELECT * FROM shop_items WHERE name = ?", [name]);

    const item = rows[0];

    if (!item) {
        return null;
    }

    await pool.query("DELETE FROM shop_items WHERE name = ?", [name]);

    return item;
}

async function buyItem(playerId, itemName) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [playerRows] = await connection.query("SELECT * FROM players WHERE id = ?", [playerId]);

        const player = playerRows[0];

        if (!player) {
            throw new Error("PLAYER_NOT_FOUND");
        }

        const [itemsRows] = await connection.query("SELECT * FROM shop_items WHERE name = ?", [itemName]);

        const item = itemsRows[0];

        if (!item) {
            throw new Error("ITEM_NOT_FOUND");
        }

        if (player.money < item.price) {
            throw new Error("NOT_ENOUGH_MONEY");
        }

        await connection.query("UPDATE players SET money = money - ? WHERE id = ?", [item.price, playerId]);

        await connection.query("INSERT INTO inventory_items (player_id, item_name) VALUES (?, ?)", [playerId, item.name]);

        await connection.commit();

        const [updatePlayerRows] = await connection.query("SELECT * FROM players WHERE id = ?", [playerId]);

        return {
            player: updatePlayerRows[0],
            item,
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    getAllShopItems,
    createShopItem,
    deleteShopItemByName,
    buyItem,
};