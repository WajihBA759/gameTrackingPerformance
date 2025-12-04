// services/completedAchievementService.js
const CompletedAchievement = require('../models/completedAchievement');

async function getCompletedAchievementsByGameAccount(gameAccountId) {
  return CompletedAchievement.find({ gameAccount: gameAccountId });
}

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

module.exports = {
  getCompletedAchievementsByGameAccount,
  getAllCompletedAchievements,
  getCompletedAchievementById,
  createCompletedAchievement,
  deleteCompletedAchievement,
  updateCompletedAchievement
};
