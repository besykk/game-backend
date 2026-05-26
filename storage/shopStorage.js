const fs = require("fs");

const FILE_PATH = "shop.json";

function saveShop(items) {
    const data = JSON.stringify(items, null, 4);

    fs.writeFileSync(FILE_PATH, data);

    console.log("Магазин сохранён");
}

function loadShop() {
    if (!fs.existsSync(FILE_PATH)) {
        return [];
    }

    const data = fs.readFileSync(FILE_PATH, "utf-8");

    if (!data) {
        return [];
    }

    return JSON.parse(data);
}

module.exports = {
    saveShop,
    loadShop,
};