const { body, param, validationResult } = require('express-validator');

const createCategoryRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),
    
    body('endpoint')
        .trim()
        .notEmpty().withMessage('Endpoint is required')
        .matches(/^https?:\/\/.+/).withMessage('Endpoint must be a valid URL starting with http:// or https://'),
    
    body('game')
        .notEmpty().withMessage('Game reference is required')
        .isMongoId().withMessage('Game must be a valid MongoDB ObjectId'),
    
    body('headers')
        .optional()
        .isObject().withMessage('Headers must be an object'),
    
    body('parameters')
        .optional()
        .isArray().withMessage('Parameters must be an array'),
    
    body('parameters.*.name')
        .if(body('parameters').exists())
        .trim()
        .notEmpty().withMessage('Parameter name is required')
        .isLength({ min: 1 }).withMessage('Parameter name must be at least 1 character'),
    
    body('parameters.*.required')
        .optional()
        .isBoolean().withMessage('Parameter required must be a boolean'),
    
    body('parameters.*.type')
        .optional()
        .isIn(['string', 'number', 'boolean']).withMessage('Parameter type must be one of: string, number, boolean')
];

const updateCategoryRules = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),
    
    body('endpoint')
        .optional()
        .trim()
        .matches(/^https?:\/\/.+/).withMessage('Endpoint must be a valid URL'),
    
    body('game')
        .optional()
        .isMongoId().withMessage('Game must be a valid MongoDB ObjectId'),
    
    body('headers')
        .optional()
        .isObject().withMessage('Headers must be an object'),
    
    body('parameters')
        .optional()
        .isArray().withMessage('Parameters must be an array')
];

const categoryIdRules = [
    param('categoryId').isMongoId().withMessage('Invalid category ID')
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    createCategoryRules,
    updateCategoryRules,
    categoryIdRules,
    validate
};
