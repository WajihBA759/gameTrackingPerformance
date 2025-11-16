const express = require('express');
const router = express.Router();
const categoryViewController = require('../viewControllers/categoryViewController');

// Category view routes
router.get('/game/:gameId', categoryViewController.renderCategoriesList);
router.get('/add/:gameId', categoryViewController.renderAddCategory);
router.get('/edit/:categoryId', categoryViewController.renderEditCategory);
router.get('/:categoryId/metrics', categoryViewController.renderCategoryMetrics);

module.exports = router;