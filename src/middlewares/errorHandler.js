const Logger = require('../utils/logger');
const { ERROR_MESSAGES, HTTP_STATUS } = require('../utils/constants');

function errorHandler(err, req, res, next) {
    Logger.error('Error occurred:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method
    });

    // Default error
    const status = err.status || HTTP_STATUS.INTERNAL_ERROR;
    const message = err.message || ERROR_MESSAGES.SERVER_ERROR;

    res.status(status).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

module.exports = errorHandler;
