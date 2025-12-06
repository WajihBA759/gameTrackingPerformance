const { body, param, validationResult } = require('express-validator');

const createGameAccountRules = [
    body('user')
        .notEmpty().withMessage('User reference is required')
        .isMongoId().withMessage('User must be a valid MongoDB ObjectId'),
    
    body('game')
        .notEmpty().withMessage('Game reference is required')
        .isMongoId().withMessage('Game must be a valid MongoDB ObjectId'),
    
    body('puuid')
        .trim()
        .notEmpty().withMessage('PUUID is required')
        .isLength({ min: 10, max: 100 }).withMessage('PUUID must be between 10-100 characters'),
    
    body('region')
        .trim()
        .notEmpty().withMessage('Region is required')
        .isLength({ min: 2, max: 10 }).withMessage('Region must be between 2-10 characters')
        .matches(/^[A-Z0-9]+$/).withMessage('Region can only contain uppercase letters and numbers')
        .toUpperCase(),
    
    body('name')
        .trim()
        .notEmpty().withMessage('Account name is required')
        .isLength({ min: 3, max: 50 }).withMessage('Name must be between 3-50 characters'),
    
    body('tag')
        .trim()
        .notEmpty().withMessage('Tag is required')
        .isLength({ min: 2, max: 10 }).withMessage('Tag must be between 2-10 characters')
];

const updateGameAccountRules = [
    body('puuid')
        .optional()
        .trim()
        .isLength({ min: 10, max: 100 }).withMessage('PUUID must be between 10-100 characters'),
    
    body('region')
        .optional()
        .trim()
        .isLength({ min: 2, max: 10 }).withMessage('Region must be between 2-10 characters')
        .matches(/^[A-Z0-9]+$/).withMessage('Region can only contain uppercase letters and numbers')
        .toUpperCase(),
    
    body('name')
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage('Name must be between 3-50 characters'),
    
    body('tag')
        .optional()
        .trim()
        .isLength({ min: 2, max: 10 }).withMessage('Tag must be between 2-10 characters')
];

const gameAccountIdRules = [
    param('id').isMongoId().withMessage('Invalid game account ID')
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    createGameAccountRules,
    updateGameAccountRules,
    gameAccountIdRules,
    validate
};
