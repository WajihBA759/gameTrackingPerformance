const CategoryMetric=require('../models/categoryMetric');
const { groupByMetric } = require('../utils/groupByMetric');
const axios = require('axios');
const Category = require('../models/category');
const extractMetricPaths = require('../utils/extractMetricPaths');
const metricLogic = require('../utils/metricLogic');
const  buildEndpoint  = require('../utils/buildEndpoint').buildEndpoint;

exports.createCategoryMetric=async(req,res)=>{
    const { category, metricName, metricPath, customizationOptions } = req.body;
    try {
        const existingMetric = await CategoryMetric.findOne({ category, metricName });
        if (existingMetric) {
            return res.status(400).json({ message: 'Category metric already exists' });
        }
        const newMetric = new CategoryMetric({ category, metricName, metricPath, customizationOptions });
        await newMetric.save();
        res.status(201).json({ message: 'Category metric created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllCategoryMetrics=async(req,res)=>{
    try {
        const metrics = await CategoryMetric.find().populate('category','name endpoint headers parameters');
        res.status(200).json(metrics);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateCategoryMetric=async(req,res)=>{
    const { metricId } = req.params;
    const { category, metricName, metricPath, customizationOptions } = req.body;
    try {
        const metric = await CategoryMetric.findById(metricId);
        if (!metric) {
            return res.status(404).json({ message: 'Category metric not found' });
        }
        metric.category = category;
        metric.metricName = metricName;
        metric.metricPath = metricPath;
        metric.customizationOptions = customizationOptions;
        await metric.save();
        res.status(200).json({ message: 'Category metric updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteCategoryMetric=async(req,res)=>{
    const { metricId } = req.params;
    try {
        const metric = await CategoryMetric.findById(metricId);
        if (!metric) {
            return res.status(404).json({ message: 'Category metric not found' });
        }
        await metric.remove();
        res.status(200).json({ message: 'Category metric deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCategoryMetricsByCategory=async(req,res)=>{
    const { categoryId } = req.params;
    try {
        const metrics = await CategoryMetric.find({ category: categoryId });
        res.status(200).json(metrics);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCategoryMetricById=async(req,res)=>{
    const { metricId } = req.params;
    try {
        const metric = await CategoryMetric.findById(metricId);
        if (!metric) {
            return res.status(404).json({ message: 'Category metric not found' });
        }
        res.status(200).json(metric);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
// New function to initialize category metrics based on data structure

exports.initializeCategoryMetrics = async (req, res) => {
  const { categoryId, depth = 4, parameters = {} } = req.body;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // category.parameters = [ {name: "..."} ]
    // parameters = { paramName: value }

    const valuesInOrder = category.parameters.map(p => {
      console.log('Mapping parameter:', p.name);
      if (!parameters[p.name]) {
        throw new Error(`Missing value for parameter: ${p.name}`);
      }
      return parameters[p.name];
    });
    console.log('Values in order:', valuesInOrder);

    // Build real endpoint
    const finalEndpoint = buildEndpoint(
      category.endpoint,
      category.parameters,
      parameters //testing if valuesInOrder is needed or parameters object works
    );

    // Call external API
    const { data } = await axios.get(finalEndpoint, {
      headers: category.headers || {}
    });

    // extract metric paths
    const paths = extractMetricPaths(data, '', depth);

    for (const path of paths) {
      await CategoryMetric.create({
        category: category._id,
        metricName: path.split('.').pop(),
        metricPath: path
      });
    }

    res.status(200).json({
      message: "Metrics initialized successfully",
      totalMetrics: paths.length,
      endpointUsed: finalEndpoint
    });

  } catch (error) {
    console.error("Error initializing metrics:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// New function to evaluate a metric based on its logic type


exports.evaluateMetric = async (req, res) => {
  const { data, metricId } = req.body;

  try {
    const metric = await CategoryMetric.findById(metricId);
    if (!metric) return res.status(404).json({ message: 'Metric not found' });

    const func = metricLogic[metric.logicType];
    if (!func) return res.status(400).json({ message: 'Invalid logic type' });

    let result;

    //If the metric has a groupBy field → use groupByMetric
    if (metric.groupBy) {
      result = groupByMetric(
        data,
        metric.metricPath,
        metric.groupBy,
        metric.logicType
      );
    } else {
      //Otherwise, use normal metric logic
      result = func(data, metric.metricPath);
    }

    res.status(200).json({
      metric: metric.metricName,
      path: metric.metricPath,
      logic: metric.logicType,
      groupBy: metric.groupBy || null,
      value: result
    });
  } catch (err) {
    console.error('Error evaluating metric:', err);
    res.status(500).json({ message: 'Error evaluating metric' });
  }
};
