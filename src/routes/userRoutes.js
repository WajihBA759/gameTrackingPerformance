const express = require('express');
const {
     updateUser,
      addUser,
    deleteUser,
    getAllUsers,
    getProfileByUsername,
    getUserById,
    getFriendsList,
    addFriend,
    assignAdminRole,
    removeFriend } = require('../controllers/userController');
const {authMiddleware} = require('../middleware/authMiddleware');
const { privacyMiddleware, privacyMiddlewareByUserId } = require('../middleware/privacyMiddleware');
const {adminMiddleware} = require("../middleware/adminMiddleware");
const { 
    updateUserRules, 
    userIdRules, 
    usernameRules, 
    validate 
} = require('../middleware/validators/userValidator');

const router = express.Router();
router.use(authMiddleware);

// Privacy-protected routes
router.get('/:username/public-profile', usernameRules, validate, privacyMiddleware, getProfileByUsername);
router.get('/:userId/public', userIdRules, validate, privacyMiddlewareByUserId, getUserById);
router.get('/:userId/friends-list', userIdRules, validate, privacyMiddlewareByUserId, getFriendsList);

// User management routes
router.get('/:userId', userIdRules, validate, getUserById);
router.get('/', getAllUsers);
router.delete('/:userId', userIdRules, validate, deleteUser);
router.post('/', addUser);
router.put('/:userId/profile', userIdRules, updateUserRules, validate, updateUser);

// Friend management routes
router.post('/:userId/friends', userIdRules, validate, addFriend);
router.delete('/:userId/friends/:friendId', userIdRules, validate, removeFriend);

// Assign admin role
router.post('/:userId/admin', userIdRules, validate, adminMiddleware, assignAdminRole);

module.exports = router;
