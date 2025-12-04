const express = require('express');
const  authenticate  = require('../middleware/authMiddleware').authMiddleware;
const  adminMiddleware  = require('../middleware/adminMiddleware').adminMiddleware;
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,      
  getCategoryByGame     
} = require('../controllers/categoryController');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Admin-only routes
router.post('/', adminMiddleware, createCategory);
router.put('/:categoryId', adminMiddleware, updateCategory);
router.delete('/:categoryId', adminMiddleware, deleteCategory);

// Public routes
router.get('/', getAllCategories);
router.get('/:categoryId', getCategoryById);
router.get('/game/:gameId', getCategoryByGame);

module.exports = router;
