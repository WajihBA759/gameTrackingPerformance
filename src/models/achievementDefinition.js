const mongoose = require('mongoose');
const playerAchievement = require('./playerAchievement');
const Schema = mongoose.Schema;
const AchievementDefinitionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    expirationDate: {
        type: Date,
        required: true
    },
    requiredAmount: {
        type: Number,
        required: true
    },
    categoryMetric: {
        type: Schema.Types.ObjectId,
        ref: 'CategoryMetric',
        required: true
    }
    //add per categoryMetrics 
});
//Auto-delete expired achievements Definitions and player achievements before any .find() call
AchievementDefinitionSchema.pre(/^find/, async function (next) {
    try {
        await this.model.deleteMany({ expirationDate: { $lt: new Date() } });
        await playerAchievement.deleteMany({ achievementDefinition: { $in: this._id } });
        next();
    } catch (err) {
        console.error("Error cleaning expired achievements:", err);
        next(err);
    }
});

module.exports = mongoose.model('AchievementDefinition', AchievementDefinitionSchema);
