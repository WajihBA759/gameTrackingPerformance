const gameService = require('../services/gameService');

exports.createGame = async (req, res) => {
  try {
    const result = await gameService.createGame(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('createGame error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.statusCode ? error.message : 'Server error', error: error.message });
  }
};

exports.getAllGames = async (req, res) => {
  try {
    const games = await gameService.getAllGames();
    res.status(200).json(games);
  } catch (error) {
    console.error('getAllGames error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: 'Server error', error: error.message });
  }
};

exports.updateGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const result = await gameService.updateGame(gameId, req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('updateGame error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.statusCode ? error.message : 'Server error', error: error.message });
  }
};

exports.deleteGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const result = await gameService.deleteGame(gameId);
    res.status(200).json(result);
  } catch (error) {
    console.error('deleteGame error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.statusCode ? error.message : 'Server error', error: error.message });
  }
};

exports.getGameById = async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await gameService.getGameById(gameId);
    res.status(200).json(game);
  } catch (error) {
    console.error('getGameById error:', error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.statusCode ? error.message : 'Server error', error: error.message });
  }
};