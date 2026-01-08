const LOG_LEVELS = {
    INFO: 'INFO',
    ERROR: 'ERROR',
    DEBUG: 'DEBUG',
    WARN: 'WARN'
};

class Logger {
    static log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level}] ${message}`;

        if (data) {
            console.log(logMessage, data);
        } else {
            console.log(logMessage);
        }
    }

    static info(message, data = null) {
        this.log(LOG_LEVELS.INFO, message, data);
    }

    static error(message, data = null) {
        this.log(LOG_LEVELS.ERROR, message, data);
    }

    static debug(message, data = null) {
        if (process.env.NODE_ENV === 'development') {
            this.log(LOG_LEVELS.DEBUG, message, data);
        }
    }

    static warn(message, data = null) {
        this.log(LOG_LEVELS.WARN, message, data);
    }
}

module.exports = Logger;
