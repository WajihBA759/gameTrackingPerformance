const express = require('express');
const  authenticate  = require('../middleware/authMiddleware').authMiddleware;
const  adminMiddleware  = require('../middleware/adminMiddleware').adminMiddleware;
const {
  getAllCategoryMetrics,
  createCategoryMetric,
  updateCategoryMetric,
  deleteCategoryMetric,
  getCategoryMetricsByCategory,
  initializeCategoryMetrics, 
  evaluateMetric
} = require('../controllers/categoryMetricController');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Admin-only routes
router.post('/', adminMiddleware, createCategoryMetric);
router.put('/:metricId', adminMiddleware, updateCategoryMetric);
router.delete('/:metricId', adminMiddleware, deleteCategoryMetric);

// Admin-only: initialize metrics automatically from a category's endpoint
router.post('/initialize', adminMiddleware, initializeCategoryMetrics);

// Public: evaluate a specific metric (e.g., sum, avg, count)
router.post('/evaluate', evaluateMetric);

// Public read routes
router.get('/', getAllCategoryMetrics);
router.get('/category/:categoryId', getCategoryMetricsByCategory);

module.exports = router;
