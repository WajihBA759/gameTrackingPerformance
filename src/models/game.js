const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  // the single identifier key (admin sets this when adding a game)
  // e.g. "puuid", "steamId", "summonerId", "epicId"
  identifierKey: { type: String, required: true }
});

module.exports = mongoose.model('Game', GameSchema);
