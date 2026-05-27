const authMiddleware = require("./authMiddleware");

function adminMiddleware(req, res, next) {
    authMiddleware(req, res, () => {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "У вас нет прав",
            });
        }

        req.admin = req.user;

        next();
    });
}

module.exports = adminMiddleware;