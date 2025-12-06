const express = require('express');
const router = express.Router();
const controller = require('../controllers/playerAchievementController');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
    createPlayerAchievementRules,
    achievementIdRules,
    gameAccountIdRules,
    validate
} = require('../middleware/validators/playerAchievementValidator');

router.use(authMiddleware);

// Create player achievement
router.post('/', createPlayerAchievementRules, validate, controller.createPlayerAchievement);

router.get('/:gameAccountId/achievements', gameAccountIdRules, validate, controller.getPlayerAchievementsByGameAccount);

// Refresh all achievements
router.post('/game-account/:gameAccountId/refresh-all', gameAccountIdRules, validate, controller.refreshAllAchievementsForGameAccount);

// Refresh single achievement
router.post('/:achievementId/refresh', achievementIdRules, validate, controller.refreshAchievementProgress);

router.delete('/:achievementId', achievementIdRules, validate, controller.deletePlayerAchievement);


module.exports = router;
