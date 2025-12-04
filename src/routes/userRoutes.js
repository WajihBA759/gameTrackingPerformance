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

const router = express.Router();
router.use(authMiddleware);

// Privacy-protected routes
router.get('/:username/public-profile', privacyMiddleware, getProfileByUsername); 
router.get('/:userId/public', privacyMiddlewareByUserId, getUserById);
router.get('/:userId/friends-list', privacyMiddlewareByUserId, getFriendsList); 

// User management routes (admin or self only)
router.get('/:userId', getUserById); 
router.get('/', getAllUsers);
router.delete('/:userId', deleteUser);
router.post('/', addUser);
router.put('/:userId/profile', updateUser);

// Friend management routes (self only)
router.post('/:userId/friends', addFriend);
router.delete('/:userId/friends/:friendId', removeFriend);

// Assign admin role
router.post('/:userId/admin', adminMiddleware, assignAdminRole);

module.exports = router;
