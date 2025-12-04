// services/authService.js
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const generateToken = require('../utils/generateToken');

// Register a new user (optionally as admin)
async function register({ username, email, password, role }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const err = new Error('User already exists');
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ 
    username, 
    email, 
    password: hashedPassword,
    role: role || 'user'  // <-- use provided role, default to 'user'
  });
  await newUser.save();

  // Optionally return a token so signup auto-logs them in
  const token = generateToken(newUser);
  return { message: 'User registered successfully', token };
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('Invalid credentials');
    err.statusCode = 400;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error('Invalid credentials');
    err.statusCode = 400;
    throw err;
  }

  const token = generateToken(user);
  return { token };
}

module.exports = {
  register,
  login
};
