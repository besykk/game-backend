class Shop {
    constructor() {
        this.items = [
            { name: "Phone", price: 500},
            { name: "Medkit", price: 1500},
            { name: "Repairbox", price: 650},
        ];
    }

    buy(player, itemName) {
        const item = this.items.find((item) => item.name == itemName);

        if (!item) {
            console.log("Такого предмета нет в магазине");
            return;
        }
        
        const success = player.removeMoney(item.price);

        if (!success) {
            return;
        }

        player.addItem(item.name);
        console.log(`${player.name} купил ${item.name} за ${item.price}`);
    }
}

module.exports = Shop;