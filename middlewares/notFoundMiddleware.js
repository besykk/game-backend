function notFoundMiddleware(req, res, next) {
    res.status(404).json({
        message: "Маршрут не найден",
    });
}

module.exports = notFoundMiddleware;