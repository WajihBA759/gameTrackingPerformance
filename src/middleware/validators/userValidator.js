const { body, param, validationResult } = require('express-validator');

const registerRules = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3-30 characters')
        .matches(/^[a-z0-9_]+$/).withMessage('Username can only contain lowercase letters, numbers, and underscores')
        .toLowerCase(),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    
    body('role')
        .optional()
        .isIn(['user', 'admin']).withMessage('Role must be either user or admin')
];

const loginRules = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required')
];

const updateUserRules = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3-30 characters')
        .matches(/^[a-z0-9_]+$/).withMessage('Username can only contain lowercase letters, numbers, and underscores')
        .toLowerCase(),
    
    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    body('privacy')
        .optional()
        .isIn(['public', 'private', 'friendsOnly']).withMessage('Privacy must be one of: public, private, friendsOnly'),
    
    body('role')
        .optional()
        .isIn(['user', 'admin']).withMessage('Role must be either user or admin')
];

const userIdRules = [
    param('userId').isMongoId().withMessage('Invalid user ID')
];

const usernameRules = [
    param('username')
        .trim()
        .matches(/^[a-z0-9_]+$/).withMessage('Invalid username format')
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    registerRules,
    loginRules,
    updateUserRules,
    userIdRules,
    usernameRules,
    validate
};
