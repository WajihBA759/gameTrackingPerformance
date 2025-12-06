const express = require('express');
const router = express.Router();
const {
  createAchievementDefinition,
  getAllAchievementDefinitions,
  updateAchievementDefinition,
  deleteAchievementDefinition,
  getAchievementDefinitionById,
  getAchievementDefinitionsByCategory
} = require('../controllers/achievementDefinitionController');

const { authMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const {
    createAchievementDefinitionRules,
    updateAchievementDefinitionRules,
    achievementIdRules,
    validate
} = require('../middleware/validators/achievementDefinitionValidator');

// All routes require authentication
router.use(authMiddleware);

// GET routes (public for authenticated users)
router.get('/', getAllAchievementDefinitions);
router.get('/category/:categoryId', getAchievementDefinitionsByCategory);
router.get('/:achievementId', achievementIdRules, validate, getAchievementDefinitionById);

// POST/PUT/DELETE routes (admin only)
router.post('/', adminMiddleware, createAchievementDefinitionRules, validate, createAchievementDefinition);
router.put('/:achievementId', adminMiddleware, achievementIdRules, updateAchievementDefinitionRules, validate, updateAchievementDefinition);
router.delete('/:achievementId', adminMiddleware, achievementIdRules, validate, deleteAchievementDefinition);

module.exports = router;
