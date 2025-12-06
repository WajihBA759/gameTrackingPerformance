const express = require('express');
const assignAdminRole = require('../controllers/userController').assignAdminRole;
const { adminMiddleware } = require('../middleware/adminMiddleware');
const { authMiddleware } = require('../middleware/authMiddleware');
const { userIdRules, validate } = require('../middleware/validators/userValidator');
const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.post('/assign-admin/:userId', userIdRules, validate, assignAdminRole);

module.exports = router;
