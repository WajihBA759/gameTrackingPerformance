// controllers/categoryController.js
const categoryService = require('../services/categoryService');

exports.createCategory = async (req, res) => {
  try {
    const result = await categoryService.createCategory(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('createCategory error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: 'Server error', error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error('getAllCategories error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: 'Server error', error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const result = await categoryService.updateCategory(categoryId, req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('updateCategory error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: 'Server error', error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const result = await categoryService.deleteCategory(categoryId);
    res.status(200).json(result);
  } catch (error) {
    console.error('deleteCategory error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: 'Server error', error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await categoryService.getCategoryById(categoryId);
    res.status(200).json(category);
  } catch (error) {
    console.error('getCategoryById error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: 'Server error', error: error.message });
  }
};

exports.getCategoryByGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const categories = await categoryService.getCategoryByGame(gameId);
    res.status(200).json(categories);
  } catch (error) {
    console.error('getCategoryByGame error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: 'Server error', error: error.message });
  }
};
