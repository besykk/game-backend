class Player {
    constructor(id, name, money, role = "user") {
        this.id = id;
        this.name = name;
        this.money = money;
        this.role = role;
        this.inventory = [];
    }

    removeMoney(amount) {
        if (this.money < amount) {
            console.log("Недостаточно денег");
            return false;
        }

        this.money -= amount;
        return true;
    }

    addMoney(amount) {
        this.money += amount;
    }

    addItem(itemName) {
        this.inventory.push(itemName);
    }

    showMoney() {
        console.log(`${this.name}, ваш баланс: ${this.money}`);
    }
    
    showInventory() {
        if (this.inventory.length === 0) {
            console.log("Инвентарь пустой");
            return;
        }

        console.log(`Инвентарь: ${this.inventory.join(", ")}`);
    }
}

module.exports = Player;