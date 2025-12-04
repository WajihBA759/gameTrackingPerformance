// src/routes/achievementDefinitionRoutes.js

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


const  authMiddleware  = require('../middleware/authMiddleware').authMiddleware;
const  adminMiddleware  = require('../middleware/adminMiddleware').adminMiddleware;

// Auth then admin for all achievement definition routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Create achievement definition
router.post('/', createAchievementDefinition);

// List all definitions
router.get('/', getAllAchievementDefinitions);

router.get('/:achievementId', getAchievementDefinitionById);


// Update
router.put('/:achievementId', updateAchievementDefinition);

// Delete
router.delete('/:achievementId', deleteAchievementDefinition);

router.get('/category/:categoryId', getAchievementDefinitionsByCategory);




module.exports = router;
