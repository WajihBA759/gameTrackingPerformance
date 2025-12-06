const { body, param, validationResult } = require('express-validator');

const createGameRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Game name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2-100 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    
    body('identifierKey')
        .trim()
        .notEmpty().withMessage('Identifier key is required')
        .isLength({ min: 2, max: 50 }).withMessage('Identifier key must be between 2-50 characters')
        .matches(/^[a-z0-9_]+$/).withMessage('Identifier key can only contain lowercase letters, numbers, and underscores')
        .toLowerCase()
];

const updateGameRules = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2-100 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    
    body('identifierKey')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Identifier key must be between 2-50 characters')
        .matches(/^[a-z0-9_]+$/).withMessage('Identifier key can only contain lowercase letters, numbers, and underscores')
        .toLowerCase()
];

const gameIdRules = [
    param('gameId').isMongoId().withMessage('Invalid game ID')
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    createGameRules,
    updateGameRules,
    gameIdRules,
    validate
};
