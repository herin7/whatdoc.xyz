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
    proExpiryDate: { type: Date, default: null },
    generationCount: { type: Number, default: 0 },
    planTier: { type: String, enum: ['free', '499', '999'], default: 'free' },
    avatarUrl: { type: String, default: '' }
})

const UserModel = model('users', userSchema);

module.exports = { UserModel };