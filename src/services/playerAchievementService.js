const PlayerAchievement = require('../models/playerAchievement');
const AchievementDefinition = require('../models/achievementDefinition');
const CompletedAchievement = require('../models/completedAchievement');
const GameAccount = require('../models/gameAccount');
const buildEndpoint = require('../utils/buildEndpoint').buildEndpoint;
const axios = require('axios');
const getValueAtPath = require('../utils/getValueAtPath');

async function getPlayerAchievementsByGameAccount(gameAccountId) {
  return PlayerAchievement.find({ gameAccount: gameAccountId });
}

async function getAllPlayerAchievements() {
  return PlayerAchievement.find();
}

async function updatePlayerAchievementProgress(achievementId, progressIncrement) {
  const achievement = await PlayerAchievement.findById(achievementId);
  if (!achievement) {
    const err = new Error('Achievement not found');
    err.statusCode = 404;
    throw err;
  }
  if (achievement.status === 'completed') {
    const err = new Error('Achievement already completed');
    err.statusCode = 400;
    throw err;
  }

  achievement.progress += progressIncrement;

  if (achievement.progress >= achievement.requiredAmount) {
    achievement.status = 'completed';
    achievement.completedAt = new Date();
    // Create a record in CompletedAchievement
    const completedAchievement = new CompletedAchievement({
      gameAccount: achievement.gameAccount, //change to game Account here and in the model
      title: achievement.name,
      rewardPoints: achievement.points
    });
    await completedAchievement.save();
  }

  await achievement.save();
  return achievement;
}

// Create PlayerAchievement and snapshot existing matches as countedSeparators
async function createPlayerAchievement({ gameAccountId, achievementDefinitionId }) {
  // 1) Load definition and its metric + category
  const achievementDef = await AchievementDefinition.findById(achievementDefinitionId)
    .populate({
      path: 'categoryMetric',
      populate: { path: 'category' }
    });

  if (!achievementDef) {
    const err = new Error('Achievement definition not found');
    err.statusCode = 404;
    throw err;
  }

  const metric = achievementDef.categoryMetric;
  if (!metric || !metric.category) {
    const err = new Error('Achievement definition has no valid categoryMetric/category');
    err.statusCode = 500;
    throw err;
  }

  const category = metric.category;

  // 2) Load gameAccount (for region/name/tag/puuid)
  const gameAccount = await GameAccount.findById(gameAccountId);
  if (!gameAccount) {
    const err = new Error('GameAccount not found');
    err.statusCode = 404;
    throw err;
  }

  // 3) Build params for Henrik endpoint
  const paramValues = {};
  if (Array.isArray(category.parameters)) {
    for (const p of category.parameters) {
      if (!p || !p.name) continue;
      const key = p.name;
      if (key === 'puuid') paramValues[key] = gameAccount.puuid;
      else if (key === 'region') paramValues[key] = gameAccount.region;
      else if (key === 'name') paramValues[key] = gameAccount.name;
      else if (key === 'tag') paramValues[key] = gameAccount.tag;
    }
  }

  // 4) Call matches endpoint ONCE to snapshot current matches
  const finalUrl = buildEndpoint(category.endpoint, category.parameters || [], paramValues || {});
  const { data } = await axios.get(finalUrl, { headers: category.headers || {} });
  const matches = Array.isArray(data.data) ? data.data : [];

  // 5) Extract current separators (e.g. metadata.matchid) so they are "already counted"
  const separatorPath = metric.separatorPath; // "metadata.matchid"
  const initialSeparators = [];

  if (separatorPath) {
    for (const match of matches) {
      const sep = separatorPath
        .split('.')
        .reduce((cur, key) => (cur ? cur[key] : undefined), match);
      if (sep) initialSeparators.push(sep);
    }
  }

  // 6) Create PlayerAchievement with countedSeparators pre-filled
  const newPlayerAchievement = new PlayerAchievement({
    gameAccount: gameAccountId,
    achievementDefinition: achievementDef._id,
    categoryMetric: metric._id,
    name: achievementDef.name,
    description: achievementDef.description,
    points: achievementDef.points,
    requiredAmount: achievementDef.requiredAmount,
    progress: 0,
    countedSeparators: initialSeparators // all existing matches are considered "old"
  });

  await newPlayerAchievement.save();
  return newPlayerAchievement;
}

async function deletePlayerAchievement(achievementId) {
  const achievement = await PlayerAchievement.findByIdAndDelete(achievementId);
  if (!achievement) {
    const err = new Error('Achievement not found');
    err.statusCode = 404;
    throw err;
  }
  return { message: 'Achievement deleted successfully' };
}

async function getPlayerAchievementById(id) {
  const achievement = await PlayerAchievement.findById(id);
  if (!achievement) {
    const err = new Error('Achievement not found');
    err.statusCode = 404;
    throw err;
  }
  return achievement;
}

