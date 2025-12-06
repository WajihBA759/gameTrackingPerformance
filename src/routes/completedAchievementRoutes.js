const express = require('express');
const router = express.Router();
const controller = require('../controllers/completedAchievementController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { privacyMiddleware, gameAccountPrivacyMiddleware } = require('../middleware/privacyMiddleware');
const {
    gameAccountIdRules,
    usernameRules,
    validate
} = require('../middleware/validators/completedAchievementValidator');

router.use(authMiddleware);

// Privacy-protected routes (viewing other users' completed achievements)
router.get('/user/:username/completed', usernameRules, validate, privacyMiddleware, controller.getCompletedAchievementsByUsername);
router.get('/game-account/:gameAccountId/completed', gameAccountIdRules, validate, gameAccountPrivacyMiddleware, controller.getCompletedAchievementsByGameAccount);

module.exports = router;
