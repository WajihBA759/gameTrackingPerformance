const CategoryMetric=require('../models/categoryMetric');
const { groupByMetric } = require('../utils/groupByMetric');
const axios = require('axios');
const Category = require('../models/category');
const extractMetricPaths = require('../utils/extractMetricPaths');
const metricLogic = require('../utils/metricLogic');
const  buildEndpoint  = require('../utils/buildEndpoint').buildEndpoint;
const GameAccount= require('../models/gameAccount');
const evaluateMetricForCategory= require('../utils/evaluateMetricForCategory');

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
      parameters
    );

    // Call external API
    const { data } = await axios.get(finalEndpoint, {
      headers: category.headers || {}
    });

    // Use first element of data.data as the root for path extraction
    // This way paths will be relative to a single match (e.g. "players.all_players.stats.kills")
    const root = Array.isArray(data.data) && data.data.length > 0 ? data.data[0] : data;

    // extract metric paths from the root object
    const paths = extractMetricPaths(root, '', depth);

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
// getting a specefic metric value for a given user identifier 
// since we re gonna force the user s hand here we re gonna set it by default the puuid
exports.getMetricForUser = async (req, res) => {
try {
const { metricId, userId } = req.params;
//Load metric and its category
const metric = await CategoryMetric.findById(metricId).populate('category');
if (!metric) {
  return res.status(404).json({ message: 'Metric not found' });
}

const category = metric.category;
if (!category) {
  return res.status(500).json({ message: 'Metric has no category populated' });
}

//Find the user's game account for this category's game
const gameId = category.game;
if (!gameId) {
  return res.status(500).json({ message: 'Category has no game associated' });
}

const gameAccount = await GameAccount.findOne({ user: userId, game: gameId });
if (!gameAccount) {
  return res.status(404).json({ message: 'GameAccount for user and game not found' });
}

const puuid = gameAccount.puuid;
if (!puuid) {
  return res.status(400).json({ message: 'GameAccount has no puuid set' });
}

//Build param values object for the endpoint
//Category.parameters is expected to be [{ name: "region" }, { name: "puuid" }, ...]
const paramValues = {};
if (Array.isArray(category.parameters)) {
  for (const p of category.parameters) {
    if (!p || !p.name) continue;
    const key = p.name;
    // Map from gameAccount fields: puuid, region, name, tag
    if (key === 'puuid') paramValues[key] = gameAccount.puuid;
    else if (key === 'region') paramValues[key] = gameAccount.region;
    else if (key === 'name') paramValues[key] = gameAccount.name;
    else if (key === 'tag') paramValues[key] = gameAccount.tag;
    // if there are other params, you can extend this mapping later
  }
}

//Evaluate the metric for this user
const result = await evaluateMetricForCategory({
  category,
  metric,
  paramValues,
  identifierForPlayer: puuid, // used when metric.groupBy + metric.playerUnique
});

// result: { value, calledUrl, rawDataSample: undefined }
return res.status(200).json({
  metricId,
  userId,
  value: result.value,
  calledUrl: result.calledUrl,
});
} catch (err) {
console.error('getMetricForUser error', err);
return res.status(500).json({ message: 'Server error', error: err.message });
}
};
