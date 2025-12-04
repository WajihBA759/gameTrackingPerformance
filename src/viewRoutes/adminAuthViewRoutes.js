// viewRoutes/adminAuthViewRoutes.js
const express = require('express');
const router = express.Router();
const adminAuthViewController = require('../viewControllers/adminAuthViewController');

// show login form
router.get('/admin/login', adminAuthViewController.renderAdminLogin);

// show signup form
router.get('/admin/signup', adminAuthViewController.renderAdminSignup);

module.exports = router;
