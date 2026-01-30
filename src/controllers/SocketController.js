const StorageService = require('../services/StorageService');
const SocketService = require('../services/SocketService');
const DrawingObject = require('../models/DrawingObject');
const Logger = require('../utils/logger');
const { SOCKET_EVENTS } = require('../utils/constants');

class SocketController {
    // Handle socket connections
    handleConnection(socket) {
        Logger.info(`Client connected: ${socket.id}`);

        // Join room
        socket.on(SOCKET_EVENTS.JOIN_ROOM, (data) => this.handleJoinRoom(socket, data));

        // Leave room
        socket.on(SOCKET_EVENTS.LEAVE_ROOM, (data) => this.handleLeaveRoom(socket, data));

        // Drawing events
        socket.on(SOCKET_EVENTS.DRAW, (data) => this.handleDraw(socket, data));

        // Clear canvas
        socket.on(SOCKET_EVENTS.CLEAR_CANVAS, (data) => this.handleClearCanvas(socket, data));

        // Get canvas state
        socket.on(SOCKET_EVENTS.GET_CANVAS_STATE, (data) => this.handleGetCanvasState(socket, data));

        // Disconnect
        socket.on(SOCKET_EVENTS.DISCONNECT, () => this.handleDisconnect(socket));
    }

    // Handle join room
    handleJoinRoom(socket, data) {
        const { roomId, userName } = data;

        if (!roomId) {
            Logger.warn('Join room attempt without roomId');
            return;
        }

        // Get or create whiteboard using roomId as the key
        let whiteboard = StorageService.getWhiteboard(roomId);
        if (!whiteboard) {
            // Create whiteboard with roomId as the ID
            whiteboard = StorageService.createWhiteboardWithId(roomId, `Room ${roomId}`);
        }

        // Join socket to room
        socket.join(roomId);
        socket.currentRoom = roomId;
        socket.userName = userName || `User ${socket.id.substring(0, 6)}`;

        // Add user to whiteboard
        StorageService.addUserToWhiteboard(roomId, socket.id, {
            name: socket.userName
        });

        Logger.info(`${socket.userName} joined room ${roomId}`);

        // Send current canvas state to the new user
        const state = StorageService.getWhiteboardState(roomId);
        if (state) {
            socket.emit(SOCKET_EVENTS.CANVAS_STATE, state);

            // Notify others in the room
            SocketService.emitToRoomExcept(roomId, socket.id, SOCKET_EVENTS.USER_JOINED, {
                userId: socket.id,
                userName: socket.userName,
                users: state.users
            });

            // Send updated user list to all
            SocketService.emitToRoom(roomId, SOCKET_EVENTS.USERS_UPDATE, {
                users: state.users
            });
        }
    }

    // Handle leave room
    handleLeaveRoom(socket, data) {
        const { roomId } = data;

        if (!roomId) return;

        socket.leave(roomId);
        StorageService.removeUserFromWhiteboard(roomId, socket.id);

        Logger.info(`${socket.userName || socket.id} left room ${roomId}`);

        const whiteboard = StorageService.getWhiteboard(roomId);
        if (whiteboard) {
            SocketService.emitToRoom(roomId, SOCKET_EVENTS.USER_LEFT, {
                userId: socket.id,
                userName: socket.userName,
                users: whiteboard.getUsers()
            });

            SocketService.emitToRoom(roomId, SOCKET_EVENTS.USERS_UPDATE, {
                users: whiteboard.getUsers()
            });
        }

        socket.currentRoom = null;
    }

    // Handle drawing
    handleDraw(socket, data) {
        const { roomId, drawingData } = data;

        if (!roomId || !drawingData) {
            Logger.warn('Invalid draw data received');
            return;
        }

        // Create drawing object
        const drawingObject = new DrawingObject(drawingData);

        // Add to storage
        const whiteboard = StorageService.addDrawingObject(roomId, drawingObject);

        if (!whiteboard) {
            Logger.warn(`Whiteboard not found for drawing: ${roomId}`);
            return;
        }

        // Broadcast to all clients in the room (including sender for confirmation)
        SocketService.emitToRoom(roomId, SOCKET_EVENTS.DRAWING, {
            drawingObject: drawingObject.toJSON(),
            userId: socket.id
        });

        Logger.debug(`Drawing added to room ${roomId}`);
    }

    // Handle clear canvas
    handleClearCanvas(socket, data) {
        const { roomId } = data;

        if (!roomId) return;

        const whiteboard = StorageService.clearWhiteboardCanvas(roomId);

        if (!whiteboard) {
            Logger.warn(`Whiteboard not found for clearing: ${roomId}`);
            return;
        }

        // Broadcast to all clients in the room
        SocketService.emitToRoom(roomId, SOCKET_EVENTS.CANVAS_CLEARED, {
            userId: socket.id,
            userName: socket.userName
        });

        Logger.info(`Canvas cleared in room ${roomId} by ${socket.userName}`);
    }

    // Handle get canvas state
    handleGetCanvasState(socket, data) {
        const { roomId } = data;

        if (!roomId) return;

        const state = StorageService.getWhiteboardState(roomId);

        if (!state) {
            socket.emit(SOCKET_EVENTS.CANVAS_STATE, { error: 'Whiteboard not found' });
            return;
        }

        socket.emit(SOCKET_EVENTS.CANVAS_STATE, state);
    }

    // Handle disconnect
    handleDisconnect(socket) {
        Logger.info(`Client disconnected: ${socket.id}`);

        // Remove from current room if in one
        if (socket.currentRoom) {
            StorageService.removeUserFromWhiteboard(socket.currentRoom, socket.id);

            const whiteboard = StorageService.getWhiteboard(socket.currentRoom);
            if (whiteboard) {
                SocketService.emitToRoom(socket.currentRoom, SOCKET_EVENTS.USER_LEFT, {
                    userId: socket.id,
                    userName: socket.userName,
                    users: whiteboard.getUsers()
                });

                SocketService.emitToRoom(socket.currentRoom, SOCKET_EVENTS.USERS_UPDATE, {
                    users: whiteboard.getUsers()
                });
            }
        }
    }
}

module.exports = new SocketController();
