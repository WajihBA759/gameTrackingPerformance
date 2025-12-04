// services/categoryService.js
const Category = require('../models/category');

// Helper to build endpoint with placeholders
function buildEndpointWithParams(baseEndpoint, parameters = []) {
  let newEndpoint = baseEndpoint;
  for (const param of parameters) {
    newEndpoint = newEndpoint + `/{${param.name}}`;
  }
  return newEndpoint;
}

async function createCategory(data) {
  const { name, endpoint, game, headers, parameters } = data;

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    const err = new Error('Category already exists');
    err.statusCode = 400;
    throw err;
  }

  const newEndpoint = buildEndpointWithParams(endpoint, parameters);
  const newCategory = new Category({
    name,
    endpoint: newEndpoint,
    game,
    headers,
    parameters
  });

  await newCategory.save();
  return { message: 'Category created successfully', category: newCategory };
}

async function getAllCategories() {
  return Category.find();
}

async function updateCategory(categoryId, data) {
  const { name, endpoint, headers, parameters } = data;

  const cat = await Category.findById(categoryId);
  if (!cat) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }

  cat.name = name;
  cat.parameters = parameters;
  cat.endpoint = buildEndpointWithParams(endpoint, parameters);
  cat.headers = headers;

  await cat.save();
  return { message: 'Category updated successfully', category: cat };
}

async function deleteCategory(categoryId) {
  const cat = await Category.findByIdAndDelete(categoryId);
  if (!cat) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }
  return { message: 'Category deleted successfully' };
}

async function getCategoryById(categoryId) {
  const cat = await Category.findById(categoryId);
  if (!cat) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }
  return cat;
}

async function getCategoryByGame(gameId) {
  return Category.find({ game: gameId });
}

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getCategoryByGame
};
