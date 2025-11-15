const {
    createAchievementDefinition,
    getAchievementDefinitions,
    getAchievementDefinitionById,
    updateAchievementDefinition,
    deleteAchievementDefinition
}=require('../controllers/achievementDefinitionController');
const express=require('express');
const { authenticate } = require('../middleware/authMiddleware');
const adminMiddleware=require('../middleware/adminMiddleware');

const router=express.Router();
router.use(authenticate);
router.use(adminMiddleware);
router.post('/', createAchievementDefinition);
router.get('/', getAchievementDefinitions);
router.get('/:id', getAchievementDefinitionById);
router.put('/:id', updateAchievementDefinition);
router.delete('/:id', deleteAchievementDefinition);
module.exports=router;