// controllers/categoryMetricController.js
const categoryMetricService = require('../services/categoryMetricService');

exports.createCategoryMetric = async (req, res) => {
  try {
    const result = await categoryMetricService.createCategoryMetric(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('createCategoryMetric error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: 'Server error', error: error.message });
  }
};

exports.getAllCategoryMetrics = async (req, res) => {
  try {
    const metrics = await categoryMetricService.getAllCategoryMetrics();
    res.status(200).json(metrics);
  } catch (error) {
    console.error('getAllCategoryMetrics error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: 'Server error', error: error.message });
  }
};

exports.updateCategoryMetric = async (req, res) => {
  try {
    const { metricId } = req.params;
    const result = await categoryMetricService.updateCategoryMetric(metricId, req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('updateCategoryMetric error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: 'Server error', error: error.message });
  }
};

exports.deleteCategoryMetric = async (req, res) => {
  try {
    const { metricId } = req.params;
    const result = await categoryMetricService.deleteCategoryMetric(metricId);
    res.status(200).json(result);
  } catch (error) {
    console.error('deleteCategoryMetric error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: 'Server error', error: error.message });
  }
};

exports.getCategoryMetricsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const metrics = await categoryMetricService.getCategoryMetricsByCategory(categoryId);
    res.status(200).json(metrics);
  } catch (error) {
    console.error('getCategoryMetricsByCategory error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: 'Server error', error: error.message });
  }
};

exports.getCategoryMetricById = async (req, res) => {
  try {
    const { metricId } = req.params;
    const metric = await categoryMetricService.getCategoryMetricById(metricId);
    res.status(200).json(metric);
  } catch (error) {
    console.error('getCategoryMetricById error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: 'Server error', error: error.message });
  }
};

exports.initializeCategoryMetrics = async (req, res) => {
  try {
    const result = await categoryMetricService.initializeCategoryMetrics(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('initializeCategoryMetrics error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: 'Server error', error: error.message });
  }
};

exports.evaluateMetric = async (req, res) => {
  try {
    const result = await categoryMetricService.evaluateMetric(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('evaluateMetric error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: 'Error evaluating metric', error: error.message });
  }
};

exports.getMetricForUser = async (req, res) => {
  try {
    const { metricId, userId } = req.params;
    const result = await categoryMetricService.getMetricForUser({ metricId, userId });
    res.status(200).json(result);
  } catch (error) {
    console.error('getMetricForUser error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: 'Server error', error: error.message });
  }
};
