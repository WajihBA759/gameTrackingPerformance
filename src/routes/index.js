const express = require('express');
const router = express.Router();
const categoryMetricViewRoutes = require('../viewRoutes/categoryMetricsViewRoutes');
const gameViewRoutes = require('../viewRoutes/gameViewRoutes');
const categoryViewRoutes = require('../viewRoutes/categoryViewRoutes');

// Mount view routes (without prefix, since server.js adds /admin)
router.use('/category-metrics', categoryMetricViewRoutes);
router.use('/games', gameViewRoutes);
router.use('/categories', categoryViewRoutes);

// Home redirect - Check if user has token, otherwise show login
router.get('/', (req, res) => {
    // Render a simple page that checks for token and redirects accordingly
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Redirecting...</title>
        </head>
        <body>
            <script>
                const token = localStorage.getItem('token');
                if (token) {
                    window.location.href = '/admin/games';
                } else {
                    window.location.href = '/admin/login';
                }
            </script>
        </body>
        </html>
    `);
});

module.exports = router;
