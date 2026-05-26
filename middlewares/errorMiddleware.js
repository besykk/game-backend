function errorMiddleware(err, req, res, next) {
    console.error(err);

    res.status(500).json({
        message: "Внутренняя ошибка сервера",
    });
}

module.exports = errorMiddleware;