// src/models/gameAccount.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameAccountSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  game: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
  // identifiers is a map/object containing required identifiers + other params
  // e.g. { puuid: "abcd-1234", region: "eu", name: "TenZ", tag: "SEN" }
  // identifiers: { type: Schema.Types.Mixed, required: true },
  puuid:{
    type: String,
    requried:true,
    unique:true,

  },
  region:{
    type:String,
    required:true,

  },
  name:{
    type:String,
    required:true,

  },
  tag:{
    type:String,
    required:true,

  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GameAccount', GameAccountSchema);
