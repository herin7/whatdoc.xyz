const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
    githubId: { type: String, unique: true, sparse: true },
    githubAccessToken: String
})

const UserModel = model('users',userSchema);
module.exports = UserModel;