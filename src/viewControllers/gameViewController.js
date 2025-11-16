const Game = require('../models/game');

exports.renderGamesList = async (req, res) => {
    try {
        const games = await Game.find().sort({ createdAt: -1 });
        res.render('gamesList', { games });
    } catch (error) {
        console.error('Error rendering games:', error);
        res.status(500).send('Server error');
    }
};

exports.renderAddGame = (req, res) => {
    res.render('addGame');
};

exports.renderEditGame = async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId);
        if (!game) {
            return res.status(404).send('Game not found');
        }
        res.render('editGame', { game });
    } catch (error) {
        console.error('Error rendering edit game:', error);
        res.status(500).send('Server error');
    }
};