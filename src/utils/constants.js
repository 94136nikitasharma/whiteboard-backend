// Drawing tool types
const TOOL_TYPES = {
    PEN: 'pen',
    LINE: 'line',
    RECTANGLE: 'rectangle',
    CIRCLE: 'circle',
    TEXT: 'text',
    ERASER: 'eraser'
};

// Socket.io event names
const SOCKET_EVENTS = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    JOIN_ROOM: 'join_room',
    LEAVE_ROOM: 'leave_room',
    DRAW: 'draw',
    DRAWING: 'drawing',
    CLEAR_CANVAS: 'clear_canvas',
    CANVAS_CLEARED: 'canvas_cleared',
    UNDO: 'undo',
    REDO: 'redo',
    GET_CANVAS_STATE: 'get_canvas_state',
    CANVAS_STATE: 'canvas_state',
    USER_JOINED: 'user_joined',
    USER_LEFT: 'user_left',
    USERS_UPDATE: 'users_update'
};

// Error messages
const ERROR_MESSAGES = {
    WHITEBOARD_NOT_FOUND: 'Whiteboard not found',
    INVALID_WHITEBOARD_ID: 'Invalid whiteboard ID',
    INVALID_ROOM_NAME: 'Invalid room name',
    INVALID_DRAWING_DATA: 'Invalid drawing data',
    SERVER_ERROR: 'Internal server error'
};

// HTTP status codes
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500
};

module.exports = {
    TOOL_TYPES,
    SOCKET_EVENTS,
    ERROR_MESSAGES,
    HTTP_STATUS
};
