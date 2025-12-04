const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  // the single identifier key (admin sets this when adding a game)
  // e.g. "puuid", "steamId", "summonerId", "epicId"
  identifierKey: { type: String, required: true }
});
// Cascade delete Categories and GameAccounts - covers doc.deleteOne()
GameSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        const Category = mongoose.model('Category');
        const GameAccount = mongoose.model('GameAccount');
        
        await Category.deleteMany({ game: this._id });
        await GameAccount.deleteMany({ game: this._id });
        
        next();
    } catch (err) {
        next(err);
    }
});

// Cascade delete Categories and GameAccounts - covers findByIdAndDelete()
GameSchema.pre('findOneAndDelete', async function (next) {
    try {
        const Category = mongoose.model('Category');
        const GameAccount = mongoose.model('GameAccount');
        const doc = await this.model.findOne(this.getFilter());
        
        if (doc) {
            await Category.deleteMany({ game: doc._id });
            await GameAccount.deleteMany({ game: doc._id });
        }
        
        next();
    } catch (err) {
        next(err);
    }
});

// Cascade delete Categories and GameAccounts - covers deleteMany()
GameSchema.pre('deleteMany', async function (next) {
    try {
        const Category = mongoose.model('Category');
        const GameAccount = mongoose.model('GameAccount');
        const docs = await this.model.find(this.getFilter());
        
        if (docs.length > 0) {
            const gameIds = docs.map(d => d._id);
            await Category.deleteMany({ game: { $in: gameIds } });
            await GameAccount.deleteMany({ game: { $in: gameIds } });
        }
        
        next();
    } catch (err) {
        next(err);
    }
});


module.exports = mongoose.model('Game', GameSchema);
