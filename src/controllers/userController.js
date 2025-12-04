// controllers/userController.js
const userService = require('../services/userService');

exports.assignAdminRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await userService.assignAdminRole(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error('assignAdminRole error:', error);
    res.status(error.statusCode || 500).json({ message: 'Server error', error: error.message });
  }
};

exports.addUser = async (req, res) => {
  try {
    const result = await userService.addUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('addUser error:', error);
    res.status(error.statusCode || 500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await userService.updateUser(userId, req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('updateUser error:', error);
    res.status(error.statusCode || 500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await userService.deleteUser(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error('deleteUser error:', error);
    res.status(error.statusCode || 500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(error.statusCode || 500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProfileByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const profile = await userService.getProfileByUsername(username);
    res.status(200).json(profile);
  } catch (error) {
    console.error('getProfileByUsername error:', error);
    res.status(error.statusCode || 500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.error('getUserById error:', error);
    res.status(error.statusCode || 500).json({ message: 'Server error', error: error.message });
  }
};

exports.getFriendsList = async (req, res) => {
  try {
    const { userId } = req.params;
    const friends = await userService.getFriendsList(userId);
    res.status(200).json(friends);
  } catch (error) {
    console.error('getFriendsList error:', error);
    res.status(error.statusCode || 500).json({ message: 'Server error', error: error.message });
  }
};

exports.addFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.params;
    const result = await userService.addFriend(userId, friendId);
    res.status(200).json(result);
  } catch (error) {
    console.error('addFriend error:', error);
    res.status(error.statusCode || 500).json({ message: 'Server error', error: error.message });
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.params;
    const result = await userService.removeFriend(userId, friendId);
    res.status(200).json(result);
  } catch (error) {
    console.error('removeFriend error:', error);
    res.status(error.statusCode || 500).json({ message: 'Server error', error: error.message });
  }
};
