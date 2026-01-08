require('dotenv').config();
const http = require('http');
const app = require('./app');
const SocketService = require('./services/SocketService');
const SocketController = require('./controllers/SocketController');
const Logger = require('./utils/logger');
const { SOCKET_EVENTS } = require('./utils/constants');

const PORT = process.env.PORT || 8080;

// Create HTTP server
const httpServer = http.createServer(app);

// Initialize Socket.io
const io = SocketService.initialize(httpServer);

// Handle socket connections
io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
  SocketController.handleConnection(socket);
});

// Start server
httpServer.listen(PORT, () => {
  Logger.info(`Server running on port ${PORT}`);
  Logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  Logger.info(`CORS origin: ${process.env.CORS_ORIGIN || '*'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  Logger.info('SIGTERM received, closing server...');
  httpServer.close(() => {
    Logger.info('Server closed');
    process.exit(0);
  });
});
