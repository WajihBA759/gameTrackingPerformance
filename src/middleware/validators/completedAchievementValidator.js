const { param, validationResult } = require('express-validator');

// Param validation for game account ID
const gameAccountIdRules = [
    param('gameAccountId').isMongoId().withMessage('Invalid game account ID')
];

// Param validation for username
const usernameRules = [
    param('username')
        .trim()
        .matches(/^[a-z0-9_]+$/).withMessage('Invalid username format')
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
    gameAccountIdRules,
    usernameRules,
    validate
};
