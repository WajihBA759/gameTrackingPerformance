const categoryMetric=require('../models/categoryMetric');
const category=require('../models/category');

exports.renderCategoryMetrics=async(req,res)=>{
    try {
        const metrics = await categoryMetric.find().populate('category','name');
        res.render('categoryMetricsList', { metrics });
    } catch (error) {
        res.status(500).send('Server error');
    }
};
exports.renderCategoryMetricsByCategory=async(req,res)=>{
    const { categoryId } = req.params;
    try {
        const categoryData = await category.findById(categoryId);
        if (!categoryData) {
            return res.status(404).send('Category not found');
        }
        const metrics = await categoryMetric.find({ category: categoryId }).populate('category', 'name');
        res.render('categoryMetricsByCategory', { category: categoryData, metrics });
    } catch (error) {
        res.status(500).send('Server error');
    }
};