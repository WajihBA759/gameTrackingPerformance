const express = require('express');
const router = express.Router();

// Login page
router.get('/login', (req, res) => {
    res.render('adminLogin'); 
});

// Signup page
router.get('/signup', (req, res) => {
    res.render('adminSignup');
});

// Logout
router.get('/logout', (req, res) => {
    res.render('adminLogin');
});

module.exports = router;
