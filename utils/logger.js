const config = require("../config");

const fs = require("fs");

const LOG_FILE = config.files.logs;

function getCurrentTime() {
    return new Date().toISOString();
}

function logAction(message) {
    const logMessage = `[${getCurrentTime()}] ${message}\n`;

    fs.appendFileSync(LOG_FILE, logMessage);
}

module.exports = logAction;