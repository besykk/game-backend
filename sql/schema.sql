CREATE DATABASE IF NOT EXISTS game_db;

USE game_db;

CREATE TABLE IF NOT EXISTS players (
    id INT AUTO_INCREMENT PRIMARY_KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    money INT NOT NULL DEFAULT 1000,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
);

CREATE TABLE if NOT EXISTS shop_items (
    id INT AUTO_INCREMENT PRIMARY_KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    price INT NOT NULL,
);

CREATE TABLE IF NOT EXISTS inventory_items (
    id INT AUTO_INCREMENT PRIMARY_KEY,
    player_id INT NOT NULL,
    item_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

INSERT IGNORE INTO players (id, name, money, role)
VALUES
(1, 'Grisha', 14000, 'admin'),
(2, 'Anton', 1000, 'user'),
(3, 'Max', 3500, 'user');

INSERT IGNORE INTO shop_items (id, name, price)
VALUES
(1, 'Phone', 500),
(2, 'Medkit', 1500),
(3, 'Repairbox', 650);