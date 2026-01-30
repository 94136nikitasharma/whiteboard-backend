const Whiteboard = require('../models/Whiteboard');
const Logger = require('../utils/logger');

class StorageService {
    constructor() {
        this.whiteboards = new Map();
        Logger.info('StorageService initialized with in-memory storage');
    }

    // Create a new whiteboard
    createWhiteboard(name) {
        const whiteboard = new Whiteboard(name);
        this.whiteboards.set(whiteboard.id, whiteboard);
        Logger.info(`Whiteboard created: ${whiteboard.id} - ${name}`);
        return whiteboard;
    }

    // Create a whiteboard with a specific ID (for room-based whiteboards)
    createWhiteboardWithId(id, name) {
        const whiteboard = new Whiteboard(name);
        whiteboard.id = id; // Override the auto-generated ID
        this.whiteboards.set(id, whiteboard);
        Logger.info(`Whiteboard created with custom ID: ${id} - ${name}`);
        return whiteboard;
    }

    // Get a whiteboard by ID
    getWhiteboard(id) {
        return this.whiteboards.get(id);
    }

    // Get all whiteboards
    getAllWhiteboards() {
        return Array.from(this.whiteboards.values());
    }

    // Update whiteboard
    updateWhiteboard(id, updates) {
        const whiteboard = this.whiteboards.get(id);
        if (!whiteboard) {
            return null;
        }

        Object.assign(whiteboard, updates);
        whiteboard.updatedAt = new Date().toISOString();
        return whiteboard;
    }

    // Delete a whiteboard
    deleteWhiteboard(id) {
        const deleted = this.whiteboards.delete(id);
        if (deleted) {
            Logger.info(`Whiteboard deleted: ${id}`);
        }
        return deleted;
    }

    // Add drawing object to whiteboard
    addDrawingObject(whiteboardId, drawingObject) {
        const whiteboard = this.whiteboards.get(whiteboardId);
        if (!whiteboard) {
            return null;
        }

        whiteboard.addDrawingObject(drawingObject);
        return whiteboard;
    }

    // Clear whiteboard canvas
    clearWhiteboardCanvas(whiteboardId) {
        const whiteboard = this.whiteboards.get(whiteboardId);
        if (!whiteboard) {
            return null;
        }

        whiteboard.clearCanvas();
        Logger.info(`Whiteboard canvas cleared: ${whiteboardId}`);
        return whiteboard;
    }

    // Get whiteboard state (all drawing objects)
    getWhiteboardState(whiteboardId) {
        const whiteboard = this.whiteboards.get(whiteboardId);
        if (!whiteboard) {
            return null;
        }

        return {
            id: whiteboard.id,
            name: whiteboard.name,
            drawingObjects: whiteboard.drawingObjects,
            users: whiteboard.getUsers()
        };
    }

    // User management
    addUserToWhiteboard(whiteboardId, userId, userData) {
        const whiteboard = this.whiteboards.get(whiteboardId);
        if (!whiteboard) {
            return null;
        }

        whiteboard.addUser(userId, userData);
        Logger.debug(`User ${userId} added to whiteboard ${whiteboardId}`);
        return whiteboard;
    }

    removeUserFromWhiteboard(whiteboardId, userId) {
        const whiteboard = this.whiteboards.get(whiteboardId);
        if (!whiteboard) {
            return null;
        }

        whiteboard.removeUser(userId);
        Logger.debug(`User ${userId} removed from whiteboard ${whiteboardId}`);
        return whiteboard;
    }

    // Get statistics
    getStats() {
        return {
            totalWhiteboards: this.whiteboards.size,
            whiteboards: this.getAllWhiteboards().map(wb => ({
                id: wb.id,
                name: wb.name,
                users: wb.users.size,
                objects: wb.drawingObjects.length
            }))
        };
    }
}

// Export singleton instance
module.exports = new StorageService();
