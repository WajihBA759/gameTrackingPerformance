const express = require('express');
const router = express.Router();
const categoryMetricController = require('../controllers/categoryMetricController');
const authenticate = require('../middleware/authMiddleware').authMiddleware;
const adminMiddleware = require('../middleware/adminMiddleware').adminMiddleware;

// Apply authentication to all routes
router.use(authenticate);

//Getting a metric value by a specefic userIdentifier
router.get('/metrics/:metricId/user/:userId', categoryMetricController.getMetricForUser);

//More specific routes FIRST, generic routes LAST
router.post('/initialize', adminMiddleware, categoryMetricController.initializeCategoryMetrics);
router.post('/evaluate', categoryMetricController.evaluateMetric);
router.get('/category/:categoryId', categoryMetricController.getCategoryMetricsByCategory); // Specific route
router.get('/', categoryMetricController.getAllCategoryMetrics);
router.post('/', adminMiddleware, categoryMetricController.createCategoryMetric);

//Generic :metricId route MUST be last
router.get('/:metricId', categoryMetricController.getCategoryMetricById);
router.put('/:metricId', adminMiddleware, categoryMetricController.updateCategoryMetric);
router.delete('/:metricId', adminMiddleware, categoryMetricController.deleteCategoryMetric);

module.exports = router;