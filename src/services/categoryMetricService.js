// services/categoryMetricService.js
const CategoryMetric = require('../models/categoryMetric');
const { groupByMetric } = require('../utils/groupByMetric');
const axios = require('axios');
const Category = require('../models/category');
const extractMetricPaths = require('../utils/extractMetricPaths');
const metricLogic = require('../utils/metricLogic');
const buildEndpoint = require('../utils/buildEndpoint').buildEndpoint;
const GameAccount = require('../models/gameAccount');
const evaluateMetricForCategory = require('../utils/evaluateMetricForCategory');

async function createCategoryMetric(data) {
  const { 
    category, 
    metricName, 
    metricPath, 
    customizationOptions,
    logicType,
    groupBy,
    playerUnique,
    separatorPath
  } = data;

  const existingMetric = await CategoryMetric.findOne({ category, metricName });
  if (existingMetric) {
    const err = new Error('Category metric already exists');
    err.statusCode = 400;
    throw err;
  }

  const newMetric = new CategoryMetric({
    category,
    metricName,
    metricPath,
    customizationOptions,
    logicType: logicType || 'none',
    groupBy,
    playerUnique: playerUnique || false,
    separatorPath
  });
  await newMetric.save();

  return { message: 'Category metric created successfully', metric: newMetric };
}

async function getAllCategoryMetrics() {
  return CategoryMetric.find().populate('category', 'name endpoint headers parameters');
}

async function updateCategoryMetric(metricId, data) {
  const { 
    category, 
    metricName, 
    metricPath, 
    customizationOptions,
    logicType,
    groupBy,
    playerUnique,
    separatorPath
  } = data;

  const metric = await CategoryMetric.findById(metricId);
  if (!metric) {
    const err = new Error('Category metric not found');
    err.statusCode = 404;
    throw err;
  }

  metric.category = category ?? metric.category;
  metric.metricName = metricName ?? metric.metricName;
  metric.metricPath = metricPath ?? metric.metricPath;
  metric.customizationOptions = customizationOptions ?? metric.customizationOptions;
  metric.logicType = logicType ?? metric.logicType;
  metric.groupBy = groupBy ?? metric.groupBy;
  metric.playerUnique = playerUnique ?? metric.playerUnique;
  metric.separatorPath = separatorPath ?? metric.separatorPath;

  await metric.save();
  return { message: 'Category metric updated successfully', metric };
}

async function deleteCategoryMetric(metricId) {
  const metric = await CategoryMetric.findById(metricId);
  if (!metric) {
    const err = new Error('Category metric not found');
    err.statusCode = 404;
    throw err;
  }
  await metric.deleteOne();
  return { message: 'Category metric deleted successfully' };
}

async function getCategoryMetricsByCategory(categoryId) {
  return CategoryMetric.find({ category: categoryId });
}

async function getCategoryMetricById(metricId) {
  const metric = await CategoryMetric.findById(metricId);
  if (!metric) {
    const err = new Error('Category metric not found');
    err.statusCode = 404;
    throw err;
  }
  return metric;
}

// Initialize metrics from external API structure
async function initializeCategoryMetrics({ categoryId, depth = 4, parameters = {} }) {
  const category = await Category.findById(categoryId);
  if (!category) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }

  // validate parameters
  category.parameters.forEach(p => {
    if (!parameters[p.name]) {
      throw new Error(`Missing value for parameter: ${p.name}`);
    }
  });

  const finalEndpoint = buildEndpoint(category.endpoint, category.parameters, parameters);

  const { data } = await axios.get(finalEndpoint, {
    headers: category.headers || {}
  });

  const root = Array.isArray(data.data) && data.data.length > 0 ? data.data[0] : data;
  const paths = extractMetricPaths(root, '', depth);

  for (const path of paths) {
    await CategoryMetric.create({
      category: category._id,
      metricName: path.split('.').pop(),
      metricPath: path,
      logicType: 'none' // default for auto-initialized metrics
    });
  }

  return {
    message: 'Metrics initialized successfully',
    totalMetrics: paths.length,
    endpointUsed: finalEndpoint
  };
}

// Evaluate arbitrary metric payload with logicType
async function evaluateMetric({ data, metricId }) {
  const metric = await CategoryMetric.findById(metricId);
  if (!metric) {
    const err = new Error('Metric not found');
    err.statusCode = 404;
    throw err;
  }

  const func = metricLogic[metric.logicType];
  if (!func) {
    const err = new Error('Invalid logic type');
    err.statusCode = 400;
    throw err;
  }

  let result;
  if (metric.groupBy) {
    result = groupByMetric(
      data,
      metric.metricPath,
      metric.groupBy,
      metric.logicType
    );
  } else {
    result = func(data, metric.metricPath);
  }

  return {
    metric: metric.metricName,
    path: metric.metricPath,
    logic: metric.logicType,
    groupBy: metric.groupBy || null,
    value: result
  };
}

// Get a metric value for a user (using game account + API)
async function getMetricForUser({ metricId, userId }) {
  const metric = await CategoryMetric.findById(metricId).populate('category');
  if (!metric) {
    const err = new Error('Metric not found');
    err.statusCode = 404;
    throw err;
  }

  const category = metric.category;
  if (!category) {
    const err = new Error('Metric has no category populated');
    err.statusCode = 500;
    throw err;
  }

  const gameId = category.game;
  if (!gameId) {
    const err = new Error('Category has no game associated');
    err.statusCode = 500;
    throw err;
  }

  const gameAccount = await GameAccount.findOne({ user: userId, game: gameId });
  if (!gameAccount) {
    const err = new Error('GameAccount for user and game not found');
    err.statusCode = 404;
    throw err;
  }

  const puuid = gameAccount.puuid;
  if (!puuid) {
    const err = new Error('GameAccount has no puuid set');
    err.statusCode = 400;
    throw err;
  }

  const paramValues = {};
  if (Array.isArray(category.parameters)) {
    for (const p of category.parameters) {
      if (!p || !p.name) continue;
      const key = p.name;
      if (key === 'puuid') paramValues[key] = gameAccount.puuid;
      else if (key === 'region') paramValues[key] = gameAccount.region;
      else if (key === 'name') paramValues[key] = gameAccount.name;
      else if (key === 'tag') paramValues[key] = gameAccount.tag;
    }
  }

  const result = await evaluateMetricForCategory({
    category,
    metric,
    paramValues,
    identifierForPlayer: puuid
  });

  return {
    metricId,
    userId,
    value: result.value,
    calledUrl: result.calledUrl
  };
}

module.exports = {
  createCategoryMetric,
  getAllCategoryMetrics,
  updateCategoryMetric,
  deleteCategoryMetric,
  getCategoryMetricsByCategory,
  getCategoryMetricById,
  initializeCategoryMetrics,
  evaluateMetric,
  getMetricForUser
};
