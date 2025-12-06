const { body, param, validationResult } = require('express-validator');

// Validation rules for creating achievement definition
const createAchievementDefinitionRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Achievement name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3-100 characters'),
    
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10, max: 500 }).withMessage('Description must be between 10-500 characters'),
    
    body('points')
        .notEmpty().withMessage('Points are required')
        .isInt({ min: 1, max: 10000 }).withMessage('Points must be an integer between 1-10000'),
    
    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean'),
    
    body('expirationDate')
        .notEmpty().withMessage('Expiration date is required')
        .isISO8601().withMessage('Expiration date must be a valid date')
        .custom((value) => {
            if (new Date(value) <= new Date()) {
                throw new Error('Expiration date must be in the future');
            }
            return true;
        }),
    
    body('requiredAmount')
        .notEmpty().withMessage('Required amount is required')
        .isInt({ min: 1, max: 1000000 }).withMessage('Required amount must be an integer between 1-1000000'),
    
    body('categoryMetric')
        .notEmpty().withMessage('Category metric is required')
        .isMongoId().withMessage('Category metric must be a valid MongoDB ObjectId')
];

// Validation rules for updating achievement definition
const updateAchievementDefinitionRules = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3-100 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ min: 10, max: 500 }).withMessage('Description must be between 10-500 characters'),
    
    body('points')
        .optional()
        .isInt({ min: 1, max: 10000 }).withMessage('Points must be an integer between 1-10000'),
    
    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean'),
    
    body('expirationDate')
        .optional()
        .isISO8601().withMessage('Expiration date must be a valid date')
        .custom((value) => {
            if (new Date(value) <= new Date()) {
                throw new Error('Expiration date must be in the future');
            }
            return true;
        }),
    
    body('requiredAmount')
        .optional()
        .isInt({ min: 1, max: 1000000 }).withMessage('Required amount must be an integer between 1-1000000'),
    
    body('categoryMetric')
        .optional()
        .isMongoId().withMessage('Category metric must be a valid MongoDB ObjectId')
];

// Param validation for achievement ID
const achievementIdRules = [
    param('achievementId').isMongoId().withMessage('Invalid achievement ID')
];

// Handle validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    createAchievementDefinitionRules,
    updateAchievementDefinitionRules,
    achievementIdRules,
    validate
};
