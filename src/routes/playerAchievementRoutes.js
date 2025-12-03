const express = require('express');
const router = express.Router();
const controller = require('../controllers/playerAchievementController');
const auth = require('../middleware/authMiddleware').authMiddleware;

router.use(auth);
router.post('/',controller.createPlayerAchievement)

router.post('/:achievementId/refresh', controller.refreshAchievementProgress);

module.exports = router;
