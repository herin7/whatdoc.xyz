const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const userSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: String,
    firstName: String,
    lastName: String,
    githubId: { type: String },
    githubUsername: String,
    githubAccessToken: String,
    isPro: { type: Boolean, default: false },
    avatarUrl: { type: String, default: '' }
})

const UserModel = model('users', userSchema);

module.exports = { UserModel };