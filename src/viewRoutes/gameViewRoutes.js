const express = require('express');
const router = express.Router();
const gameViewController = require('../viewControllers/gameViewController');

// View routes (no authentication needed for rendering forms)
router.get('/', gameViewController.renderGamesList);
router.get('/add', gameViewController.renderAddGame);
router.get('/edit/:gameId', gameViewController.renderEditGame);

module.exports = router;