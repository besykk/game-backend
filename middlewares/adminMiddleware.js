function createAdminMiddleware(players) {
    return function adminMiddleware(req, res, next) {
        const adminId = Number(req.body?.adminId);

        if (isNaN(adminId)) {
            return res.status(400).json({
                message: "Нужно передать adminId",
            });
        }

        const admin = players.find((p) => p.id === adminId);

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
    };
}

module.exports = createAdminMiddleware;