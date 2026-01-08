const { ERROR_MESSAGES, HTTP_STATUS, TOOL_TYPES } = require('../utils/constants');

// Validate whiteboard creation
function validateWhiteboardCreation(req, res, next) {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: ERROR_MESSAGES.INVALID_ROOM_NAME
        });
    }

    if (name.length > 100) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: 'Whiteboard name must be less than 100 characters'
        });
    }

    next();
}

// Validate drawing data
function validateDrawingData(drawingData) {
    if (!drawingData || typeof drawingData !== 'object') {
        return false;
    }

    const { type } = drawingData;
    const validTypes = Object.values(TOOL_TYPES);

    if (!type || !validTypes.includes(type)) {
        return false;
    }

    return true;
}

module.exports = {
    validateWhiteboardCreation,
    validateDrawingData
};
