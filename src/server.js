const express = require('express');
const cors = require('cors');
require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes=require('./routes/userRoutes');
const gameRoutes=require('./routes/gameRoutes');
const CategoryRoutes=require('./routes/categoryRoutes');
const categoryMetricRoutes=require('./routes/categoryMetricRoutes');
const categoryMetricsViewRoutes=require('./viewRoutes/categoryMetricsViewRoutes');
const gameAccountRoutes=require('./routes/gameAccountRoutes');
const playerAchievementRoutes=require('./routes/playerAchievementRoutes');
const indexRoutes=require('./routes/index');
const achievementDefinitionRoutes=require('./routes/achievementDefinitionRoutes');
const adminAuthViewRoutes = require('./viewRoutes/adminAuthViewRoutes');
const achievementDefinitionViewRoutes = require('./viewRoutes/achievementDefinitionViewRoutes');
const completedAchievementRoutes = require('./routes/completedAchievementRoutes');
dotenv.config();//loads environment variables from .env file
const app = express();
app.use(
  cors({
    origin: 'http://localhost:4200', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // if you ever send cookies or auth headers
  })
)
//setting ejs as the view engine
app.set('view engine', 'ejs');
app.set('views', './views'); 
//middleware to parse JSON request bodies
app.use(express.json());
app.use('/api/completed-achievements', completedAchievementRoutes);
app.use('/api/category-metrics', categoryMetricRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/games',gameRoutes);
app.use('/api/game-accounts', gameAccountRoutes);
app.use('/api/player-achievements',playerAchievementRoutes);
app.use('/api/achievement-definition',achievementDefinitionRoutes);

//view routes
app.use('/', achievementDefinitionViewRoutes);
app.use('/', adminAuthViewRoutes);
app.use('/', indexRoutes);



app.use('/api/categories',CategoryRoutes);
app.use( (req, res) => {
    res.status(404).render('404');
});
// app.get('/api/profile', authMiddleware, (req, res) => {
//     res.json({ message: 'This is a protected profile route', user: req.user.id });
//     console.log(req.user.id);
// });





//starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
