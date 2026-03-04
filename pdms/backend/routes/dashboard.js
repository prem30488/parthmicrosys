const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/dashboard/stats
router.get('/stats', dashboardController.getStats);

module.exports = router;
