# Game Backend API

Мини-проект backend-сервера для игровой логики на **Node.js + Express**.

Проект сделан как учебный pet-project под направление backend-разработки для игровых серверов.  
Он имитирует базовую серверную логику: игроков, баланс, инвентарь, магазин, покупки, переводы денег, админ-действия, хранение данных в MySQL, JWT-авторизацию и логирование.

---

## Возможности

- REST API на Express
- Игроки с ID, именем, балансом, ролью и инвентарём
- Создание игроков
- Получение списка игроков
- Получение игрока по ID
- Перевод денег между игроками
- Покупка предметов в магазине
- Работа с инвентарём игроков
- Админ-команды:
  - удаление игроков
  - изменение баланса игроков
  - добавление предметов в магазин
  - удаление предметов из магазина
- Авторизация через JWT
- Защита админских маршрутов через токен
- Проверка прав администратора через middleware
- Обработка неизвестных маршрутов
- Обработка внутренних ошибок
- Хранение данных в MySQL
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
- JWT
- jsonwebtoken
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

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=game_db

JWT_SECRET=super_secret_key
```

### 3. Создать базу данных

Можно создать базу и таблицы одной командой, если в проекте есть файл `sql/schema.sql`:

```bash
mysql -u root < sql/schema.sql
```

Если у MySQL root с паролем:

```bash
mysql -u root -p < sql/schema.sql
```

### 4. Запустить сервер

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
  db/
    connection.js
    testConnection.js

  middlewares/
    adminMiddleware.js
    authMiddleware.js
    errorMiddleware.js
    notFoundMiddleware.js

  models/
    healthModel.js
    playerModel.js
    shopModel.js

  routes/
    authRoutes.js
    playersRoutes.js
    shopRoutes.js

  sql/
    schema.sql

  utils/
    logger.js
    validators.js

  .env
  .gitignore
  server.js
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
password
```

Пример игрока:

```json
{
  "id": 1,
  "name": "Grisha",
  "money": 14000,
  "role": "admin"
}
```

### Inventory Item

Предмет в инвентаре имеет:

```js
id
player_id
item_name
```

Пример:

```json
{
  "id": 1,
  "player_id": 1,
  "item_name": "Phone"
}
```

### Shop Item

Предмет магазина имеет:

```js
id
name
price
```

Пример:

```json
{
  "id": 1,
  "name": "Phone",
  "price": 500
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

```bash
curl http://localhost:3000
```

Ответ:

```text
Game backend API is working
```

---

## Health Check

### GET `/health`

Проверяет работу API и подключение к базе данных.

```bash
curl http://localhost:3000/health
```

Пример ответа:

```json
{
  "status": "ok",
  "api": "working",
  "database": "connected"
}
```

---

# Auth API

## Логин

### POST `/auth/login`

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"name":"Grisha","password":"123456"}'
```

Body:

```json
{
  "name": "Grisha",
  "password": "123456"
}
```

Пример ответа:

```json
{
  "message": "Login success",
  "token": "jwt_token_here",
  "player": {
    "id": 1,
    "name": "Grisha",
    "role": "admin"
  }
}
```

---

## Проверить токен

### GET `/auth/me`

```bash
curl http://localhost:3000/auth/me \
  -H "Authorization: Bearer TOKEN_HERE"
```

Пример ответа:

```json
{
  "message": "Token is valid",
  "user": {
    "id": 1,
    "name": "Grisha",
    "role": "admin"
  }
}
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
    "role": "admin"
  },
  {
    "id": 2,
    "name": "Anton",
    "money": 1000,
    "role": "user"
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
  "role": "admin"
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
    "role": "user"
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
    "role": "admin"
  },
  "toPlayer": {
    "id": 2,
    "name": "Anton",
    "money": 1500,
    "role": "user"
  }
}
```

---

## Изменить баланс игрока

### PUT `/players/:id/money`

Только админ.  
Нужен JWT-токен администратора.

```bash
curl -X PUT http://localhost:3000/players/2/money \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_HERE" \
  -d '{"money":5000}'
```

Body:

```json
{
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
    "role": "user"
  }
}
```

---

## Удалить игрока

### DELETE `/players/:id`

Только админ.  
Нужен JWT-токен администратора.

```bash
curl -X DELETE http://localhost:3000/players/4 \
  -H "Authorization: Bearer TOKEN_HERE"
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
    "role": "user"
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
    "id": 1,
    "name": "Phone",
    "price": 500
  },
  {
    "id": 2,
    "name": "Medkit",
    "price": 1500
  },
  {
    "id": 3,
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
    "role": "admin"
  },
  "item": {
    "id": 1,
    "name": "Phone",
    "price": 500
  }
}
```

