const express = require('express');
const router = express.Router();
const categoryMetricController = require('../controllers/categoryMetricController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const {
    createCategoryMetricRules,
    updateCategoryMetricRules,
    metricIdRules,
    validate
} = require('../middleware/validators/categoryMetricValidator');

router.use(authMiddleware);

// More specific routes FIRST, generic routes LAST
router.post('/initialize', adminMiddleware, categoryMetricController.initializeCategoryMetrics);
router.post('/evaluate', categoryMetricController.evaluateMetric);
router.get('/category/:categoryId', categoryMetricController.getCategoryMetricsByCategory);
router.get('/metrics/:metricId/user/:userId', categoryMetricController.getMetricForUser);
router.get('/', categoryMetricController.getAllCategoryMetrics);
router.post('/', adminMiddleware, createCategoryMetricRules, validate, categoryMetricController.createCategoryMetric);

// Generic :metricId route MUST be last
router.get('/:metricId', metricIdRules, validate, categoryMetricController.getCategoryMetricById);
router.put('/:metricId', adminMiddleware, metricIdRules, updateCategoryMetricRules, validate, categoryMetricController.updateCategoryMetric);
router.delete('/:metricId', adminMiddleware, metricIdRules, validate, categoryMetricController.deleteCategoryMetric);

module.exports = router;
