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
// Auto-delete expired achievements before any .find() call
// AchievementDefinitionSchema.pre(/^find/, async function (next) {
//     try {
//         const PlayerAchievement = mongoose.model('PlayerAchievement');
//         const expiredAchievements = await this.model.find({ expirationDate: { $lt: new Date() } });
//         const expiredIds = expiredAchievements.map(a => a._id);
        
//         if (expiredIds.length > 0) {
//             await PlayerAchievement.deleteMany({ achievementDefinition: { $in: expiredIds } });
//             await this.model.deleteMany({ expirationDate: { $lt: new Date() } });
//         }
        
//         next();
//     } catch (err) {
//         console.error("Error cleaning expired achievements:", err);
//         next(err);
//     }
// });

// // Cascade delete PlayerAchievements - covers doc.deleteOne()
// AchievementDefinitionSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
//     try {
//         const PlayerAchievement = mongoose.model('PlayerAchievement');
//         await PlayerAchievement.deleteMany({ achievementDefinition: this._id });
//         next();
//     } catch (err) {
//         next(err);
//     }
// });

// // Cascade delete PlayerAchievements - covers findByIdAndDelete()
// AchievementDefinitionSchema.pre('findOneAndDelete', async function (next) {
//     try {
//         const PlayerAchievement = mongoose.model('PlayerAchievement');
//         const doc = await this.model.findOne(this.getFilter());
//         if (doc) {
//             await PlayerAchievement.deleteMany({ achievementDefinition: doc._id });
//         }
//         next();
//     } catch (err) {
//         next(err);
//     }
// });

// // Cascade delete PlayerAchievements - covers deleteMany()
// AchievementDefinitionSchema.pre('deleteMany', async function (next) {
//     try {
//         const PlayerAchievement = mongoose.model('PlayerAchievement');
//         const docs = await this.model.find(this.getFilter());
//         if (docs.length > 0) {
//             const ids = docs.map(d => d._id);
//             await PlayerAchievement.deleteMany({ achievementDefinition: { $in: ids } });
//         }
//         next();
//     } catch (err) {
//         next(err);
//     }
// });

module.exports = mongoose.model('AchievementDefinition', AchievementDefinitionSchema);
