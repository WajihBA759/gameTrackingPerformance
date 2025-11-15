const User = require('../models/user');
const privacyMiddleware = async (req, res, next) => {
    try {
        const{ username } = req.params;
        const requesterId = req.user.id;
        const targetUser = await User.findOne({ username }).populate('friends','_id');
        if(!targetUser){
            return res.status(404).json({ message: 'User not found' });
        }
        if(targetUser._id.equals(requesterId)){
            return next();
        }
        const requester = await User.findById(requesterId);
        if(requester.role == 'admin'){
            return next();
        }
        switch(targetUser.privacy){
            case 'public':
                return next();
            case 'private':
                if (targetUser._id.equals(requesterId)) return next();
                return res.status(403).json({ message: "Profile is private" });
            case 'friendsOnly':
                if (targetUser._id.equals(requesterId)) return next();
                const isFriend = targetUser.friends.some(
                    friend => friend._id.equals(requesterId));
                if (isFriend) return next();
                return res.status(403).json({ message: "Profile is private" });
        }
    } catch (error) {
        console.error('Error in privacy middleware:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {privacyMiddleware};
