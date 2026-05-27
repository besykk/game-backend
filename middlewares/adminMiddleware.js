const { getPlayerById } = require("../models/playerModel")

function createAdminMiddleware(players) {
    return async function adminMiddleware(req, res, next) {
        try {
            const adminId = Number(req.body?.adminId);

            if (isNaN(adminId)) {
                return res.status(400).json({
                    message: "Нужно передать adminId",
                });
            }

            const admin = await getPlayerById(adminId);

            if (!admin) {
                return res.status(404).json({
                    message: "Админ не найден",
                });
            }

            if (admin.role !== "admin") {
                return res.status(403).json({
                    message: "У вас нет прав",
                });
            }

            req.admin = admin;

            next();
        } catch (error) {
            next(error);
        }
    };
}

module.exports = createAdminMiddleware;