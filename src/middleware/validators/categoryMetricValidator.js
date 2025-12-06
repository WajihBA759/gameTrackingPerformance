const { body, param, validationResult } = require('express-validator');

const createCategoryMetricRules = [
    body('category')
        .notEmpty().withMessage('Category reference is required')
        .isMongoId().withMessage('Category must be a valid MongoDB ObjectId'),
    
    body('metricName')
        .trim()
        .notEmpty().withMessage('Metric name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Metric name must be between 2-100 characters'),
    
    body('metricPath')
        .trim()
        .notEmpty().withMessage('Metric path is required')
        .matches(/^[a-zA-Z0-9._]+$/).withMessage('Metric path can only contain letters, numbers, dots, and underscores'),
    
    body('customizationOptions')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Customization options cannot exceed 500 characters'),
    
    body('logicType')
        .notEmpty().withMessage('Logic type is required')
        .isIn(['count', 'sum', 'avg', 'none']).withMessage('Logic type must be one of: count, sum, avg, none'),
    
    body('groupBy')
        .optional()
        .trim()
        .matches(/^[a-zA-Z0-9._]*$/).withMessage('Group by path can only contain letters, numbers, dots, and underscores'),
    
    body('playerUnique')
        .optional()
        .isBoolean().withMessage('Player unique must be a boolean'),
    
    body('separatorPath')
        .optional()
        .trim()
        .matches(/^[a-zA-Z0-9._]*$/).withMessage('Separator path can only contain letters, numbers, dots, and underscores')
];

const updateCategoryMetricRules = [
    body('category')
        .optional()
        .isMongoId().withMessage('Category must be a valid MongoDB ObjectId'),
    
    body('metricName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Metric name must be between 2-100 characters'),
    
    body('metricPath')
        .optional()
        .trim()
        .matches(/^[a-zA-Z0-9._]+$/).withMessage('Metric path can only contain letters, numbers, dots, and underscores'),
    
    body('customizationOptions')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Customization options cannot exceed 500 characters'),
    
    body('logicType')
        .optional()
        .isIn(['count', 'sum', 'avg', 'none']).withMessage('Logic type must be one of: count, sum, avg, none'),
    
    body('groupBy')
        .optional()
        .trim()
        .matches(/^[a-zA-Z0-9._]*$/).withMessage('Group by path can only contain letters, numbers, dots, and underscores'),
    
    body('playerUnique')
        .optional()
        .isBoolean().withMessage('Player unique must be a boolean'),
    
    body('separatorPath')
        .optional()
        .trim()
        .matches(/^[a-zA-Z0-9._]*$/).withMessage('Separator path can only contain letters, numbers, dots, and underscores')
];

const metricIdRules = [
    param('metricId').isMongoId().withMessage('Invalid metric ID')
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    createCategoryMetricRules,
    updateCategoryMetricRules,
    metricIdRules,
    validate
};
