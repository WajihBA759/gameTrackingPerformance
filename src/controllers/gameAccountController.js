const GameAccount=require('../models/gameAccount');
exports.getGameAccountsByUser=async(req,res)=>{
    const { userId } = req.params;
    try {
        const gameAccounts = await GameAccount.find({ user: userId });
        res.status(200).json(gameAccounts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getGameAccountById=async(req,res)=>{
    const { accountId } = req.params;
    try {
        const gameAccount = await GameAccount.findById(accountId);
        if (!gameAccount) {
            return res.status(404).json({ message: 'Game account not found' });
        }
        res.status(200).json(gameAccount);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateGameAccount=async(req,res)=>{
    const { accountId } = req.params;
    const { accountName, game, credentials } = req.body;
    try {
        const gameAccount = await GameAccount.findById(accountId);
        if (!gameAccount) {
            return res.status(404).json({ message: 'Game account not found' });
        }
        gameAccount.accountName = accountName;
        gameAccount.game = game;
        gameAccount.credentials = credentials;
        await gameAccount.save();
        res.status(200).json({ message: 'Game account updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteGameAccount=async(req,res)=>{
    const { accountId } = req.params;
    try {
        const gameAccount = await GameAccount.findByIdAndDelete(accountId);
        if (!gameAccount) {
            return res.status(404).json({ message: 'Game account not found' });
        }
        res.status(200).json({ message: 'Game account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createGameAccount=async(req,res)=>{
    const { accountName, user, game, credentials } = req.body;
    try {
        const newGameAccount = new GameAccount({ accountName, user, game, credentials });
        await newGameAccount.save();
        res.status(201).json({ message: 'Game account created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllGameAccounts=async(req,res)=>{
    try {
        const gameAccounts = await GameAccount.find();
        res.status(200).json(gameAccounts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};