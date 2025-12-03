const CompletedAchievement = require('../models/completedAchievement');
const PlayerAchievement = require('../models/playerAchievement');
const AchievementDefinition = require('../models/achievementDefinition');

exports.getCompletedAchievementsByGameAccount = async (req, res) => {
    try {
        const gameAccountId = req.params.gameAccountId;
        const completedAchievements = await CompletedAchievement.find({ gameAccount: gameAccountId });
        res.status(200).send(completedAchievements);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
};
exports.getAllCompletedAchievements = async (req, res) => {
    try {
        const completedAchievements = await CompletedAchievement.find();
        res.status(200).send(completedAchievements);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
};
exports.getCompletedAchievementById = async (req, res) => {
    try {
        const { id } = req.params;
        const completedAchievement = await CompletedAchievement.findById(id);
        if (!completedAchievement) {
            return res.status(404).send({ message: 'Completed achievement not found' });
        }
        res.status(200).send(completedAchievement);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
};
exports.createCompletedAchievement = async (req, res) => {
    try {
        const { gameAccountId, title, rewardPoints } = req.body;
        const newCompletedAchievement = new CompletedAchievement({
            gameAccount: gameAccountId,
            title,
            rewardPoints
        });
        await newCompletedAchievement.save();
        res.status(200).send(newCompletedAchievement);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
};
exports.deleteCompletedAchievement = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAchievement = await CompletedAchievement.findByIdAndDelete(id);
        if (!deletedAchievement) {
            return res.status(404).send({ message: 'Completed achievement not found' });
        }
        res.status(200).send({ message: 'Completed achievement deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
};
exports.updateCompletedAchievement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, rewardPoints } = req.body;
        const updatedAchievement = await CompletedAchievement.findByIdAndUpdate(
            id,
            { title, rewardPoints },
            { new: true }
        );
        if (!updatedAchievement) {
            return res.status(404).send({ message: 'Completed achievement not found' });
        }
        res.status(200).send(updatedAchievement);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
};