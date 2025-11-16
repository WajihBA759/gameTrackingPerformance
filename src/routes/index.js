const express = require('express');
const router = express.Router();
const categoryMetricViewRoutes = require('../viewRoutes/categoryMetricsViewRoutes');
const gameViewRoutes = require('../viewRoutes/gameViewRoutes');
const categoryViewRoutes = require('../viewRoutes/categoryViewRoutes');

// Mount view routes
router.use('/category-metrics', categoryMetricViewRoutes);
router.use('/games', gameViewRoutes);
router.use('/categories', categoryViewRoutes);
// Home redirect
router.get('/', (req, res) => {
    res.redirect('/games');
});

module.exports = router;