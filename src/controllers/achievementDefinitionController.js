const AchievementDefinition = require('../models/achievementDefinition');

exports.createAchievementDefinition = async (req, res) => {
    const { name, description, points } = req.body;
    try {
        const existingAchievement = await AchievementDefinition.findOne({ name });
        if (existingAchievement) {
            return res.status(400).json({ message: 'Achievement definition already exists' });
        }
        const newAchievement = new AchievementDefinition({ name, description, points });
        await newAchievement.save();
        res.status(200).json({ message: 'Achievement definition created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllAchievementDefinitions = async (req, res) => {
    try {
        const achievements = await AchievementDefinition.find();
        res.status(200).json(achievements);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateAchievementDefinition = async (req, res) => {
    const { achievementId } = req.params;
    const { name, description, points } = req.body;
    try {
        const achievement = await AchievementDefinition.findById(achievementId);
        if (!achievement) {
            return res.status(404).json({ message: 'Achievement definition not found' });
        }
        achievement.name = name;
        achievement.description = description;
        achievement.points = points;
        await achievement.save();
        res.status(200).json({ message: 'Achievement definition updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteAchievementDefinition = async (req, res) => {
    const { achievementId } = req.params;
    try {
        const achievement = await AchievementDefinition.findByIdAndDelete(achievementId);
        if (!achievement) {
            return res.status(404).json({ message: 'Achievement definition not found' });
        }
        res.status(200).json({ message: 'Achievement definition deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};