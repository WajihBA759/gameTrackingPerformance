const User=require('../models/user');
const GameAccount=require('../models/gameAccount');

exports.assignAdminRole=async(req,res)=>{
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.role = 'admin';
        await user.save();
        res.status(200).json({ message: 'User promoted to admin successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.addUser=async(req,res)=>{
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateUser=async(req,res)=>{
    const { userId } = req.params;
    const { username, email, privacy } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.username = username;
        user.email = email;
        user.privacy = privacy;
        await user.save();
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteUser=async(req,res)=>{
    const { userId } = req.params;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllUsers=async(req,res)=>{
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getProfileByUsername=async(req,res)=>{
    const { username } = req.params;
    try {
        const user = await User.findOne({ username }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const gameAccounts = await GameAccount.find({ user: user._id })
        .populate('game','name description');//to be changed later if adding categories
        res.status(200).json({ user, gameAccounts });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getUserById=async(req,res)=>{
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getFriendsList=async(req,res)=>{
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).populate('friends','username email');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.friends);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.addFriend=async(req,res)=>{
    const { userId, friendId } = req.params;
    try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);
        if (!user || !friend) {
            return res.status(404).json({ message: 'User or friend not found' });
        }
        user.friends.push(friend._id);
        await user.save();
        res.status(200).json({ message: 'Friend added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.removeFriend=async(req,res)=>{
    const { userId, friendId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.friends.pull(friendId);
        await user.save();
        res.status(200).json({ message: 'Friend removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};