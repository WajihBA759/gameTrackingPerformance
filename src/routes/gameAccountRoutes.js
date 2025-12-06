const express = require('express');
const router = express.Router();
const gameAccountController = require('../controllers/gameAccountController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { privacyMiddleware, gameAccountPrivacyMiddleware } = require('../middleware/privacyMiddleware');
const {
    createGameAccountRules,
    updateGameAccountRules,
    gameAccountIdRules,
    validate
} = require('../middleware/validators/gameAccountValidator');

router.use(authMiddleware);

// Self-only routes (no privacy check)
router.post('/', createGameAccountRules, validate, gameAccountController.createGameAccount);
router.put('/:id', gameAccountIdRules, updateGameAccountRules, validate, gameAccountController.updateGameAccount);
router.delete('/:id', gameAccountIdRules, validate, gameAccountController.deleteGameAccount);

// Get accounts by userId (NEW ROUTE - for Flutter app)
router.get('/user/:userId', gameAccountController.getGameAccountsByUserId);

// Privacy-protected routes (viewing other users' data)
router.get('/user/:username/accounts', privacyMiddleware, gameAccountController.getGameAccountsForUser);
router.get('/:id/public', gameAccountIdRules, validate, gameAccountPrivacyMiddleware, gameAccountController.getGameAccountById);
router.get('/:gameAccountId/total-points', gameAccountIdRules, validate, gameAccountPrivacyMiddleware, gameAccountController.getGameAccountTotalPoints);

module.exports = router;
