const express = require('express');
const router = express.Router();
const achievementDefinitionViewController = require('../viewControllers/achievementDefinitionViewController');

// List achievements for a category
router.get('/categories/:categoryId/achievements', achievementDefinitionViewController.renderAchievementDefinitionsList);

module.exports = router;
