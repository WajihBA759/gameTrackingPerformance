const mongoose = require('mongoose');
const user = require('./user');
const Schema = mongoose.Schema;
const CompletedAchievementSchema = new Schema({
    gameAccount: { 
        type: Schema.Types.ObjectId,
        ref: "GameAccount",
        required: true 
    },
    title:{
        type: String,
        required: true
    },
    rewardPoints:{
        type: Number,
        required: true
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CompletedAchievement', CompletedAchievementSchema);