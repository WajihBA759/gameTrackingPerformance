// src/routes/gameAccountRoutes.js
const express = require('express');
const router = express.Router();
const gameAccountController = require('../controllers/gameAccountController');
// if you have auth middleware, use it
// const { authenticate } = require('../middleware/authMiddleware');

router.post('/', /* authenticate, */ gameAccountController.createGameAccount);
router.get('/user/:userId', /* authenticate, */ gameAccountController.getGameAccountsForUser);
router.get('/:id', /* authenticate, */ gameAccountController.getGameAccountById);
router.put('/:id', /* authenticate, */ gameAccountController.updateGameAccount);
router.delete('/:id', /* authenticate, */ gameAccountController.deleteGameAccount);

module.exports = router;
