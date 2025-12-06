const express = require('express');
const router = express.Router();
const achievementDefinitionViewController = require('../viewControllers/achievementDefinitionViewController');

// Achievement definition view routes
router.get('/categories/:categoryId/achievements', achievementDefinitionViewController.renderAchievementsList);
router.get('/categories/:categoryId/achievements/add', achievementDefinitionViewController.renderAddAchievement);
router.get('/achievements/edit/:achievementId', achievementDefinitionViewController.renderEditAchievement);

module.exports = router;
