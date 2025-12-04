mongoose=require('mongoose');
const Schema=mongoose.Schema;
const UserSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    privacy:{
        type:String,
        enum:['public','private','friendsOnly'],
        default:'public'
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    friends:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }]
});
// Cascade delete GameAccounts - covers doc.deleteOne()
UserSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        const GameAccount = mongoose.model('GameAccount');
        await GameAccount.deleteMany({ user: this._id });
        next();
    } catch (err) {
        next(err);
    }
});

// Cascade delete GameAccounts - covers findByIdAndDelete()
UserSchema.pre('findOneAndDelete', async function (next) {
    try {
        const GameAccount = mongoose.model('GameAccount');
        const doc = await this.model.findOne(this.getFilter());
        if (doc) {
            await GameAccount.deleteMany({ user: doc._id });
        }
        next();
    } catch (err) {
        next(err);
    }
});

// Cascade delete GameAccounts - covers deleteMany()
UserSchema.pre('deleteMany', async function (next) {
    try {
        const GameAccount = mongoose.model('GameAccount');
        const docs = await this.model.find(this.getFilter());
        if (docs.length > 0) {
            const userIds = docs.map(d => d._id);
            await GameAccount.deleteMany({ user: { $in: userIds } });
        }
        next();
    } catch (err) {
        next(err);
    }
});
module.exports=mongoose.model('User',UserSchema);