// services/completedAchievementService.js
const CompletedAchievement = require('../models/completedAchievement');
const GameAccount = require('../models/gameAccount');
const User = require('../models/user');

async function getAllCompletedAchievements() {
  return CompletedAchievement.find();
}

async function getCompletedAchievementById(id) {
  const completedAchievement = await CompletedAchievement.findById(id);
  if (!completedAchievement) {
    const err = new Error('Completed achievement not found');
    err.statusCode = 404;
    throw err;
  }
  return completedAchievement;
}

async function createCompletedAchievement({ gameAccountId, title, rewardPoints }) {
  const newCompletedAchievement = new CompletedAchievement({
    gameAccount: gameAccountId,
    title,
    rewardPoints
  });
  await newCompletedAchievement.save();
  return newCompletedAchievement;
}

async function deleteCompletedAchievement(id) {
  const deletedAchievement = await CompletedAchievement.findByIdAndDelete(id);
  if (!deletedAchievement) {
    const err = new Error('Completed achievement not found');
    err.statusCode = 404;
    throw err;
  }
  return { message: 'Completed achievement deleted successfully' };
}

async function updateCompletedAchievement(id, { title, rewardPoints }) {
  const updatedAchievement = await CompletedAchievement.findByIdAndUpdate(
    id,
    { title, rewardPoints },
    { new: true }
  );
  if (!updatedAchievement) {
    const err = new Error('Completed achievement not found');
    err.statusCode = 404;
    throw err;
  }
  return updatedAchievement;
}
async function getCompletedAchievementsByUsername(username) {
  // Find user by username
  const user = await User.findOne({ username });
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  // Find all game accounts for this user
  const gameAccounts = await GameAccount.find({ user: user._id });
  const gameAccountIds = gameAccounts.map(ga => ga._id);

  // Find all completed achievements for these game accounts
  const achievements = await CompletedAchievement.find({
    gameAccount: { $in: gameAccountIds }
  }).populate('gameAccount', 'name region game');

  return achievements;
}

async function getCompletedAchievementsByGameAccount(gameAccountId) {
  const gameAccount = await GameAccount.findById(gameAccountId);
  if (!gameAccount) {
    const err = new Error('Game account not found');
    err.statusCode = 404;
    throw err;
  }

  const achievements = await CompletedAchievement.find({
    gameAccount: gameAccountId
  }).populate('gameAccount', 'name region game');

  return achievements;
}

module.exports = {
  getCompletedAchievementsByGameAccount,
  getAllCompletedAchievements,
  getCompletedAchievementById,
  createCompletedAchievement,
  deleteCompletedAchievement,
  updateCompletedAchievement,
  getCompletedAchievementsByUsername
};
