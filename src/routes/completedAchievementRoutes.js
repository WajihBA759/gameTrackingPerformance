// routes/completedAchievementRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/completedAchievementController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { privacyMiddleware, gameAccountPrivacyMiddleware } = require('../middleware/privacyMiddleware');

router.use(authMiddleware);

// Privacy-protected routes (viewing other users' completed achievements)
router.get('/user/:username/completed', privacyMiddleware, controller.getCompletedAchievementsByUsername);
router.get('/game-account/:gameAccountId/completed', gameAccountPrivacyMiddleware, controller.getCompletedAchievementsByGameAccount);

module.exports = router;
