const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PlayerAchievementSchema = new Schema({
    gameAccount:{
        type:Schema.Types.ObjectId,
        ref:'GameAccount',
        required:true,
    },
    // reference kept ONLY during progress phase
    achievementDefinition: { 
        type: Schema.Types.ObjectId, 
        ref: "AchievementDefinition",
        default: null
    },
    categoryMetric: {
    type: Schema.Types.ObjectId,
    ref: 'CategoryMetric',
    required: true
  },

    // permanent stored properties
    name: String,
    description: String,
    points: Number,

    progress: { type: Number, default: 0 },
    requiredAmount: Number,
    status: { type: String, enum: ["in_progress", "completed"], default: "in_progress" },
    countedSeparators: { type: [String], default: [] },

    completedAt: Date
});

module.exports = mongoose.model('PlayerAchievement', PlayerAchievementSchema);