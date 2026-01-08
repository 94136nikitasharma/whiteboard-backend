# Whiteboard Backend

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![Socket.io Version](https://img.shields.io/badge/socket.io-4.7.5-blue)](https://socket.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

A real-time collaborative whiteboard backend server built with Node.js, Express, and Socket.io.

## Overview

This project provides a fully functional server-side and frontend infrastructure for a collaborative whiteboard application. Built with Express.js and Socket.io, it supports real-time multi-user collaboration, room management, and synchronized drawing operations. Includes a complete HTML5 Canvas-based frontend application.

## Features

- ✅ **Real-time Collaboration** - Multiple users can draw simultaneously with WebSocket synchronization
- ✅ **Room Management** - Create and manage multiple whiteboard rooms
- ✅ **Drawing Tools Support** - Pen, line, rectangle, circle, text, and eraser
- ✅ **User Presence** - Track active users in each room
- ✅ **Canvas State Sync** - New users receive current whiteboard state on join
- ✅ **RESTful API** - CRUD operations for whiteboards
- ✅ **CORS Support** - Configurable cross-origin resource sharing
- ✅ **In-memory Storage** - Fast data access (easily replaceable with database)

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework (v5.2.1)
- **Socket.io** - Real-time WebSocket communication (v4.7.5)
- **UUID** - Unique identifier generation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Project Structure

```
whiteboard-backend/
├── src/
│   ├── server.js                    # Server entry point with Socket.io setup
│   ├── app.js                       # Express app configuration
│   ├── models/
│   │   ├── Whiteboard.js           # Whiteboard data model
│   │   └── DrawingObject.js        # Drawing object model
│   ├── controllers/
│   │   ├── WhiteboardController.js # REST API controllers
│   │   └── SocketController.js     # WebSocket event handlers
│   ├── services/
│   │   ├── StorageService.js       # In-memory data storage
│   │   └── SocketService.js        # Socket.io management
│   ├── routes/
│   │   ├── health.js               # Health check endpoint
│   │   └── whiteboard.js           # Whiteboard REST routes
│   ├── middlewares/
│   │   ├── errorHandler.js         # Global error handler
│   │   └── validation.js           # Request validation
│   └── utils/
│       ├── constants.js            # App constants and enums
│       └── logger.js               # Logging utility
├── package.json
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd whiteboard-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   PORT=8080
   CORS_ORIGIN=http://localhost:3000
   NODE_ENV=development
   ```

### Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on the configured port (default: 8080).

### Accessing the Application

**Frontend Application:**
```
http://localhost:8080
```
or
```
http://localhost:8080/index.html
```

**API Endpoint:**
```
http://localhost:8080/api/whiteboards
```

**Test Client:**
```
Open test-client.html in your browser
```

## API Documentation

### REST API Endpoints

#### Root Endpoint
```
GET /
```
Returns API information and available endpoints.

**Response:**
```json
{
  "message": "Whiteboard Backend API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "whiteboards": "/api/whiteboards"
  }
}
```

#### Health Check
```
GET /health
```
Check server status.

**Response:**
```json
{
  "status": "OK",
  "message": "Whiteboard backend is running"
}
```

#### Get All Whiteboards
```
GET /api/whiteboards
```
Retrieve all whiteboards.

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "uuid-here",
      "name": "My Whiteboard",
      "createdAt": "2026-01-08T...",
      "updatedAt": "2026-01-08T...",
      "objectCount": 15,
      "userCount": 3
    }
  ]
}
```

#### Create Whiteboard
```
POST /api/whiteboards
```

**Request Body:**
```json
{
  "name": "My New Whiteboard"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "My New Whiteboard",
    "createdAt": "2026-01-08T...",
    "updatedAt": "2026-01-08T...",
    "drawingObjects": [],
    "users": []
  }
}
```

#### Get Specific Whiteboard
```
GET /api/whiteboards/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "My Whiteboard",
    "drawingObjects": [...],
    "users": [...]
  }
}
```

#### Get Whiteboard State
```
GET /api/whiteboards/:id/state
```
Get current canvas state with all drawing objects.

#### Delete Whiteboard
```
DELETE /api/whiteboards/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Whiteboard deleted successfully"
}
```

#### Get Statistics
```
GET /api/whiteboards/stats/all
```
Get server statistics (total whiteboards, users, etc.).

---

### WebSocket Events (Socket.io)

Connect to: `ws://localhost:8080`

#### Client → Server Events

**Join Room**
```javascript
socket.emit('join_room', {
  roomId: 'whiteboard-id',
  userName: 'John Doe'
});
```

