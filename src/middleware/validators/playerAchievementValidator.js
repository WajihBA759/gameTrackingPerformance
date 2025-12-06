const { body, param, validationResult } = require('express-validator');

const createPlayerAchievementRules = [
    body('gameAccountId')
        .notEmpty().withMessage('Game account ID is required')
        .isMongoId().withMessage('Game account ID must be a valid MongoDB ObjectId'),
    
    body('achievementDefinitionId')
        .notEmpty().withMessage('Achievement definition ID is required')
        .isMongoId().withMessage('Achievement definition ID must be a valid MongoDB ObjectId')
];

const updateProgressRules = [
    body('progressIncrement')
        .notEmpty().withMessage('Progress increment is required')
        .isInt({ min: 0 }).withMessage('Progress increment must be a non-negative integer')
];

const achievementIdRules = [
    param('achievementId').isMongoId().withMessage('Invalid achievement ID')
];

const gameAccountIdRules = [
    param('gameAccountId').isMongoId().withMessage('Invalid game account ID')
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    createPlayerAchievementRules,
    updateProgressRules,
    achievementIdRules,
    gameAccountIdRules,
    validate
};
