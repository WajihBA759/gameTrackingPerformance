// src/controllers/gameAccountController.js
const GameAccount = require('../models/gameAccount');
const Game = require('../models/game');
const { validateGameAccountIdentifiers } = require('../utils/validateGameAccountParams');

exports.createGameAccount = async (req, res) => {
  try {
    const { user, game: gameId, puuid, region, name, tag } = req.body;


    // Basic required checks
    if (!user || !gameId) {
      return res.status(400).json({ message: 'user and game are required' });
    }

    // Build a flat object of fields to validate
    const providedFields = { puuid, region, name, tag };

    // Check game exists
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Validate required identifiers/parameters (identifierKey + category params)
    const validation = await validateGameAccountIdentifiers(gameId, providedFields);
    if (!validation.ok) {
      return res.status(400).json({
        message: 'Missing required identifiers/parameters',
        missing: validation.missing,
      });
    }

    // Prevent duplicates: user cannot link same identifierKey value twice for the same game
    const identifierKey = validation.identifierKey; // e.g. "puuid"
    const existing = await GameAccount.findOne({
      game: gameId,
      [identifierKey]: providedFields[identifierKey],
    });
    if (existing) {
      return res.status(400).json({ message: 'This game account is already linked' });
    }

    const ga = new GameAccount({
      user,
      game: gameId,
      puuid,
      region,
      name,
      tag,
    });

    await ga.save();

    // Optionally: create an empty Profile for the player+game now
    // const profile = new Profile({ user, game: gameId, gameAccount: ga._id, metrics: {} });
    // await profile.save();

    return res.status(201).json({ message: 'Game account created', gameAccount: ga });
  } catch (err) {
    console.error('createGameAccount error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getGameAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const ga = await GameAccount.findById(id).populate('game', 'name identifierKey');
    if (!ga) return res.status(404).json({ message: 'GameAccount not found' });
    return res.status(200).json(ga);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getGameAccountsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const accounts = await GameAccount.find({ user: userId }).populate('game', 'name identifierKey');
    return res.status(200).json(accounts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updateGameAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { puuid, region, name, tag } = req.body;


    const ga = await GameAccount.findById(id).populate('game');
    if (!ga) {
      return res.status(404).json({ message: 'GameAccount not found' });
    }

    // Build the would-be final fields to validate
    const providedFields = {
      puuid: puuid ?? ga.puuid,
      region: region ?? ga.region,
      name: name ?? ga.name,
      tag: tag ?? ga.tag,
    };

    const validation = await validateGameAccountIdentifiers(ga.game._id, providedFields);
    if (!validation.ok) {
      return res.status(400).json({
        message: 'Missing required identifiers',
        missing: validation.missing,
      });
    }

    // Apply changes
    if (puuid !== undefined) ga.puuid = puuid;
    if (region !== undefined) ga.region = region;
    if (name !== undefined) ga.name = name;
    if (tag !== undefined) ga.tag = tag;

    ga.updatedAt = new Date();
    await ga.save();

    return res.status(200).json({ message: 'GameAccount updated', gameAccount: ga });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteGameAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const ga = await GameAccount.findByIdAndDelete(id);
    if (!ga) {
      return res.status(404).json({ message: 'GameAccount not found' });
    }
    // optionally remove profile, player achievements, etc.
    return res.status(200).json({ message: 'GameAccount deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};