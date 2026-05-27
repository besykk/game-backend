# Game Backend API

Мини-проект backend-сервера для игровой логики на **Node.js + Express**.

Проект сделан как учебный pet-project под направление backend-разработки для игровых серверов.  
Он имитирует базовую серверную логику: игроков, баланс, инвентарь, магазин, покупки, переводы денег, админ-действия, сохранение данных и логирование.

---

## Возможности

- REST API на Express
- Игроки с ID, именем, балансом, ролью и инвентарём
- Создание игроков
- Получение списка игроков
- Получение игрока по ID
- Перевод денег между игроками
- Покупка предметов в магазине
- Админ-команды:
  - удаление игроков
  - изменение баланса
  - добавление предметов в магазин
  - удаление предметов из магазина
- Проверка прав администратора через middleware
- Обработка неизвестных маршрутов
- Обработка внутренних ошибок
- Сохранение данных в JSON-файлы
- Логирование действий в `logs.txt`
- Настройки через `.env`

---

## Стек

- JavaScript
- Node.js
- Express
- MySQL / MariaDB
- mysql2
- dotenv
- REST API
- Middleware

---

## Установка и запуск

### 1. Установить зависимости

```bash
npm install
```

### 2. Создать `.env`

В корне проекта создать файл `.env`:

```env
PORT=3000
```

### 3. Запустить сервер

```bash
npm start
```

Сервер запустится по адресу:

```text
http://localhost:3000
```

---

## Скрипты

### Запуск сервера

```bash
npm start
```

Команда запускает:

```bash
node server.js
```

---

## Структура проекта

```text
game-backend/
  classes/
    Players.js
    Shop.js

  commands/
    handleCommand.js

  middlewares/
    adminMiddleware.js
    errorMiddleware.js
    notFoundMiddleware.js

  routes/
    playersRoutes.js
    shopRoutes.js

  storage/
    playerStorage.js
    shopStorage.js

  utils/
    logger.js
    validators.js

  .env
  .gitignore
  config.js
  index.js
  server.js
  players.json
  shop.json
  logs.txt
  package.json
  README.md
```

---

## Основные сущности

### Player

Игрок имеет:

```js
id
name
money
role
inventory
```

Пример игрока:

```json
{
  "id": 1,
  "name": "Grisha",
  "money": 14000,
  "role": "admin",
  "inventory": ["Phone"]
}
```

### Роли

В проекте есть две роли:

```text
admin
user
```

Админ может:

- удалять игроков
- менять баланс игроков
- добавлять предметы в магазин
- удалять предметы из магазина

---

# API

## Проверка сервера

### GET `/`

Проверяет, что сервер работает.

Пример:

```bash
curl http://localhost:3000
```

Ответ:

```text
Game backend API is working
```

---

# Players API

## Получить всех игроков

### GET `/players`

```bash
curl http://localhost:3000/players
```

Пример ответа:

```json
[
  {
    "id": 1,
    "name": "Grisha",
    "money": 14000,
    "role": "admin",
    "inventory": ["Phone"]
  },
  {
    "id": 2,
    "name": "Anton",
    "money": 1000,
    "role": "user",
    "inventory": []
  }
]
```

---

## Получить игрока по ID

### GET `/players/:id`

```bash
curl http://localhost:3000/players/1
```

Пример ответа:

```json
{
  "id": 1,
  "name": "Grisha",
  "money": 14000,
  "role": "admin",
  "inventory": ["Phone"]
}
```

Если игрок не найден:

```json
{
  "message": "Игрок не найден"
}
```

---

## Создать игрока

### POST `/players`

```bash
curl -X POST http://localhost:3000/players \
  -H "Content-Type: application/json" \
  -d '{"name":"Ilya"}'
```

Body:

```json
{
  "name": "Ilya"
}
```

Пример ответа:

```json
{
  "message": "Игрок создан",
  "player": {
    "id": 4,
    "name": "Ilya",
    "money": 1000,
    "role": "user",
    "inventory": []
  }
}
```

---

## Перевести деньги

### POST `/players/pay`

```bash
curl -X POST http://localhost:3000/players/pay \
  -H "Content-Type: application/json" \
  -d '{"fromId":1,"toId":2,"amount":500}'
```

Body:

```json
{
  "fromId": 1,
  "toId": 2,
  "amount": 500
}
```

Пример ответа:

```json
{
  "message": "Grisha перевел Anton 500",
  "fromPlayer": {
    "id": 1,
    "name": "Grisha",
    "money": 13500,
    "role": "admin",
    "inventory": ["Phone"]
  },
  "toPlayer": {
    "id": 2,
    "name": "Anton",
    "money": 1500,
    "role": "user",
    "inventory": []
  }
}
```

---

## Изменить баланс игрока

### PUT `/players/:id/money`

Только админ.

```bash
curl -X PUT http://localhost:3000/players/2/money \
  -H "Content-Type: application/json" \
  -d '{"adminId":1,"money":5000}'
```

Body:

```json
{
  "adminId": 1,
  "money": 5000
}
```

Пример ответа:

