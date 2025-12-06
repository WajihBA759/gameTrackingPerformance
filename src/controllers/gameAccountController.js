const gameAccountService = require('../services/gameAccountService');

exports.createGameAccount = async (req, res) => {
  try {
    const result = await gameAccountService.createGameAccount(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error('createGameAccount error', err);
    res
      .status(err.statusCode || 500)
      .json({
        message: err.statusCode ? err.message : 'Server error',
        ...(err.details ? { details: err.details } : {}),
        error: err.statusCode ? undefined : err.message
      });
  }
};

exports.getGameAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const ga = await gameAccountService.getGameAccountById(id);
    res.status(200).json(ga);
  } catch (err) {
    console.error('getGameAccountById error', err);
    res
      .status(err.statusCode || 500)
      .json({ message: err.statusCode ? err.message : 'Server error', error: err.message });
  }
};

exports.getGameAccountsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const accounts = await gameAccountService.getGameAccountsForUser(userId);
    res.status(200).json(accounts);
  } catch (err) {
    console.error('getGameAccountsForUser error', err);
    res
      .status(err.statusCode || 500)
      .json({ message: 'Server error', error: err.message });
  }
};

exports.updateGameAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await gameAccountService.updateGameAccount(id, req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error('updateGameAccount error', err);
    res
      .status(err.statusCode || 500)
      .json({
        message: err.statusCode ? err.message : 'Server error',
        ...(err.details ? { details: err.details } : {}),
        error: err.statusCode ? undefined : err.message
      });
  }
};

exports.deleteGameAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await gameAccountService.deleteGameAccount(id);
    res.status(200).json(result);
  } catch (err) {
    console.error('deleteGameAccount error', err);
    res
      .status(err.statusCode || 500)
      .json({ message: err.statusCode ? err.message : 'Server error', error: err.message });
  }
};
exports.getGameAccountTotalPoints = async (req, res) => {
  try {
    const { gameAccountId } = req.params;
    const result = await gameAccountService.getGameAccountTotalPoints(gameAccountId);
    res.status(200).json(result);
  } catch (error) {
    console.error('getGameAccountTotalPoints error:', error);
    res.status(error.statusCode || 500).json({ message: 'Server error', error: error.message });
  }
};
// Add this new method to gameAccountController.js

exports.getGameAccountsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Only allow users to fetch their own accounts
        if (req.user.id !== userId) {
            return res.status(403).json({ message: 'You can only view your own game accounts' });
        }

        const GameAccount = require('../models/gameAccount');
        const gameAccounts = await GameAccount.find({ user: userId }).populate('game');
        
        res.status(200).json(gameAccounts);
    } catch (error) {
        console.error('Error fetching game accounts:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
