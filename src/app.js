const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '../public')));

// Routes
const healthRoute = require('./routes/health');
const whiteboardRoute = require('./routes/whiteboard');

app.use('/health', healthRoute);
app.use('/api/whiteboards', whiteboardRoute);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Whiteboard Backend API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            whiteboards: '/api/whiteboards'
        }
    });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
