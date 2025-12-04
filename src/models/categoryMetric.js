const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CategoryMetricSchema = new Schema({
    category:{
        type:Schema.Types.ObjectId,
        ref:'Category',
        required: true
    },
    metricName: {
        type: String,
        required: true
    },
    metricPath: {
        type: String,
        required: true
    },
    customizationOptions: {
        type: String,
        required: false
    },
    logicType: {
        type: String,
        required: true,
        enum: ['count', 'sum', 'avg', 'none'],
        default: 'none'// none means just display the value as is
    },
    groupBy: {
        type: String,
        required: false
    },
    playerUnique:{
        type:Boolean,
        required:true,
        default:true,
    },
    separatorPath: { type: String }
});
// Cascade delete AchievementDefinitions and PlayerAchievements - covers doc.deleteOne()
CategoryMetricSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        const AchievementDefinition = mongoose.model('AchievementDefinition');
        const PlayerAchievement = mongoose.model('PlayerAchievement');
        
        await AchievementDefinition.deleteMany({ categoryMetric: this._id });
        await PlayerAchievement.deleteMany({ categoryMetric: this._id });
        
        next();
    } catch (err) {
        next(err);
    }
});

// Cascade delete AchievementDefinitions and PlayerAchievements - covers findByIdAndDelete()
CategoryMetricSchema.pre('findOneAndDelete', async function (next) {
    try {
        const AchievementDefinition = mongoose.model('AchievementDefinition');
        const PlayerAchievement = mongoose.model('PlayerAchievement');
        const doc = await this.model.findOne(this.getFilter());
        
        if (doc) {
            await AchievementDefinition.deleteMany({ categoryMetric: doc._id });
            await PlayerAchievement.deleteMany({ categoryMetric: doc._id });
        }
        
        next();
    } catch (err) {
        next(err);
    }
});

// Cascade delete AchievementDefinitions and PlayerAchievements - covers deleteMany()
CategoryMetricSchema.pre('deleteMany', async function (next) {
    try {
        const AchievementDefinition = mongoose.model('AchievementDefinition');
        const PlayerAchievement = mongoose.model('PlayerAchievement');
        const docs = await this.model.find(this.getFilter());
        
        if (docs.length > 0) {
            const metricIds = docs.map(d => d._id);
            await AchievementDefinition.deleteMany({ categoryMetric: { $in: metricIds } });
            await PlayerAchievement.deleteMany({ categoryMetric: { $in: metricIds } });
        }
        
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('CategoryMetric', CategoryMetricSchema);
