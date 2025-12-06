const express = require('express');
const cors = require('cors');
require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const CategoryRoutes = require('./routes/categoryRoutes');
const categoryMetricRoutes = require('./routes/categoryMetricRoutes');
const gameAccountRoutes = require('./routes/gameAccountRoutes');
const playerAchievementRoutes = require('./routes/playerAchievementRoutes');
const indexRoutes = require('./routes/index');
const achievementDefinitionRoutes = require('./routes/achievementDefinitionRoutes');
const adminAuthViewRoutes = require('./viewRoutes/adminAuthViewRoutes');
const achievementDefinitionViewRoutes = require('./viewRoutes/achievementDefinitionViewRoutes');
const completedAchievementRoutes = require('./routes/completedAchievementRoutes');

dotenv.config();
const app = express();

// CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow all localhost origins
    if (/^http:\/\/localhost(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Setting ejs as the view engine
app.set('view engine', 'ejs');
app.set('views', './views'); 

// Middleware to parse JSON request bodies
app.use(express.json());
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${req.method}] ${req.url} - ${res.statusCode} (${duration}ms)`);
    });
    next();
});

// ========================================
// API ROUTES FIRST (ALL WITH /api PREFIX)
// ========================================
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/categories', CategoryRoutes);
app.use('/api/category-metrics', categoryMetricRoutes);
app.use('/api/game-accounts', gameAccountRoutes);
app.use('/api/player-achievements', playerAchievementRoutes);
app.use('/api/achievement-definition', achievementDefinitionRoutes);
app.use('/api/completed-achievements', completedAchievementRoutes);


// VIEW ROUTES
app.use('/admin', adminAuthViewRoutes);  
app.use('/admin', achievementDefinitionViewRoutes);
app.use('/admin', indexRoutes);


// Root redirect
app.get('/', (req, res) => {
    res.redirect('/admin');
});

// ========================================
// 404 HANDLER (MUST BE ABSOLUTE LAST!)
// ========================================
app.use((req, res) => {
    console.log('404 Not Found:', req.method, req.url);  // Debug log
    res.status(404).json({ message: 'Route not found' });  // Return JSON instead of rendering
});

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
    console.log(`Admin panel at http://localhost:${PORT}/admin`);
});
