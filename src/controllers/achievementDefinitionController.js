const achievementDefinitionService = require('../services/achievementDefinitionService');

exports.createAchievementDefinition = async (req, res) => {
  try {
    const achievement = await achievementDefinitionService.createAchievementDefinition(req.body);
    res.status(201).json(achievement);
  } catch (error) {
    console.error('createAchievementDefinition error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: 'Server error', error: error.message });
  }
};

exports.getAllAchievementDefinitions = async (req, res) => {
  try {
    const achievements = await achievementDefinitionService.getAllAchievementDefinitions();
    res.status(200).json(achievements);
  } catch (error) {
    console.error('getAllAchievementDefinitions error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: 'Server error', error: error.message });
  }
};

exports.updateAchievementDefinition = async (req, res) => {
  try {
    const { achievementId } = req.params;
    const achievement = await achievementDefinitionService.updateAchievementDefinition(
      achievementId,
      req.body
    );
    res.status(200).json(achievement);
  } catch (error) {
    console.error('updateAchievementDefinition error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: 'Server error', error: error.message });
  }
};

exports.deleteAchievementDefinition = async (req, res) => {
  try {
    const { achievementId } = req.params;
    const result = await achievementDefinitionService.deleteAchievementDefinition(achievementId);
    res.status(200).json(result);
  } catch (error) {
    console.error('deleteAchievementDefinition error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: 'Server error', error: error.message });
  }
};
exports.getAchievementDefinitionById = async (req, res) => {
  try {
    const { achievementId } = req.params;
    const achievement = await achievementDefinitionService.getAchievementDefinitionById(achievementId);
    res.status(200).json(achievement);
  } catch (error) {
    console.error('getAchievementDefinitionById error:', error);
    res.status(error.statusCode || 500).json({ message: 'Server error', error: error.message });
  }
};
exports.getAchievementDefinitionsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const achievements = await achievementDefinitionService.getAchievementDefinitionsByCategory(categoryId);
    res.status(200).json(achievements);
  } catch (error) {
    console.error('getAchievementDefinitionsByCategory error:', error);
    res.status(error.statusCode || 500).json({ message: 'Server error', error: error.message });
  }
};


