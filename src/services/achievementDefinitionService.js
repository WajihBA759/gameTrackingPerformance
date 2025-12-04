// services/achievementDefinitionService.js
const AchievementDefinition = require('../models/achievementDefinition');
const PlayerAchievement = require('../models/playerAchievement');

// Create new achievement definition
async function createAchievementDefinition(data) {
  const {
    name,
    description,
    points,
    isActive,
    expirationDate,
    requiredAmount,
    categoryMetric
  } = data;

  const existingAchievement = await AchievementDefinition.findOne({ name });
  if (existingAchievement) {
    const err = new Error('Achievement definition already exists');
    err.statusCode = 400;
    throw err;
  }

  const newAchievement = new AchievementDefinition({
    name,
    description,
    points,
    isActive,
    expirationDate,
    requiredAmount,
    categoryMetric
  });

  await newAchievement.save();
  return newAchievement;
}

// Get all definitions
async function getAllAchievementDefinitions() {
  return AchievementDefinition.find();
}

// Update one definition
async function updateAchievementDefinition(achievementId, data) {
  const {
    name,
    description,
    points,
    isActive,
    expirationDate,
    requiredAmount,
    categoryMetric
  } = data;

  const achievement = await AchievementDefinition.findById(achievementId);
  if (!achievement) {
    const err = new Error('Achievement definition not found');
    err.statusCode = 404;
    throw err;
  }

  achievement.name = name ?? achievement.name;
  achievement.description = description ?? achievement.description;
  achievement.points = points ?? achievement.points;
  achievement.isActive = isActive ?? achievement.isActive;
  achievement.expirationDate = expirationDate ?? achievement.expirationDate;
  achievement.requiredAmount = requiredAmount ?? achievement.requiredAmount;
  achievement.categoryMetric = categoryMetric ?? achievement.categoryMetric;

  await achievement.save();
  return achievement;
}

// Delete definition + related player achievements
async function deleteAchievementDefinition(achievementId) {
  const deletedPlayerAchievements = await PlayerAchievement.deleteMany({
    achievementDefinition: achievementId
  });

  const achievement = await AchievementDefinition.findByIdAndDelete(achievementId);
  if (!achievement) {
    const err = new Error('Achievement definition not found');
    err.statusCode = 404;
    throw err;
  }

  return {
    message: 'Achievement definition deleted successfully',
    achievement,
    deletedPlayerAchievements
  };
}
async function getAchievementDefinitionById(achievementId) {
  const achievement = await AchievementDefinition.findById(achievementId);
  if (!achievement) {
    const err = new Error('Achievement definition not found');
    err.statusCode = 404;
    throw err;
  }
  return achievement;
}
// Get achievement definitions by category (via metrics)
async function getAchievementDefinitionsByCategory(categoryId) {
  const CategoryMetric = require('../models/categoryMetric');
  
  const metrics = await CategoryMetric.find({ category: categoryId });
  const metricIds = metrics.map(m => m._id);
  
  return AchievementDefinition.find({
    categoryMetric: { $in: metricIds }
  }).populate('categoryMetric', 'metricName metricPath');
}





module.exports = {
  createAchievementDefinition,
  getAllAchievementDefinitions,
  updateAchievementDefinition,
  deleteAchievementDefinition,
  getAchievementDefinitionById,
  getAchievementDefinitionsByCategory
};
