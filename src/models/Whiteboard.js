const { v4: uuidv4 } = require('uuid');

class Whiteboard {
    constructor(name = 'Untitled Whiteboard') {
        this.id = uuidv4();
        this.name = name;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
        this.drawingObjects = [];
        this.users = new Map(); // userId -> user info
    }

    addDrawingObject(drawingObject) {
        this.drawingObjects.push(drawingObject);
        this.updatedAt = new Date().toISOString();
    }

    removeDrawingObject(objectId) {
        this.drawingObjects = this.drawingObjects.filter(obj => obj.id !== objectId);
        this.updatedAt = new Date().toISOString();
    }

    clearCanvas() {
        this.drawingObjects = [];
        this.updatedAt = new Date().toISOString();
    }

    addUser(userId, userData) {
        this.users.set(userId, {
            id: userId,
            ...userData,
            joinedAt: new Date().toISOString()
        });
    }

    removeUser(userId) {
        this.users.delete(userId);
    }

    getUsers() {
        return Array.from(this.users.values());
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            drawingObjects: this.drawingObjects,
            users: this.getUsers(),
            objectCount: this.drawingObjects.length,
            userCount: this.users.size
        };
    }
}

module.exports = Whiteboard;
