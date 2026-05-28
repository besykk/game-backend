const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");

const {
    registerController,
    loginController,
    meController,
} = require("../controllers/authController");

function createAuthRoutes() {
    const router = express.Router();

    router.post("/register", registerController);

    router.post("/login", loginController);

    router.get("/me", authMiddleware, meController);

    return router;
}

module.exports = createAuthRoutes;