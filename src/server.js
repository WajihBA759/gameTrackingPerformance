const express = require('express');
const cors = require('cors');
require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes=require('./routes/userRoutes');
const gameRoutes=require('./routes/gameRoutes');
const CategoryRoutes=require('./routes/categoryRoutes');
const categoryMetricRoutes=require('./routes/categoryMetricRoutes');
dotenv.config();//loads environment variables from .env file
const app = express();
app.use(
  cors({
    origin: 'http://localhost:4200', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // if you ever send cookies or auth headers
  })
)
app.use(express.json());
app.use('/api/category-metrics', categoryMetricRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/games',gameRoutes);
app.use('/api/categories',CategoryRoutes);
// app.get('/api/profile', authMiddleware, (req, res) => {
//     res.json({ message: 'This is a protected profile route', user: req.user.id });
//     console.log(req.user.id);
// });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