```json
{
  "message": "Баланс игрока Anton изменён",
  "admin": "Grisha",
  "player": {
    "id": 2,
    "name": "Anton",
    "money": 5000,
    "role": "user",
    "inventory": []
  }
}
```

---

## Удалить игрока

### DELETE `/players/:id`

Только админ.

```bash
curl -X DELETE http://localhost:3000/players/4 \
  -H "Content-Type: application/json" \
  -d '{"adminId":1}'
```

Body:

```json
{
  "adminId": 1
}
```

Пример ответа:

```json
{
  "message": "Игрок Ilya удалён",
  "admin": "Grisha",
  "player": {
    "id": 4,
    "name": "Ilya",
    "money": 1000,
    "role": "user",
    "inventory": []
  }
}
```

---

# Shop API

## Получить список предметов

### GET `/shop`

```bash
curl http://localhost:3000/shop
```

Пример ответа:

```json
[
  {
    "name": "Phone",
    "price": 500
  },
  {
    "name": "Medkit",
    "price": 1500
  },
  {
    "name": "Repairbox",
    "price": 650
  }
]
```

---

## Купить предмет

### POST `/shop/buy`

```bash
curl -X POST http://localhost:3000/shop/buy \
  -H "Content-Type: application/json" \
  -d '{"playerId":1,"itemName":"Phone"}'
```

Body:

```json
{
  "playerId": 1,
  "itemName": "Phone"
}
```

Пример ответа:

```json
{
  "message": "Grisha купил Phone за 500",
  "player": {
    "id": 1,
    "name": "Grisha",
    "money": 13500,
    "role": "admin",
    "inventory": ["Phone"]
  }
}
```

---

## Добавить предмет в магазин

### POST `/shop/items`

Только админ.

```bash
curl -X POST http://localhost:3000/shop/items \
  -H "Content-Type: application/json" \
  -d '{"adminId":1,"name":"Armor","price":3000}'
```

Body:

```json
{
  "adminId": 1,
  "name": "Armor",
  "price": 3000
}
```

Пример ответа:

```json
{
  "message": "Предмет добавлен в магазин",
  "item": {
    "name": "Armor",
    "price": 3000
  }
}
```

---

## Удалить предмет из магазина

### DELETE `/shop/items/:name`

Только админ.

```bash
curl -X DELETE http://localhost:3000/shop/items/Armor \
  -H "Content-Type: application/json" \
  -d '{"adminId":1}'
```

Body:

```json
{
  "adminId": 1
}
```

Пример ответа:

```json
{
  "message": "Предмет Armor удалён из магазина",
  "item": {
    "name": "Armor",
    "price": 3000
  }
}
```

---

# Middleware

## adminMiddleware

Проверяет, что запрос выполняет администратор.

Используется для защищённых действий:

- изменение баланса
- удаление игроков
- добавление предметов
- удаление предметов

Пример защищённого запроса:

```json
{
  "adminId": 1
}
```

Если пользователь не админ:

```json
{
  "message": "У вас нет прав"
}
```

---

## notFoundMiddleware

Обрабатывает неизвестные маршруты.

Пример:

```bash
curl http://localhost:3000/test
```

Ответ:

```json
{
  "message": "Маршрут не найден"
}
```

---

## errorMiddleware

Обрабатывает внутренние ошибки сервера и возвращает JSON вместо HTML.

Пример ответа:

```json
{
  "message": "Внутренняя ошибка сервера"
}
```

---

## База данных

Проект использует MySQL.

### Создание базы данных

```sql
CREATE DATABASE game_db;
USE game_db;
```

### Таблица игроков

```sql
CREATE TABLE players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    money INT NOT NULL DEFAULT 1000,
    role VARCHAR(20) NOT NULL DEFAULT 'user'
);
```

### Таблица магазина

```sql
CREATE TABLE shop_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    price INT NOT NULL
);
```

### Таблица инвентаря

```sql
CREATE TABLE inventory_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    item_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);
```

### Тестовые данные

```sql
INSERT INTO players (name, money, role)
VALUES
('Grisha', 14000, 'admin'),
('Anton', 1000, 'user'),
('Max', 3500, 'user');

INSERT INTO shop_items (name, price)
VALUES
('Phone', 500),
('Medkit', 1500),
('Repairbox', 650);
```


# Хранение данных

Данные хранятся в MySQL:

- `players` — игроки

- `shop_items` — предметы магазина

- `inventory_items` — инвентарь игроков

Логи действий пока сохраняются в файл:

- `logs.txt`

---

# Примеры проверки

## Создать игрока

```bash
curl -X POST http://localhost:3000/players \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'
```

## Посмотреть игроков

```bash
curl http://localhost:3000/players
```

## Перевести деньги

```bash
curl -X POST http://localhost:3000/players/pay \
  -H "Content-Type: application/json" \
  -d '{"fromId":1,"toId":2,"amount":100}'
```

## Купить предмет

```bash
curl -X POST http://localhost:3000/shop/buy \
  -H "Content-Type: application/json" \
  -d '{"playerId":1,"itemName":"Phone"}'
```