// new logic is gonna be counting the sum of non counted matchIds or in the scalable domain metricSperator
//----------------------------------------------------------------------------------------------------------------

// Refresh progress of one PlayerAchievement by scanning recent matches
async function refreshAchievementProgress(achievementId) {
  // 1) Get achievement id from route: /player-achievements/:achievementId/refresh

  // 2) Load PlayerAchievement with its GameAccount and CategoryMetric (+ Category)
  const pa = await PlayerAchievement.findById(achievementId)
    .populate('gameAccount')
    .populate({
      path: 'categoryMetric',
      populate: { path: 'category' }
    });

  if (!pa) {
    const err = new Error('PlayerAchievement not found');
    err.statusCode = 404;
    throw err;
  }

  // If already completed, do nothing
  if (pa.status === 'completed') {
    const err = new Error('Achievement already completed');
    err.statusCode = 400;
    throw err;
  }

  const gameAccount = pa.gameAccount;
  const metric = pa.categoryMetric;
  const category = metric.category;

  if (!metric || !category) {
    const err = new Error('Metric or category not populated');
    err.statusCode = 500;
    throw err;
  }

  // 3) Ensure separatorPath exists (used to uniquely identify events/matches)
  // Example: "metadata.matchid"
  const separatorPath = metric.separatorPath;
  if (!separatorPath) {
    const err = new Error('separatorPath not configured for metric');
    err.statusCode = 500;
    throw err;
  }

  // 4) Build API parameter values from GameAccount (region, name, tag, puuid, etc.)
  const paramValues = {};
  if (Array.isArray(category.parameters)) {
    for (const p of category.parameters) {
      if (!p || !p.name) continue;
      const key = p.name;
      if (key === 'puuid') paramValues[key] = gameAccount.puuid;
      else if (key === 'region') paramValues[key] = gameAccount.region;
      else if (key === 'name') paramValues[key] = gameAccount.name;
      else if (key === 'tag') paramValues[key] = gameAccount.tag;
      // extend here if you add more fields
    }
  }

  // 5) Call external API (e.g. Henrik last matches endpoint)
  const finalUrl = buildEndpoint(category.endpoint, category.parameters || [], paramValues || {});
  const { data } = await axios.get(finalUrl, { headers: category.headers || {} });

  // For Henrik: data.data is the array of matches
  const matches = Array.isArray(data.data) ? data.data : [];

  // 6) For this refresh, track how much we add and which separators (e.g. matchids) we counted
  let added = 0;
  const newSeparators = [];

  for (const match of matches) {
    // 6.1) Get separator value for this match (e.g. match.metadata.matchid)
    const matchId = separatorPath
      .split('.')
      .reduce((cur, key) => (cur ? cur[key] : undefined), match);

    if (!matchId) continue;

    // Skip if this match was already counted before
    if (pa.countedSeparators && pa.countedSeparators.includes(matchId)) continue;

    // 6.2) Use generic metricPath / groupBy to find this player's value in this match
    // metric.metricPath might be "players.all_players.stats.kills"
    // metric.groupBy might be "players.all_players.puuid"
    const valueArray = getValueAtPath(match, metric.metricPath);
    const groupArray = getValueAtPath(match, metric.groupBy);

    if (!Array.isArray(valueArray) || !Array.isArray(groupArray)) continue;

    // Find the index where group key equals this player's puuid
    const idx = groupArray.indexOf(gameAccount.puuid);
    if (idx === -1) continue;

    const rawVal = valueArray[idx];

    // Support values that might be plain numbers or objects with a .value
    const numericVal =
      rawVal && typeof rawVal === 'object' && 'value' in rawVal
        ? (rawVal.value || 0)
        : (rawVal || 0);

    // Accumulate progress and mark this separator as counted
    added += numericVal;
    newSeparators.push(matchId);
  }

  // 7) Update progress: add new kills, cap at requiredAmount
  pa.progress = Math.min(pa.progress + added, pa.requiredAmount);

  // Ensure countedSeparators array exists
  if (!Array.isArray(pa.countedSeparators)) {
    pa.countedSeparators = [];
  }
  pa.countedSeparators.push(...newSeparators);

  // 8) If target reached, mark as completed and set timestamp
  if (pa.progress >= pa.requiredAmount) {
    pa.status = 'completed';
    pa.completedAt = new Date();
    // Here you can also create a CompletedAchievement record as you already do
  }

  // 9) Persist changes
  await pa.save();

  // 10) Respond with updated achievement and how much was added this refresh
  return {
    achievement: pa,
    added,               // how much progress was added in this refresh
    totalProgress: pa.progress
  };
}

module.exports = {
  getPlayerAchievementsByGameAccount,
  getAllPlayerAchievements,
  updatePlayerAchievementProgress,
  createPlayerAchievement,
  deletePlayerAchievement,
  getPlayerAchievementById,
  refreshAchievementProgress
};
