const PlayerAchievement = require('../models/playerAchievement');
const AchievementDefinition = require('../models/achievementDefinition');
const CompletedAchievement = require('../models/completedAchievement');
const GameAccount = require('../models/gameAccount');
const buildEndpoint = require('../utils/buildEndpoint').buildEndpoint;
const axios = require('axios');
const getValueAtPath = require('../utils/getValueAtPath');

async function getPlayerAchievementsByGameAccounts(gameAccountIds) {
  return PlayerAchievement.find({ gameAccount: { $in: gameAccountIds } });
}

async function getPlayerAchievementsByGameAccount(gameAccountId) {
  return PlayerAchievement.find({ gameAccount: gameAccountId });
}

async function getAllPlayerAchievements() {
  return PlayerAchievement.find();
}

async function updatePlayerAchievementProgress(achievementId, progressIncrement) {
  const achievement = await PlayerAchievement.findById(achievementId).populate('achievementDefinition');
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

  // Check if achievement definition is active
  if (achievement.achievementDefinition && !achievement.achievementDefinition.isActive) {
    const err = new Error('Achievement definition is not active. Progress cannot be updated.');
    err.statusCode = 400;
    throw err;
  }

  achievement.progress += progressIncrement;

  if (achievement.progress >= achievement.requiredAmount) {
    achievement.status = 'completed';
    achievement.completedAt = new Date();
    // Create a record in CompletedAchievement
    const completedAchievement = new CompletedAchievement({
      gameAccount: achievement.gameAccount,
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

  // Check if achievement definition is active
  if (!achievementDef.isActive) {
    const err = new Error('Cannot create player achievement: Achievement definition is not active');
    err.statusCode = 400;
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
  const separatorPath = metric.separatorPath;
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
    countedSeparators: initialSeparators
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

// Refresh progress of one PlayerAchievement by scanning recent matches
async function refreshAchievementProgress(achievementId) {
  // 1) Load PlayerAchievement with its GameAccount, CategoryMetric, and AchievementDefinition
  const pa = await PlayerAchievement.findById(achievementId)
    .populate('gameAccount')
    .populate('achievementDefinition')
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

  // Check if achievement definition is active
  if (pa.achievementDefinition && !pa.achievementDefinition.isActive) {
    return {
      completed: false,
      achievement: pa,
      added: 0,
      totalProgress: pa.progress,
      message: 'Achievement definition is not active. Progress not updated.'
    };
  }

  const gameAccount = pa.gameAccount;
  const metric = pa.categoryMetric;
  const category = metric.category;

  if (!metric || !category) {
    const err = new Error('Metric or category not populated');
    err.statusCode = 500;
    throw err;
  }

  // 3) Ensure separatorPath exists
  const separatorPath = metric.separatorPath;
  if (!separatorPath) {
    const err = new Error('separatorPath not configured for metric');
    err.statusCode = 500;
    throw err;
  }

  // 4) Build API parameter values from GameAccount
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

  // 5) Call external API
  const finalUrl = buildEndpoint(category.endpoint, category.parameters || [], paramValues || {});
  const { data } = await axios.get(finalUrl, { headers: category.headers || {} });

  const matches = Array.isArray(data.data) ? data.data : [];

  // 6) Track progress
  let added = 0;
  const newSeparators = [];

  for (const match of matches) {
    const matchId = separatorPath
      .split('.')
      .reduce((cur, key) => (cur ? cur[key] : undefined), match);

    if (!matchId) continue;

    // Skip if already counted
    if (pa.countedSeparators && pa.countedSeparators.includes(matchId)) continue;

    const valueArray = getValueAtPath(match, metric.metricPath);
    const groupArray = getValueAtPath(match, metric.groupBy);

    if (!Array.isArray(valueArray) || !Array.isArray(groupArray)) continue;

    const idx = groupArray.indexOf(gameAccount.puuid);
    if (idx === -1) continue;

    const rawVal = valueArray[idx];

    const numericVal =
      rawVal && typeof rawVal === 'object' && 'value' in rawVal
        ? (rawVal.value || 0)
        : (rawVal || 0);

    added += numericVal;
    newSeparators.push(matchId);
  }

  // 7) Update progress
  pa.progress = Math.min(pa.progress + added, pa.requiredAmount);

  if (!Array.isArray(pa.countedSeparators)) {
    pa.countedSeparators = [];
  }
  pa.countedSeparators.push(...newSeparators);

  // 8) Check completion
  let completedAchievement = null;
  if (pa.progress >= pa.requiredAmount) {
    pa.status = 'completed';
    pa.completedAt = new Date();

    completedAchievement = new CompletedAchievement({
      gameAccount: pa.gameAccount._id,
      title: pa.name,
      rewardPoints: pa.points,
      completedAt: pa.completedAt
    });
    await completedAchievement.save();

    await PlayerAchievement.findByIdAndDelete(achievementId);

    return {
      completed: true,
      achievement: {
        name: pa.name,
        description: pa.description,
        points: pa.points,
        completedAt: pa.completedAt
      },
      completedAchievement,
      added,
      totalProgress: pa.progress,
      message: 'Achievement completed and recorded!'
    };
  }

  // 9) Save if not completed
  await pa.save();

  return {
    completed: false,
    achievement: pa,
    added,
    totalProgress: pa.progress
  };
}

// Refresh all PlayerAchievements for a GameAccount
async function refreshAllAchievementsForGameAccount(gameAccountId) {
  const gameAccount = await GameAccount.findById(gameAccountId);
  if (!gameAccount) {
    const err = new Error('GameAccount not found');
    err.statusCode = 404;
    throw err;
  }

  const playerAchievements = await PlayerAchievement.find({
    gameAccount: gameAccountId,
    status: { $ne: 'completed' }
  });

  if (playerAchievements.length === 0) {
    return {
      message: 'No active achievements to refresh',
      totalAchievements: 0,
      refreshed: 0,
      completed: 0,
      failed: 0,
      skipped: 0,
      results: []
    };
  }

  const results = [];
  let refreshedCount = 0;
  let completedCount = 0;
  let failedCount = 0;
  let skippedCount = 0;

  for (const pa of playerAchievements) {
    try {
      const result = await refreshAchievementProgress(pa._id.toString());
      
      if (result.message && result.message.includes('not active')) {
        // Achievement was skipped because definition is inactive
        results.push({
          achievementId: pa._id,
          achievementName: pa.name,
          success: true,
          skipped: true,
          reason: 'Achievement definition is not active'
        });
        skippedCount++;
      } else {
        results.push({
          achievementId: pa._id,
          achievementName: pa.name,
          success: true,
          completed: result.completed,
          added: result.added,
          totalProgress: result.totalProgress,
          ...(result.completed && { completedAchievement: result.completedAchievement })
        });

        refreshedCount++;
        if (result.completed) {
          completedCount++;
        }
      }
    } catch (error) {
      console.error(`Failed to refresh achievement ${pa._id}:`, error.message);
      results.push({
        achievementId: pa._id,
        achievementName: pa.name,
        success: false,
        error: error.message
      });
      failedCount++;
    }
  }

  return {
    message: 'Bulk refresh completed',
    gameAccountId,
    totalAchievements: playerAchievements.length,
    refreshed: refreshedCount,
    completed: completedCount,
    failed: failedCount,
    skipped: skippedCount,
    results
  };
}

module.exports = {
  getPlayerAchievementsByGameAccounts,
  getPlayerAchievementsByGameAccount,
  getAllPlayerAchievements,
  updatePlayerAchievementProgress,
  createPlayerAchievement,
  deletePlayerAchievement,
  getPlayerAchievementById,
  refreshAchievementProgress,
  refreshAllAchievementsForGameAccount
};
