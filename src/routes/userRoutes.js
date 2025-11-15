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
const { privacyMiddleware }=require('../middleware/privacyMiddleware');
const {adminMiddleware}=require("../middleware/adminMiddleware");

const router = express.Router();
router.use(authMiddleware);
//privacy related route
router.get('/:username/public-profile', privacyMiddleware, getProfileByUsername);
//user management routes
router.get('/:userId', getUserById);
router.get('/', getAllUsers);
router.delete('/:userId', deleteUser);
router.post('/', addUser);
router.put('/:userId/profile', updateUser);
//friend management routes
router.get('/:userId/friends', getFriendsList);
router.post('/:userId/friends', addFriend);
router.delete('/:userId/friends/:friendId', removeFriend);
//assign admin role
router.post('/:userId/admin', adminMiddleware, assignAdminRole);


module.exports = router;