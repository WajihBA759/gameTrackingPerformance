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
// // Cascade delete CategoryMetrics - covers doc.deleteOne()
// CategorySchema.pre('deleteOne', { document: true, query: false }, async function (next) {
//     try {
//         const CategoryMetric = mongoose.model('CategoryMetric');
//         await CategoryMetric.deleteMany({ category: this._id });
//         next();
//     } catch (err) {
//         next(err);
//     }
// });

// // Cascade delete CategoryMetrics - covers findByIdAndDelete()
// CategorySchema.pre('findOneAndDelete', async function (next) {
//     try {
//         const CategoryMetric = mongoose.model('CategoryMetric');
//         const doc = await this.model.findOne(this.getFilter());
//         if (doc) {
//             await CategoryMetric.deleteMany({ category: doc._id });
//         }
//         next();
//     } catch (err) {
//         next(err);
//     }
// });

// // Cascade delete CategoryMetrics - covers deleteMany()
// CategorySchema.pre('deleteMany', async function (next) {
//     try {
//         const CategoryMetric = mongoose.model('CategoryMetric');
//         const docs = await this.model.find(this.getFilter());
//         if (docs.length > 0) {
//             const categoryIds = docs.map(d => d._id);
//             await CategoryMetric.deleteMany({ category: { $in: categoryIds } });
//         }
//         next();
//     } catch (err) {
//         next(err);
//     }
// });

module.exports = mongoose.model('Category', CategorySchema);
