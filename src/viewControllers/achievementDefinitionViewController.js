const AchievementDefinition = require('../models/achievementDefinition');
const Category = require('../models/category');
const CategoryMetric = require('../models/categoryMetric');

// Render achievements list for a category
exports.renderAchievementsList = async (req, res) => {
    try {
        const { categoryId } = req.params;
        
        // Fetch category with game info
        const category = await Category.findById(categoryId).populate('game').lean();
        if (!category) {
            return res.status(404).send('Category not found');
        }
        
        // Fetch metrics for this category
        const metrics = await CategoryMetric.find({ category: categoryId }).lean();
        
        // Fetch achievements by finding all that use metrics from this category
        const metricIds = metrics.map(m => m._id);
        const achievements = await AchievementDefinition.find({ 
            categoryMetric: { $in: metricIds } 
        }).populate('categoryMetric').lean();
        
        res.render('achievementDefinitionsList', { 
            category, 
            achievements,
            metrics,
            categoryId 
        });
    } catch (error) {
        console.error('Error rendering achievements:', error);
        res.status(500).send('Error loading achievements: ' + error.message);
    }
};

// Render add achievement form
exports.renderAddAchievement = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findById(categoryId).lean();
        const metrics = await CategoryMetric.find({ category: categoryId }).lean();
        
        res.render('addAchievement', { category, categoryId, metrics });
    } catch (error) {
        console.error('Error rendering add achievement form:', error);
        res.status(500).send('Error loading form: ' + error.message);
    }
};

// Render edit achievement form
exports.renderEditAchievement = async (req, res) => {
    try {
        const { achievementId } = req.params;
        const achievement = await AchievementDefinition.findById(achievementId).populate('categoryMetric').lean();
        
        if (!achievement) {
            return res.status(404).send('Achievement not found');
        }
        
        const category = await Category.findById(achievement.categoryMetric.category).lean();
        const metrics = await CategoryMetric.find({ category: category._id }).lean();
        
        res.render('editAchievement', { achievement, category, metrics });
    } catch (error) {
        console.error('Error rendering edit achievement form:', error);
        res.status(500).send('Error loading form: ' + error.message);
    }
};