---

## Добавить предмет в магазин

### POST `/shop/items`

Только админ.  
Нужен JWT-токен администратора.

```bash
curl -X POST http://localhost:3000/shop/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_HERE" \
  -d '{"name":"Armor","price":3000}'
```

Body:

```json
{
  "name": "Armor",
  "price": 3000
}
```

Пример ответа:

```json
{
  "message": "Предмет добавлен в магазин",
  "item": {
    "id": 4,
    "name": "Armor",
    "price": 3000
  }
}
```

---

## Удалить предмет из магазина

### DELETE `/shop/items/:name`

Только админ.  
Нужен JWT-токен администратора.

```bash
curl -X DELETE http://localhost:3000/shop/items/Armor \
  -H "Authorization: Bearer TOKEN_HERE"
```

Пример ответа:

```json
{
  "message": "Предмет Armor удалён из магазина",
  "item": {
    "id": 4,
    "name": "Armor",
    "price": 3000
  }
}
```

---

# Inventory API

## Получить инвентарь игрока

### GET `/players/:id/inventory`

```bash
curl http://localhost:3000/players/1/inventory
```

Пример ответа:

```json
{
  "player": {
    "id": 1,
    "name": "Grisha",
    "money": 13900,
    "role": "admin"
  },
  "inventory": [
    {
      "id": 1,
      "item_name": "Phone"
    }
  ]
}
```

---

## Получить весь инвентарь всех игроков

### GET `/players/inventory/all`

```bash
curl http://localhost:3000/players/inventory/all
```

Пример ответа:

```json
[
  {
    "id": 1,
    "player_id": 1,
    "player_name": "Grisha",
    "item_name": "Phone"
  }
]
```

---

## Удалить предмет из инвентаря игрока

### DELETE `/players/:id/inventory/:itemId`

```bash
curl -X DELETE http://localhost:3000/players/1/inventory/1
```

Пример ответа:

```json
{
  "message": "Предмет Phone удален из инвентаря",
  "player": {
    "id": 1,
    "name": "Grisha",
    "money": 13900,
    "role": "admin"
  },
  "item": {
    "id": 1,
    "player_id": 1,
    "item_name": "Phone"
  }
}
```

---

# Middleware

## authMiddleware

Проверяет JWT-токен из заголовка:

```text
Authorization: Bearer TOKEN_HERE
```

Если токен не передан:

```json
{
  "message": "Токен не передан"
}
```

Если токен неверный или просрочен:

```json
{
  "message": "Неверный или просроченный токен"
}
```

---

## adminMiddleware

Проверяет, что запрос выполняет пользователь с ролью `admin`.

Используется для защищённых действий:

- изменение баланса
- удаление игроков
- добавление предметов
- удаление предметов

Пример защищённого запроса:

```bash
curl -X PUT http://localhost:3000/players/2/money \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_HERE" \
  -d '{"money":5000}'
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

# База данных

Проект использует MySQL.

## Быстрая настройка базы

```bash
mysql -u root < sql/schema.sql
```

Если root с паролем:

```bash
mysql -u root -p < sql/schema.sql
```

---

## Создание базы данных вручную

```sql
CREATE DATABASE game_db;
USE game_db;
```

---

## Таблица игроков

```sql
CREATE TABLE players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    money INT NOT NULL DEFAULT 1000,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    password VARCHAR(255) NOT NULL DEFAULT '123456'
);
```

---

## Таблица магазина

```sql
CREATE TABLE shop_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    price INT NOT NULL
);
```

---

## Таблица инвентаря

```sql
CREATE TABLE inventory_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    item_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);
```

---

## Тестовые данные

```sql
INSERT INTO players (name, money, role, password)
VALUES
('Grisha', 14000, 'admin', '123456'),
('Anton', 1000, 'user', '123456'),
('Max', 3500, 'user', '123456');

INSERT INTO shop_items (name, price)
VALUES
('Phone', 500),
('Medkit', 1500),
('Repairbox', 650);
```

---

# Хранение данных

Данные хранятся в MySQL:

- `players` — игроки
- `shop_items` — предметы магазина
- `inventory_items` — инвентарь игроков

Логи действий пока сохраняются в файл:

- `logs.txt`

---

# Примеры проверки

## Логин админа

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"name":"Grisha","password":"123456"}'
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

## Посмотреть инвентарь

```bash
curl http://localhost:3000/players/1/inventory
```

---