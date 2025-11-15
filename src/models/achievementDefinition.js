const mongoose = require('mongoose');
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
    //add per categoryMetrics 
});
//Auto-delete expired achievements before any .find() call
AchievementDefinitionSchema.pre(/^find/, async function (next) {
    try {
        await this.model.deleteMany({ expirationDate: { $lt: new Date() } });
        next();
    } catch (err) {
        console.error("Error cleaning expired achievements:", err);
        next(err);
    }
});

module.exports = mongoose.model('AchievementDefinition', AchievementDefinitionSchema);
