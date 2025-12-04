const User = require('../models/user');
const GameAccount = require('../models/gameAccount');

async function assignAdminRole(userId) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  user.role = 'admin';
  await user.save();
  return { message: 'User promoted to admin successfully' };
}

async function addUser({ username, email, password }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const err = new Error('User already exists');
    err.statusCode = 400;
    throw err;
  }
  const newUser = new User({ username, email, password });
  await newUser.save();
  return { message: 'User added successfully' };
}

async function updateUser(userId, { username, email, privacy }) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  user.username = username;
  user.email = email;
  user.privacy = privacy;
  await user.save();
  return { message: 'User updated successfully' };
}

async function deleteUser(userId) {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return { message: 'User deleted successfully' };
}

async function getAllUsers() {
  return User.find().select('-password');
}

async function getProfileByUsername(username) {
  const user = await User.findOne({ username }).select('-password');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  const gameAccounts = await GameAccount.find({ user: user._id })
    .populate('game', 'name description'); // to be changed later if adding categories
  return { user, gameAccounts };
}

async function getUserById(userId) {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
}

async function getFriendsList(userId) {
  const user = await User.findById(userId).populate('friends', 'username email');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user.friends;
}

async function addFriend(userId, friendId) {
  const user = await User.findById(userId);
  const friend = await User.findById(friendId);
  if (!user || !friend) {
    const err = new Error('User or friend not found');
    err.statusCode = 404;
    throw err;
  }
  user.friends.push(friend._id);
  await user.save();
  return { message: 'Friend added successfully' };
}

async function removeFriend(userId, friendId) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  user.friends.pull(friendId);
  await user.save();
  return { message: 'Friend removed successfully' };
}

module.exports = {
  assignAdminRole,
  addUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getProfileByUsername,
  getUserById,
  getFriendsList,
  addFriend,
  removeFriend
};
