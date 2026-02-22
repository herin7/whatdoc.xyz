const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
    githubId: { type: String, default: null, unique: true, sparse: true },
    githubUsername: { type: String, default: null },
    githubAccessToken: { type: String, default: null },
    isPro: { type: Boolean, default: false },
    avatarUrl: { type: String, default: '' }
})

const UserModel = model('users', userSchema);

module.exports = { UserModel };