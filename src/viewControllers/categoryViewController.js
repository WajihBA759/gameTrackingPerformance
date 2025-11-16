const Category = require('../models/category');
const CategoryMetric = require('../models/categoryMetric');
const Game = require('../models/game');

exports.renderCategoriesList = async (req, res) => {
    try {
        const gameId = req.params.gameId;
        const game = await Game.findById(gameId);
        
        if (!game) {
            return res.status(404).send('Game not found');
        }
        
        const categories = await Category.find({ game: gameId }).sort({ createdAt: -1 });
        
        // Get metrics count for each category
        const categoriesWithMetrics = await Promise.all(
            categories.map(async (category) => {
                const metricsCount = await CategoryMetric.countDocuments({ category: category._id });
                return {
                    ...category.toObject(),
                    metricsCount
                };
            })
        );
        
        res.render('categoriesList', { 
            categories: categoriesWithMetrics,
            game 
        });
    } catch (error) {
        console.error('Error rendering categories:', error);
        res.status(500).send('Server error');
    }
};

exports.renderAddCategory = async (req, res) => {
    try {
        const gameId = req.params.gameId;
        const game = await Game.findById(gameId);
        
        if (!game) {
            return res.status(404).send('Game not found');
        }
        
        res.render('addCategory', { game });
    } catch (error) {
        console.error('Error rendering add category:', error);
        res.status(500).send('Server error');
    }
};

exports.renderEditCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        
        if (!category) {
            return res.status(404).send('Category not found');
        }
        
        res.render('editCategory', { category });
    } catch (error) {
        console.error('Error rendering edit category:', error);
        res.status(500).send('Server error');
    }
};

exports.renderCategoryMetrics = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await Category.findById(categoryId);
        
        if (!category) {
            return res.status(404).send('Category not found');
        }
        
        const metrics = await CategoryMetric.find({ category: categoryId }).sort({ createdAt: -1 });
        
        res.render('categoryMetrics', { 
            category,
            metrics 
        });
    } catch (error) {
        console.error('Error rendering category metrics:', error);
        res.status(500).send('Server error');
    }
};