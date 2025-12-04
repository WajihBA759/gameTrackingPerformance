// src/controllers/playerAchievementController.js
const playerAchievementService = require('../services/playerAchievementService');

exports.getPlayerAchievementsByGameAccount = async (req, res) => {
  try {
    const { gameAccountId } = req.params;
    const achievements =
      await playerAchievementService.getPlayerAchievementsByGameAccount(gameAccountId);
    res.status(200).send(achievements);
  } catch (error) {
    console.error('getPlayerAchievementsByGameAccount error:', error);
    res.status(error.statusCode || 500).send({ message: 'Server error', error: error.message });
  }
};

exports.getAllPlayerAchievements = async (req, res) => {
  try {
    const achievements = await playerAchievementService.getAllPlayerAchievements();
    res.status(200).send(achievements);
  } catch (error) {
    console.error('getAllPlayerAchievements error:', error);
    res.status(error.statusCode || 500).send({ message: 'Server error', error: error.message });
  }
};

exports.updatePlayerAchievementProgress = async (req, res) => {
  try {
    const { achievementId } = req.params;
    const { progressIncrement } = req.body;
    const achievement = await playerAchievementService.updatePlayerAchievementProgress(
      achievementId,
      progressIncrement
    );
    res.status(200).send(achievement);
  } catch (error) {
    console.error('updatePlayerAchievementProgress error:', error);
    res.status(error.statusCode || 500).send({ message: 'Server error', error: error.message });
  }
};

exports.createPlayerAchievement = async (req, res) => {
  try {
    const { gameAccountId, achievementDefinitionId } = req.body;
    const achievement = await playerAchievementService.createPlayerAchievement({
      gameAccountId,
      achievementDefinitionId
    });
    res.status(200).send(achievement);
  } catch (error) {
    console.error('createPlayerAchievement error:', error);
    res.status(error.statusCode || 500).send({ message: 'Server error', error: error.message });
  }
};

exports.deletePlayerAchievement = async (req, res) => {
  try {
    const { achievementId } = req.params;
    const result = await playerAchievementService.deletePlayerAchievement(achievementId);
    res.status(200).send(result);
  } catch (error) {
    console.error('deletePlayerAchievement error:', error);
    res.status(error.statusCode || 500).send({ message: 'Server error', error: error.message });
  }
};

exports.getPlayerAchievementById = async (req, res) => {
  try {
    const { id } = req.params;
    const achievement = await playerAchievementService.getPlayerAchievementById(id);
    res.status(200).send(achievement);
  } catch (error) {
    console.error('getPlayerAchievementById error:', error);
    res.status(error.statusCode || 500).send({ message: 'Server error', error: error.message });
  }
};

//new logic is gonna be counting the sum of non counted matchIds or in the scalable domain metricSperator
//----------------------------------------------------------------------------------------------------------------
exports.refreshAchievementProgress = async (req, res) => {
  try {
    const { achievementId } = req.params;
    const result = await playerAchievementService.refreshAchievementProgress(achievementId);
    return res.status(200).json(result);
  } catch (err) {
    console.error('refreshAchievementProgress error', err);
    return res.status(err.statusCode || 500).json({
      message: err.statusCode ? err.message : 'Server error',
      error: err.message
    });
  }
};
exports.refreshAllAchievementsForGameAccount = async (req, res) => {
  try {
    const { gameAccountId } = req.params;
    const result = await playerAchievementService.refreshAllAchievementsForGameAccount(gameAccountId);
    return res.status(200).json(result);
  } catch (err) {
    console.error('refreshAllAchievementsForGameAccount error', err);
    return res.status(err.statusCode || 500).json({
      message: err.statusCode ? err.message : 'Server error',
      error: err.message
    });
  }
};
// In playerAchievementController.js
exports.getPlayerAchievementsByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const User = require('../models/user');
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const GameAccount = require('../models/gameAccount');
    const gameAccounts = await GameAccount.find({ user: user._id });
    const gameAccountIds = gameAccounts.map(ga => ga._id);
    
    const achievements = await playerAchievementService.getPlayerAchievementsByGameAccounts(gameAccountIds);
    res.status(200).send(achievements);
  } catch (error) {
    console.error('getPlayerAchievementsByUsername error:', error);
    res.status(error.statusCode || 500).send({ message: 'Server error', error: error.message });
  }
};


