const { Server } = require('socket.io');
const Logger = require('../utils/logger');
const { SOCKET_EVENTS } = require('../utils/constants');

class SocketService {
    constructor() {
        this.io = null;
    }

    // Initialize Socket.io server
    initialize(httpServer) {
        this.io = new Server(httpServer, {
            cors: {
                origin: process.env.CORS_ORIGIN || '*',
                methods: ['GET', 'POST']
            }
        });

        Logger.info('Socket.io server initialized');
        return this.io;
    }

    // Get io instance
    getIO() {
        if (!this.io) {
            throw new Error('Socket.io not initialized. Call initialize() first.');
        }
        return this.io;
    }

    // Emit to a specific room
    emitToRoom(room, event, data) {
        if (this.io) {
            this.io.to(room).emit(event, data);
            Logger.debug(`Emitted ${event} to room ${room}`);
        }
    }

    // Emit to all except sender
    emitToRoomExcept(room, socketId, event, data) {
        if (this.io) {
            this.io.to(room).except(socketId).emit(event, data);
            Logger.debug(`Emitted ${event} to room ${room} except ${socketId}`);
        }
    }

    // Get connected sockets in a room
    getSocketsInRoom(room) {
        if (!this.io) return [];
        const sockets = this.io.sockets.adapter.rooms.get(room);
        return sockets ? Array.from(sockets) : [];
    }

    // Get socket count in room
    getSocketCountInRoom(room) {
        return this.getSocketsInRoom(room).length;
    }
}

// Export singleton instance
module.exports = new SocketService();
