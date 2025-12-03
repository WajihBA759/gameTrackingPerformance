const PlayerAchievement = require('../models/playerAchievement');
const AchievementDefinition = require('../models/achievementDefinition');
const CompletedAchievement = require('../models/completedAchievement');
const buildEndpoint=require('../utils/buildEndpoint').buildEndpoint;
const CategoryMetric =require('../models/categoryMetric');
const axios = require('axios');
const getValueAtPath = require('../utils/getValueAtPath');


exports.getPlayerAchievementsByGameAccount = async (req, res) => {
    try {
        const gameAccountId = req.params.gameAccountId;
        const achievements = await PlayerAchievement.find({ gameAccount: gameAccountId });
        res.status(200).send(achievements);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
};
exports.getAllPlayerAchievements = async (req, res) => {
    try {
        const achievements = await PlayerAchievement.find();
        res.status(200).send(achievements);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
};
exports.updatePlayerAchievementProgress = async (req, res) => {
    try {
        const { achievementId } = req.params;
        const { progressIncrement } = req.body;
        const achievement = await PlayerAchievement.findById(achievementId);
        if (!achievement) {
            return res.status(404).send({ message: 'Achievement not found' });
        }
        if (achievement.status === 'completed') {
            return res.status(400).send({ message: 'Achievement already completed' });
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
        res.status(200).send(achievement);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
};
exports.createPlayerAchievement = async (req, res) => {
  try {
    const { gameAccountId, achievementDefinitionId } = req.body;

    // 1) Load definition and its metric + category
    const achievementDef = await AchievementDefinition.findById(achievementDefinitionId)
      .populate({
        path: 'categoryMetric',
        populate: { path: 'category' }
      });

    if (!achievementDef) {
      return res.status(404).send({ message: 'Achievement definition not found' });
    }

    const metric = achievementDef.categoryMetric;
    if (!metric || !metric.category) {
      return res.status(500).send({ message: 'Achievement definition has no valid categoryMetric/category' });
    }

    const category = metric.category;

    // 2) Load gameAccount (for region/name/tag/puuid)
    const gameAccount = await require('../models/gameAccount').findById(gameAccountId);
    if (!gameAccount) {
      return res.status(404).send({ message: 'GameAccount not found' });
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
      countedSeparators: initialSeparators  // all existing matches are considered "old"
    });

    await newPlayerAchievement.save();
    return res.status(200).send(newPlayerAchievement);
  } catch (error) {
    console.error('createPlayerAchievement error:', error);
    res.status(500).send({ message: 'Server error', error: error.message });
  }
};

exports.deletePlayerAchievement = async (req, res) => {
    try {
        const { achievementId } = req.params;
        const achievement = await PlayerAchievement.findByIdAndDelete(achievementId);
        if (!achievement) {
            return res.status(404).send({ message: 'Achievement not found' });
        }
        res.status(200).send({ message: 'Achievement deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
};
exports.getPlayerAchievementById = async (req, res) => {
    try {
        const { id } = req.params;
        const achievement = await PlayerAchievement.findById(id);
        if (!achievement) {
            return res.status(404).send({ message: 'Achievement not found' });
        }
        res.status(200).send(achievement);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
};


//new logic is gonna be counting the sum of non counted matchIds or in the scalable domain metricSperator
//----------------------------------------------------------------------------------------------------------------

// Refresh progress of one PlayerAchievement by scanning recent matches
exports.refreshAchievementProgress = async (req, res) => {
  try {
    // 1) Get achievement id from route: /player-achievements/:achievementId/refresh
    const { achievementId } = req.params;

    // 2) Load PlayerAchievement with its GameAccount and CategoryMetric (+ Category)
    const pa = await PlayerAchievement.findById(achievementId)
      .populate('gameAccount')
      .populate({
        path: 'categoryMetric',
        populate: { path: 'category' }
      });

    if (!pa) {
      return res.status(404).json({ message: 'PlayerAchievement not found' });
    }

    // If already completed, do nothing
    if (pa.status === 'completed') {
      return res.status(400).json({ message: 'Achievement already completed' });
    }

    const gameAccount = pa.gameAccount;
    const metric = pa.categoryMetric;
    const category = metric.category;

    if (!metric || !category) {
      return res.status(500).json({ message: 'Metric or category not populated' });
    }

    // 3) Ensure separatorPath exists (used to uniquely identify events/matches)
    // Example: "metadata.matchid"
    const separatorPath = metric.separatorPath;
    if (!separatorPath) {
      return res.status(500).json({ message: 'separatorPath not configured for metric' });
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
    return res.status(200).json({
      achievement: pa,
      added,               // how much progress was added in this refresh
      totalProgress: pa.progress
    });
  } catch (err) {
    console.error('refreshAchievementProgress error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};