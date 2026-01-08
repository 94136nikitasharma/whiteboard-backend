const express = require('express');
const router = express.Router();
const WhiteboardController = require('../controllers/WhiteboardController');

// Get all whiteboards
router.get('/', (req, res) => WhiteboardController.getAllWhiteboards(req, res));

// Create new whiteboard
router.post('/', (req, res) => WhiteboardController.createWhiteboard(req, res));

// Get specific whiteboard
router.get('/:id', (req, res) => WhiteboardController.getWhiteboard(req, res));

// Delete whiteboard
router.delete('/:id', (req, res) => WhiteboardController.deleteWhiteboard(req, res));

// Get whiteboard state (canvas data)
router.get('/:id/state', (req, res) => WhiteboardController.getWhiteboardState(req, res));

// Get statistics
router.get('/stats/all', (req, res) => WhiteboardController.getStats(req, res));

module.exports = router;
