const express = require('express');
const { register, login } = require('../controllers/authController');
const { registerRules, loginRules, validate } = require('../middleware/validators/userValidator');
const router = express.Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);

module.exports = router;
