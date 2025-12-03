const AchievementDefinition = require('../models/achievementDefinition');
const PlayerAchievement = require('../models/playerAchievement');

exports.createAchievementDefinition = async (req, res) => {
  // Read ALL required fields from body
  const {
    name,
    description,
    points,
    isActive,
    expirationDate,
    requiredAmount,
    categoryMetric
  } = req.body;

  try {
    const existingAchievement = await AchievementDefinition.findOne({ name });
    if (existingAchievement) {
      return res.status(400).json({ message: 'Achievement definition already exists' });
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
    return res.status(201).json(newAchievement);
  } catch (error) {
    console.error('createAchievementDefinition error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllAchievementDefinitions = async (req, res) => {
  try {
    const achievements = await AchievementDefinition.find();
    res.status(200).json(achievements);
  } catch (error) {
    console.error('getAllAchievementDefinitions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateAchievementDefinition = async (req, res) => {
  const { achievementId } = req.params;
  const {
    name,
    description,
    points,
    isActive,
    expirationDate,
    requiredAmount,
    categoryMetric
  } = req.body;

  try {
    const achievement = await AchievementDefinition.findById(achievementId);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement definition not found' });
    }

    achievement.name = name ?? achievement.name;
    achievement.description = description ?? achievement.description;
    achievement.points = points ?? achievement.points;
    achievement.isActive = isActive ?? achievement.isActive;
    achievement.expirationDate = expirationDate ?? achievement.expirationDate;
    achievement.requiredAmount = requiredAmount ?? achievement.requiredAmount;
    achievement.categoryMetric = categoryMetric ?? achievement.categoryMetric;

    await achievement.save();
    res.status(200).json(achievement);
  } catch (error) {
    console.error('updateAchievementDefinition error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteAchievementDefinition = async (req, res) => {
  const { achievementId } = req.params;
  try {
    const deletedPlayerAchievements = await PlayerAchievement.deleteMany({ achievementDefinition: achievementId });
    const achievement = await AchievementDefinition.findByIdAndDelete(achievementId);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement definition not found' });
    }
    res.status(200).json({
      message: 'Achievement definition deleted successfully',
      achievement,
      deletedPlayerAchievements
    });
  } catch (error) {
    console.error('deleteAchievementDefinition error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
