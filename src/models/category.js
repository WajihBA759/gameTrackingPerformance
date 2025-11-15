const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    endpoint: {
        type: String,
        required: true,
        unique: true
    },
    game: {
        type: Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    headers: {
        type: Object,
        default: {}
     },
     parameters: {
        type: [
            {
                name: { type: String, required: true },
                required: { type: Boolean, default: true },
                type: { type: String, default: "string" }
            }
        ],
        default: []
    },
});

module.exports = mongoose.model('Category', CategorySchema);
