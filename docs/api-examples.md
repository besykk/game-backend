# API Examples

Примеры запросов для проверки **Game Backend API**.

---

## Base URL

```text
http://localhost:3000
```

---

# Health Check

## Check API and Database

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

# Auth

## Register

Регистрация нового игрока.

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"NewPlayer","password":"123456"}'
```

Пример ответа:

```json
{
  "message": "Регистрация успешна",
  "player": {
    "id": 4,
    "name": "NewPlayer",
    "money": 1000,
    "role": "user"
  }
}
```

---

## Login

Логин игрока и получение JWT-токена.

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"name":"Grisha","password":"123456"}'
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

## Check Token

Проверка JWT-токена.

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

# Players

## Get All Players

```bash
curl http://localhost:3000/players
```

---

## Get Player By ID

```bash
curl http://localhost:3000/players/1
```

---

## Create Player By Admin

Создание игрока админом.  
Нужен JWT-токен администратора.

```bash
curl -X POST http://localhost:3000/players \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_HERE" \
  -d '{"name":"AdminCreated"}'
```

Пример ответа:

```json
{
  "message": "Игрок создан",
  "defaultPassword": "123456",
  "player": {
    "id": 5,
    "name": "AdminCreated",
    "money": 1000,
    "role": "user"
  }
}
```

---

## Transfer Money

Перевод денег между игроками.

```bash
curl -X POST http://localhost:3000/players/pay \
  -H "Content-Type: application/json" \
  -d '{"fromId":1,"toId":2,"amount":100}'
```

---

## Change Player Money By Admin

Изменение баланса игрока админом.  
Нужен JWT-токен администратора.

```bash
curl -X PUT http://localhost:3000/players/2/money \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_HERE" \
  -d '{"money":5000}'
```

---

## Delete Player By Admin

Удаление игрока админом.  
Нужен JWT-токен администратора.

```bash
curl -X DELETE http://localhost:3000/players/4 \
  -H "Authorization: Bearer TOKEN_HERE"
```

---

# Shop

## Get Shop Items

```bash
curl http://localhost:3000/shop
```

---

## Buy Item

Покупка предмета игроком.

```bash
curl -X POST http://localhost:3000/shop/buy \
  -H "Content-Type: application/json" \
  -d '{"playerId":1,"itemName":"Phone"}'
```

---

## Add Shop Item By Admin

Добавление предмета в магазин админом.  
Нужен JWT-токен администратора.

```bash
curl -X POST http://localhost:3000/shop/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_HERE" \
  -d '{"name":"Armor","price":3000}'
```

---

## Delete Shop Item By Admin

Удаление предмета из магазина админом.  
Нужен JWT-токен администратора.

```bash
curl -X DELETE http://localhost:3000/shop/items/Armor \
  -H "Authorization: Bearer TOKEN_HERE"
```

---

# Inventory

## Get Player Inventory

Получить инвентарь конкретного игрока.

```bash
curl http://localhost:3000/players/1/inventory
```

---

## Get All Inventory

Получить весь инвентарь всех игроков.

```bash
curl http://localhost:3000/players/inventory/all
```

---

## Delete Inventory Item

Удалить предмет из инвентаря игрока.

```bash
curl -X DELETE http://localhost:3000/players/1/inventory/1
```

---

# How To Use JWT Token

## 1. Login as admin

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"name":"Grisha","password":"123456"}'
```

## 2. Copy token from response

Пример:

```json
{
  "token": "jwt_token_here"
}
```

## 3. Use token in protected requests

```bash
-H "Authorization: Bearer TOKEN_HERE"
```

Пример полного запроса:

```bash
curl -X PUT http://localhost:3000/players/2/money \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_HERE" \
  -d '{"money":5000}'
```

---

# Common Errors

## Token Not Passed

```json
{
  "message": "Токен не передан"
}
```

## Invalid Or Expired Token

```json
{
  "message": "Неверный или просроченный токен"
}
```

## No Admin Rights

```json
{
  "message": "У вас нет прав"
}
```

## Player Not Found

```json
{
  "message": "Игрок не найден"
}
```

## Not Enough Money

```json
{
  "message": "Недостаточно денег"
}
```
