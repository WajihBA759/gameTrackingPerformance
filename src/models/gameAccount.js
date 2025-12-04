const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameAccountSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  game: { 
    type: Schema.Types.ObjectId,
    ref: 'Game', 
    required: true 
  },
  puuid: {
    type: String,
    requried: true,
    unique: true,

  },
  region: {
    type: String,
    required: true,

  },
  name: {
    type: String,
    required: true,

  },
  tag: {
    type: String,
    required: true,

  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
// Cascade delete CompletedAchievements and PlayerAchievements - covers doc.deleteOne()
GameAccountSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        const CompletedAchievement = mongoose.model('CompletedAchievement');
        const PlayerAchievement = mongoose.model('PlayerAchievement');
        
        await CompletedAchievement.deleteMany({ gameAccount: this._id });
        await PlayerAchievement.deleteMany({ gameAccount: this._id });
        
        next();
    } catch (err) {
        next(err);
    }
});

// Cascade delete CompletedAchievements and PlayerAchievements - covers findByIdAndDelete()
GameAccountSchema.pre('findOneAndDelete', async function (next) {
    try {
        const CompletedAchievement = mongoose.model('CompletedAchievement');
        const PlayerAchievement = mongoose.model('PlayerAchievement');
        const doc = await this.model.findOne(this.getFilter());
        
        if (doc) {
            await CompletedAchievement.deleteMany({ gameAccount: doc._id });
            await PlayerAchievement.deleteMany({ gameAccount: doc._id });
        }
        
        next();
    } catch (err) {
        next(err);
    }
});

// Cascade delete CompletedAchievements and PlayerAchievements - covers deleteMany()
GameAccountSchema.pre('deleteMany', async function (next) {
    try {
        const CompletedAchievement = mongoose.model('CompletedAchievement');
        const PlayerAchievement = mongoose.model('PlayerAchievement');
        const docs = await this.model.find(this.getFilter());
        
        if (docs.length > 0) {
            const accountIds = docs.map(d => d._id);
            await CompletedAchievement.deleteMany({ gameAccount: { $in: accountIds } });
            await PlayerAchievement.deleteMany({ gameAccount: { $in: accountIds } });
        }
        
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('GameAccount', GameAccountSchema);
