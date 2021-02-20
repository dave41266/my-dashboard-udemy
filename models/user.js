const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// this takes care of username
// look at documentation of passport-local Mongoose page
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
