const category=require('../models/category');

exports.createCategory=async(req,res)=>{
    const { name, endpoint, game,headers, parameters } = req.body;
    try {
        const existingCategory = await category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }
        let newEnedpoint = endpoint;
        for (const param of parameters) {
            newEnedpoint = newEnedpoint+`/{${param.name}}`;
        }
        const newCategory = new category({ name, endpoint:newEnedpoint, game, headers, parameters });
        await newCategory.save();
        res.status(201).json({ message: 'Category created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getAllCategories=async(req,res)=>{
    try {
        const categories = await category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateCategory=async(req,res)=>{
    const { categoryId } = req.params;
    const { name, endpoint, headers, parameters } = req.body;
    try {
        const category = await category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        category.name = name;
        category.parameters = parameters;
        let newEnedpoint = endpoint;
        for (const param of parameters) {
            newEnedpoint = newEnedpoint+`/{${param.name}}`;
        }
        category.endpoint = newEnedpoint;
        category.headers = headers;
        await category.save();
        res.status(200).json({ message: 'Category updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteCategory=async(req,res)=>{
    const { categoryId } = req.params;
    try {
        const category = await category.findByIdAndDelete(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCategoryById=async(req,res)=>{
    const { categoryId } = req.params;
    try {
        const categoryData = await category.findById(categoryId);
        if (!categoryData) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(categoryData);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCategoryByGame=async(req,res)=>{
    const { gameId } = req.params;
    try {
        const categories = await category.find({ game: gameId });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};