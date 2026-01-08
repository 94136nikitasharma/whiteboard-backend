const StorageService = require('../services/StorageService');
const Logger = require('../utils/logger');
const { ERROR_MESSAGES, HTTP_STATUS } = require('../utils/constants');

class WhiteboardController {
    // Get all whiteboards
    getAllWhiteboards(req, res) {
        try {
            const whiteboards = StorageService.getAllWhiteboards();
            res.json({
                success: true,
                count: whiteboards.length,
                data: whiteboards.map(wb => wb.toJSON())
            });
        } catch (error) {
            Logger.error('Error getting all whiteboards', error);
            res.status(HTTP_STATUS.INTERNAL_ERROR).json({
                success: false,
                error: ERROR_MESSAGES.SERVER_ERROR
            });
        }
    }

    // Get specific whiteboard
    getWhiteboard(req, res) {
        try {
            const { id } = req.params;
            const whiteboard = StorageService.getWhiteboard(id);

            if (!whiteboard) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    error: ERROR_MESSAGES.WHITEBOARD_NOT_FOUND
                });
            }

            res.json({
                success: true,
                data: whiteboard.toJSON()
            });
        } catch (error) {
            Logger.error('Error getting whiteboard', error);
            res.status(HTTP_STATUS.INTERNAL_ERROR).json({
                success: false,
                error: ERROR_MESSAGES.SERVER_ERROR
            });
        }
    }

    // Create new whiteboard
    createWhiteboard(req, res) {
        try {
            const { name } = req.body;

            if (!name || name.trim() === '') {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: ERROR_MESSAGES.INVALID_ROOM_NAME
                });
            }

            const whiteboard = StorageService.createWhiteboard(name);

            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                data: whiteboard.toJSON()
            });
        } catch (error) {
            Logger.error('Error creating whiteboard', error);
            res.status(HTTP_STATUS.INTERNAL_ERROR).json({
                success: false,
                error: ERROR_MESSAGES.SERVER_ERROR
            });
        }
    }

    // Delete whiteboard
    deleteWhiteboard(req, res) {
        try {
            const { id } = req.params;
            const deleted = StorageService.deleteWhiteboard(id);

            if (!deleted) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    error: ERROR_MESSAGES.WHITEBOARD_NOT_FOUND
                });
            }

            res.json({
                success: true,
                message: 'Whiteboard deleted successfully'
            });
        } catch (error) {
            Logger.error('Error deleting whiteboard', error);
            res.status(HTTP_STATUS.INTERNAL_ERROR).json({
                success: false,
                error: ERROR_MESSAGES.SERVER_ERROR
            });
        }
    }

    // Get whiteboard state (canvas data)
    getWhiteboardState(req, res) {
        try {
            const { id } = req.params;
            const state = StorageService.getWhiteboardState(id);

            if (!state) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    error: ERROR_MESSAGES.WHITEBOARD_NOT_FOUND
                });
            }

            res.json({
                success: true,
                data: state
            });
        } catch (error) {
            Logger.error('Error getting whiteboard state', error);
            res.status(HTTP_STATUS.INTERNAL_ERROR).json({
                success: false,
                error: ERROR_MESSAGES.SERVER_ERROR
            });
        }
    }

    // Get storage statistics
    getStats(req, res) {
        try {
            const stats = StorageService.getStats();
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            Logger.error('Error getting stats', error);
            res.status(HTTP_STATUS.INTERNAL_ERROR).json({
                success: false,
                error: ERROR_MESSAGES.SERVER_ERROR
            });
        }
    }
}

module.exports = new WhiteboardController();
