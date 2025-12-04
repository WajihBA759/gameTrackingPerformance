const CategoryMetric = require('../models/categoryMetric');
const AchievementDefinition = require('../models/achievementDefinition');
const Category = require('../models/category');

exports.renderAchievementDefinitionsList = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).send('Category not found');
    }

    // Get all metrics for this category
    const metrics = await CategoryMetric.find({ category: categoryId });
    const metricIds = metrics.map(m => m._id);

    // Get all achievement definitions that use any of these metrics
    const achievements = await AchievementDefinition.find({
      categoryMetric: { $in: metricIds }
    }).populate('categoryMetric', 'metricName metricPath');

    res.render('achievementDefinitionsList', { 
      category,
      achievements,
      metrics 
    });
  } catch (error) {
    console.error('Error rendering achievement definitions:', error);
    res.status(500).send('Server error');
  }
};
