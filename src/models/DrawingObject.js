const { v4: uuidv4 } = require('uuid');

class DrawingObject {
    constructor({ type, color, width, points, x, y, radius, text, fontSize }) {
        this.id = uuidv4();
        this.type = type; // pen, line, rectangle, circle, text, eraser
        this.color = color || '#000000';
        this.width = width || 2;
        this.timestamp = Date.now();

        // For pen/line/path drawing
        this.points = points || [];

        // For shapes
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.endX = null;
        this.endY = null;

        // For text
        this.text = text;
        this.fontSize = fontSize;
    }

    toJSON() {
        return {
            id: this.id,
            type: this.type,
            color: this.color,
            width: this.width,
            timestamp: this.timestamp,
            points: this.points,
            x: this.x,
            y: this.y,
            radius: this.radius,
            endX: this.endX,
            endY: this.endY,
            text: this.text,
            fontSize: this.fontSize
        };
    }
}

module.exports = DrawingObject;
