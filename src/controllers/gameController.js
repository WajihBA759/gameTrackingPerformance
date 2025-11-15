const game=require('../models/game');
exports.createGame=async(req,res)=>{
    const { name, description } = req.body;
    try {
        const existingGame = await game.findOne({ name });
        if (existingGame) {
            return res.status(400).json({ message: 'Game already exists' });
        }
        const newGame = new game({ name, description });
        await newGame.save();
        res.status(201).json({ message: 'Game created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllGames=async(req,res)=>{
    try {
        const games = await game.find();
        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateGame=async(req,res)=>{
    const { gameId } = req.params;
    const { name, description } = req.body;
    try {
        const gameData = await game.findById(gameId);
        if (!gameData) {
            return res.status(404).json({ message: 'Game not found' });
        }
        gameData.name = name;
        gameData.description = description;
        await gameData.save();
        res.status(200).json({ message: 'Game updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteGame=async(req,res)=>{
    const { gameId } = req.params;
    try {
        const gameData = await game.findByIdAndDelete(gameId);
        if (!gameData) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.status(200).json({ message: 'Game deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getGameById=async(req,res)=>{
    const { gameId } = req.params;
    try {
        const gameData = await game.findById(gameId);
        if (!gameData) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.status(200).json(gameData);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
