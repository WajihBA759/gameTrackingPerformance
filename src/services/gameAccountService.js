// services/gameAccountService.js
const GameAccount = require('../models/gameAccount');
const Game = require('../models/game');
const CompletedAchievement = require('../models/completedAchievement');
const { validateGameAccountIdentifiers } = require('../utils/validateGameAccountParams');

async function createGameAccount(data) {
  const { user, game: gameId, puuid, region, name, tag } = data;

  if (!user || !gameId) {
    const err = new Error('user and game are required');
    err.statusCode = 400;
    throw err;
  }

  const providedFields = { puuid, region, name, tag };

  const game = await Game.findById(gameId);
  if (!game) {
    const err = new Error('Game not found');
    err.statusCode = 404;
    throw err;
  }

  const validation = await validateGameAccountIdentifiers(gameId, providedFields);
  if (!validation.ok) {
    const err = new Error('Missing required identifiers/parameters');
    err.statusCode = 400;
    err.details = { missing: validation.missing };
    throw err;
  }

  const identifierKey = validation.identifierKey; // e.g. "puuid"
  const existing = await GameAccount.findOne({
    game: gameId,
    [identifierKey]: providedFields[identifierKey]
  });
  if (existing) {
    const err = new Error('This game account is already linked');
    err.statusCode = 400;
    throw err;
  }

  const ga = new GameAccount({
    user,
    game: gameId,
    puuid,
    region,
    name,
    tag
  });

  await ga.save();
  return { message: 'Game account created', gameAccount: ga };
}

async function getGameAccountById(id) {
  const ga = await GameAccount.findById(id).populate('game', 'name identifierKey');
  if (!ga) {
    const err = new Error('GameAccount not found');
    err.statusCode = 404;
    throw err;
  }
  return ga;
}

async function getGameAccountsForUser(userId) {
  return GameAccount.find({ user: userId }).populate('game', 'name identifierKey');
}

async function updateGameAccount(id, data) {
  const { puuid, region, name, tag } = data;

  const ga = await GameAccount.findById(id).populate('game');
  if (!ga) {
    const err = new Error('GameAccount not found');
    err.statusCode = 404;
    throw err;
  }

  const providedFields = {
    puuid: puuid ?? ga.puuid,
    region: region ?? ga.region,
    name: name ?? ga.name,
    tag: tag ?? ga.tag
  };

  const validation = await validateGameAccountIdentifiers(ga.game._id, providedFields);
  if (!validation.ok) {
    const err = new Error('Missing required identifiers');
    err.statusCode = 400;
    err.details = { missing: validation.missing };
    throw err;
  }

  if (puuid !== undefined) ga.puuid = puuid;
  if (region !== undefined) ga.region = region;
  if (name !== undefined) ga.name = name;
  if (tag !== undefined) ga.tag = tag;

  ga.updatedAt = new Date();
  await ga.save();

  return { message: 'GameAccount updated', gameAccount: ga };
}

async function deleteGameAccount(id) {
  const ga = await GameAccount.findByIdAndDelete(id);
  if (!ga) {
    const err = new Error('GameAccount not found');
    err.statusCode = 404;
    throw err;
  }
  return { message: 'GameAccount deleted' };
}

// Get total points for a game account by summing completed achievements
async function getGameAccountTotalPoints(gameAccountId) {
  const ga = await GameAccount.findById(gameAccountId);
  if (!ga) {
    const err = new Error('GameAccount not found');
    err.statusCode = 404;
    throw err;
  }

  // Aggregate sum of rewardPoints from CompletedAchievements
  const result = await CompletedAchievement.aggregate([
    { $match: { gameAccount: ga._id } },
    { $group: { _id: null, totalPoints: { $sum: '$rewardPoints' } } }
  ]);

  const totalPoints = result.length > 0 ? result[0].totalPoints : 0;

  return {
    gameAccountId: ga._id,
    user: ga.user,
    game: ga.game,
    totalPoints,
    completedAchievementsCount: await CompletedAchievement.countDocuments({ gameAccount: ga._id })
  };
}

module.exports = {
  createGameAccount,
  getGameAccountById,
  getGameAccountsForUser,
  updateGameAccount,
  deleteGameAccount,
  getGameAccountTotalPoints
};
