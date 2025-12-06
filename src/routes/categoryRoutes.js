const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getCategoryByGame
} = require('../controllers/categoryController');
const {
    createCategoryRules,
    updateCategoryRules,
    categoryIdRules,
    validate
} = require('../middleware/validators/categoryValidator');

const router = express.Router();

router.use(authMiddleware);

// Admin-only routes
router.post('/', adminMiddleware, createCategoryRules, validate, createCategory);
router.put('/:categoryId', adminMiddleware, categoryIdRules, updateCategoryRules, validate, updateCategory);
router.delete('/:categoryId', adminMiddleware, categoryIdRules, validate, deleteCategory);

// Public routes
router.get('/', getAllCategories);
router.get('/:categoryId', categoryIdRules, validate, getCategoryById);
router.get('/game/:gameId', getCategoryByGame);

module.exports = router;
