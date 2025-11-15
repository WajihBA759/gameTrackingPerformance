const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GameAccountSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    game:{
        type:Schema.Types.ObjectId,
        ref:'Game',
        required:true
    },
    tagName:{
        type:String,
        required:true
    },
    score:{
        type:Number,
        required:true
    },
    providerId:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('GameAccount', GameAccountSchema);
