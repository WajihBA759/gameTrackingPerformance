const {
    createGame,
    getAllGames,
    updateGame,
    deleteGame,
    getGameById
} = require('../controllers/gameController');
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const {
    createGameRules,
    updateGameRules,
    gameIdRules,
    validate
} = require('../middleware/validators/gameValidator');

router.use(authMiddleware);

router.post('/', adminMiddleware, createGameRules, validate, createGame);
router.get('/', getAllGames);
router.put('/:gameId', adminMiddleware, gameIdRules, updateGameRules, validate, updateGame);
router.delete('/:gameId', adminMiddleware, gameIdRules, validate, deleteGame);
router.get('/:gameId', gameIdRules, validate, getGameById);

module.exports = router;