**Leave Room**
```javascript
socket.emit('leave_room', {
  roomId: 'whiteboard-id'
});
```

**Draw**
```javascript
socket.emit('draw', {
  roomId: 'whiteboard-id',
  drawingData: {
    type: 'pen',        // pen, line, rectangle, circle, text, eraser
    color: '#000000',
    width: 2,
    points: [{x: 100, y: 150}, {x: 105, y: 155}]
  }
});
```

**Clear Canvas**
```javascript
socket.emit('clear_canvas', {
  roomId: 'whiteboard-id'
});
```

**Get Canvas State**
```javascript
socket.emit('get_canvas_state', {
  roomId: 'whiteboard-id'
});
```

#### Server → Client Events

**Canvas State** (sent on join or request)
```javascript
socket.on('canvas_state', (data) => {
  // data contains: { id, name, drawingObjects, users }
});
```

**Drawing** (broadcast when someone draws)
```javascript
socket.on('drawing', (data) => {
  // data contains: { drawingObject, userId }
});
```

**User Joined**
```javascript
socket.on('user_joined', (data) => {
  // data contains: { userId, userName, users }
});
```

**User Left**
```javascript
socket.on('user_left', (data) => {
  // data contains: { userId, userName, users }
});
```

**Users Update**
```javascript
socket.on('users_update', (data) => {
  // data contains: { users: [...] }
});
```

**Canvas Cleared**
```javascript
socket.on('canvas_cleared', (data) => {
  // data contains: { userId, userName }
});
```

## Usage Example

### Creating a Whiteboard and Connecting

```javascript
// 1. Create a whiteboard via REST API
const response = await fetch('http://localhost:8080/api/whiteboards', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'My Whiteboard' })
});
const { data } = await response.json();
const whiteboardId = data.id;

// 2. Connect via WebSocket
const socket = io('http://localhost:8080');

// 3. Join the room
socket.emit('join_room', {
  roomId: whiteboardId,
  userName: 'Alice'
});

// 4. Listen for canvas state
socket.on('canvas_state', (state) => {
  console.log('Current canvas:', state);
});

// 5. Draw something
socket.emit('draw', {
  roomId: whiteboardId,
  drawingData: {
    type: 'pen',
    color: '#FF0000',
    width: 3,
    points: [{x: 10, y: 20}, {x: 15, y: 25}]
  }
});

// 6. Listen for other users' drawings
socket.on('drawing', (data) => {
  console.log('New drawing:', data.drawingObject);
});
```

## Drawing Object Types

The system supports the following drawing tool types:

- `pen` - Freehand drawing with points array
- `line` - Straight line with start/end points
- `rectangle` - Rectangle shape
- `circle` - Circle with center and radius
- `text` - Text with position and content
- `eraser` - Eraser tool

## Architecture Notes

### In-Memory Storage
- Current implementation uses in-memory Map for storage
- Data is lost on server restart
- Perfect for development and testing
- For production, replace `StorageService` with Redis or MongoDB

### Scalability
- WebSocket connections require sticky sessions for load balancing
- Consider using Redis adapter for Socket.io in multi-server setup
- In-memory storage limits horizontal scaling

## Development

### Project Architecture

The application follows a layered architecture:

- **Models**: Data structures for Whiteboard and DrawingObject
- **Services**: Business logic and data management
- **Controllers**: Request handlers and WebSocket event handlers
- **Routes**: API endpoint definitions
- **Middlewares**: Cross-cutting concerns (error handling, validation)
- **Utils**: Helper functions and constants

### Error Handling

Global error handler captures all errors and returns standardized responses:
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Testing

### Manual Testing with cURL

```bash
# Create whiteboard
curl -X POST http://localhost:8080/api/whiteboards \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Board"}'

# Get all whiteboards
curl http://localhost:8080/api/whiteboards

# Get specific whiteboard
curl http://localhost:8080/api/whiteboards/{id}

# Delete whiteboard
curl -X DELETE http://localhost:8080/api/whiteboards/{id}
```

### WebSocket Testing

Use a Socket.io client or browser console:

```javascript
const socket = io('http://localhost:8080');
socket.emit('join_room', { roomId: 'test-room', userName: 'Tester' });
```

## Production Considerations

1. **Database Integration**: Replace in-memory storage with persistent database
2. **Authentication**: Add user authentication and authorization
3. **Rate Limiting**: Implement rate limiting for API endpoints
4. **Logging**: Use proper logging service (Winston, Pino)
5. **Monitoring**: Add application monitoring (PM2, DataDog, New Relic)
6. **SSL/TLS**: Enable HTTPS for production
7. **Environment Variables**: Use proper secret management

## License

ISC
