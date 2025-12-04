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

module.exports = mongoose.model('CategoryMetric', CategoryMetricSchema);
