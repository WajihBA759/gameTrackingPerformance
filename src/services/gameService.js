const Game = require('../models/game');

async function createGame(data) {
  const { name, description, identifierKey } = data;

  const existingGame = await Game.findOne({ name });
  if (existingGame) {
    const err = new Error('Game already exists');
    err.statusCode = 400;
    throw err;
  }

  const newGame = new Game({ name, description, identifierKey });
  await newGame.save();

  return { message: 'Game created successfully', game: newGame };
}

async function getAllGames() {
  return Game.find();
}

async function updateGame(gameId, data) {
  const { name, description, identifierKey } = data;

  const gameData = await Game.findById(gameId);
  if (!gameData) {
    const err = new Error('Game not found');
    err.statusCode = 404;
    throw err;
  }

  gameData.name = name;
  gameData.description = description;
  gameData.identifierKey= identifierKey;
  await gameData.save();

  return { message: 'Game updated successfully', game: gameData };
}

async function deleteGame(gameId) {
  const gameData = await Game.findByIdAndDelete(gameId);
  if (!gameData) {
    const err = new Error('Game not found');
    err.statusCode = 404;
    throw err;
  }
  return { message: 'Game deleted successfully' };
}

async function getGameById(gameId) {
  const gameData = await Game.findById(gameId);
  if (!gameData) {
    const err = new Error('Game not found');
    err.statusCode = 404;
    throw err;
  }
  return gameData;
}

module.exports = {
  createGame,
  getAllGames,
  updateGame,
  deleteGame,
  getGameById
};
