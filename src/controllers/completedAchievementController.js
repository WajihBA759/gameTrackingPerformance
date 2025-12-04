// controllers/completedAchievementController.js
const completedAchievementService = require('../services/completedAchievementService');

exports.getCompletedAchievementsByGameAccount = async (req, res) => {
  try {
    const { gameAccountId } = req.params;
    const completed = await completedAchievementService.getCompletedAchievementsByGameAccount(
      gameAccountId
    );
    res.status(200).send(completed);
  } catch (error) {
    console.error('getCompletedAchievementsByGameAccount error:', error);
    res
      .status(error.statusCode || 500)
      .send({ message: 'Server error', error: error.message });
  }
};

exports.getAllCompletedAchievements = async (req, res) => {
  try {
    const completed = await completedAchievementService.getAllCompletedAchievements();
    res.status(200).send(completed);
  } catch (error) {
    console.error('getAllCompletedAchievements error:', error);
    res
      .status(error.statusCode || 500)
      .send({ message: 'Server error', error: error.message });
  }
};

exports.getCompletedAchievementById = async (req, res) => {
  try {
    const { id } = req.params;
    const completed = await completedAchievementService.getCompletedAchievementById(id);
    res.status(200).send(completed);
  } catch (error) {
    console.error('getCompletedAchievementById error:', error);
    res
      .status(error.statusCode || 500)
      .send({ message: 'Server error', error: error.message });
  }
};

exports.createCompletedAchievement = async (req, res) => {
  try {
    const completed = await completedAchievementService.createCompletedAchievement(req.body);
    res.status(200).send(completed);
  } catch (error) {
    console.error('createCompletedAchievement error:', error);
    res
      .status(error.statusCode || 500)
      .send({ message: 'Server error', error: error.message });
  }
};

exports.deleteCompletedAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await completedAchievementService.deleteCompletedAchievement(id);
    res.status(200).send(result);
  } catch (error) {
    console.error('deleteCompletedAchievement error:', error);
    res
      .status(error.statusCode || 500)
      .send({ message: 'Server error', error: error.message });
  }
};

exports.updateCompletedAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await completedAchievementService.updateCompletedAchievement(id, req.body);
    res.status(200).send(updated);
  } catch (error) {
    console.error('updateCompletedAchievement error:', error);
    res
      .status(error.statusCode || 500)
      .send({ message: 'Server error', error: error.message });
  }
};
// controllers/completedAchievementController.js

exports.getCompletedAchievementsByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const achievements = await completedAchievementService.getCompletedAchievementsByUsername(username);
    res.status(200).json(achievements);
  } catch (error) {
    console.error('getCompletedAchievementsByUsername error:', error);
    res.status(error.statusCode || 500).json({ message: 'Server error', error: error.message });
  }
};

exports.getCompletedAchievementsByGameAccount = async (req, res) => {
  try {
    const { gameAccountId } = req.params;
    const achievements = await completedAchievementService.getCompletedAchievementsByGameAccount(gameAccountId);
    res.status(200).json(achievements);
  } catch (error) {
    console.error('getCompletedAchievementsByGameAccount error:', error);
    res.status(error.statusCode || 500).json({ message: 'Server error', error: error.message });
  }
};

