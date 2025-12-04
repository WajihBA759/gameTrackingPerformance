// src/routes/gameAccountRoutes.js
const express = require('express');
const router = express.Router();
const gameAccountController = require('../controllers/gameAccountController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { privacyMiddleware, gameAccountPrivacyMiddleware } = require('../middleware/privacyMiddleware');

router.use(authMiddleware);

// Self-only routes (no privacy check)
router.post('/', gameAccountController.createGameAccount);
router.put('/:id', gameAccountController.updateGameAccount);
router.delete('/:id', gameAccountController.deleteGameAccount);

// Privacy-protected routes (viewing other users' data)
router.get('/user/:username/accounts', privacyMiddleware, gameAccountController.getGameAccountsForUser);
router.get('/:id/public', gameAccountPrivacyMiddleware, gameAccountController.getGameAccountById);
router.get('/:gameAccountId/total-points', gameAccountPrivacyMiddleware, gameAccountController.getGameAccountTotalPoints);

module.exports = router;
