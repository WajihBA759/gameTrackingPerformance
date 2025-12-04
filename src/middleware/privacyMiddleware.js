const User = require('../models/user');
const GameAccount = require('../models/gameAccount');

// Existing: Privacy middleware for username-based routes
const privacyMiddlewareByUsername = async (req, res, next) => {
    try {
        const { username } = req.params;
        const requesterId = req.user.id;
        const targetUser = await User.findOne({ username }).populate('friends', '_id');
        
        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (targetUser._id.equals(requesterId)) {
            return next();
        }
        
        const requester = await User.findById(requesterId);
        if (requester.role === 'admin') {
            return next();
        }
        
        switch (targetUser.privacy) {
            case 'public':
                return next();
            case 'private':
                return res.status(403).json({ message: "Profile is private" });
            case 'friendsOnly':
                const isFriend = targetUser.friends.some(
                    friend => friend._id.equals(requesterId)
                );
                if (isFriend) return next();
                return res.status(403).json({ message: "Profile is friends-only" });
            default:
                return res.status(403).json({ message: "Invalid privacy setting" });
        }
    } catch (error) {
        console.error('Error in privacy middleware:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// NEW: Privacy middleware for userId-based routes
const privacyMiddlewareByUserId = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const requesterId = req.user.id;
        
        // If viewing own profile/data, allow
        if (userId === requesterId) {
            return next();
        }
        
        const targetUser = await User.findById(userId).populate('friends', '_id');
        
        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // If requester is admin, allow
        const requester = await User.findById(requesterId);
        if (requester.role === 'admin') {
            return next();
        }
        
        // Check privacy settings
        switch (targetUser.privacy) {
            case 'public':
                return next();
            case 'private':
                return res.status(403).json({ message: "Profile is private" });
            case 'friendsOnly':
                const isFriend = targetUser.friends.some(
                    friend => friend._id.equals(requesterId)
                );
                if (isFriend) return next();
                return res.status(403).json({ message: "Profile is friends-only" });
            default:
                return res.status(403).json({ message: "Invalid privacy setting" });
        }
    } catch (error) {
        console.error('Error in privacy middleware:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Privacy middleware for gameAccount routes (uses gameAccountId or id)
const gameAccountPrivacyMiddleware = async (req, res, next) => {
    try {
        const gameAccountId = req.params.id || req.params.gameAccountId;
        const requesterId = req.user.id;
        
        const gameAccount = await GameAccount.findById(gameAccountId).populate('user');
        
        if (!gameAccount) {
            return res.status(404).json({ message: 'Game account not found' });
        }
        
        const targetUser = gameAccount.user;
        
        if (targetUser._id.equals(requesterId)) {
            return next();
        }
        
        const requester = await User.findById(requesterId);
        if (requester.role === 'admin') {
            return next();
        }
        
        const targetUserWithFriends = await User.findById(targetUser._id).populate('friends', '_id');
        
        switch (targetUserWithFriends.privacy) {
            case 'public':
                return next();
            case 'private':
                return res.status(403).json({ message: "This user's profile is private" });
            case 'friendsOnly':
                const isFriend = targetUserWithFriends.friends.some(
                    friend => friend._id.equals(requesterId)
                );
                if (isFriend) return next();
                return res.status(403).json({ message: "This user's profile is friends-only" });
            default:
                return res.status(403).json({ message: "Invalid privacy setting" });
        }
    } catch (error) {
        console.error('Error in game account privacy middleware:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    privacyMiddleware: privacyMiddlewareByUsername,
    privacyMiddlewareByUserId,
    gameAccountPrivacyMiddleware
};
