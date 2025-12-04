const express = require('express');
const router = express.Router();
const controller = require('../controllers/playerAchievementController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { privacyMiddleware, gameAccountPrivacyMiddleware } = require('../middleware/privacyMiddleware');

router.use(authMiddleware);

// Self-only routes (no privacy check)
router.post('/', controller.createPlayerAchievement);
router.post('/:achievementId/refresh', controller.refreshAchievementProgress);
router.post('/game-account/:gameAccountId/refresh-all', controller.refreshAllAchievementsForGameAccount);

// Privacy-protected routes (viewing other users' achievements)
router.get('/user/:username/achievements', privacyMiddleware, controller.getPlayerAchievementsByUsername);
router.get('/game-account/:gameAccountId/achievements', gameAccountPrivacyMiddleware, controller.getPlayerAchievementsByGameAccount);

module.exports = router;
