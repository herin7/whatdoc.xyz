const mongoose = require('mongoose');
const z = require('zod');
const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = mongoose.ObjectId;
const userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
    githubId : {type : String,unique : true}
})
const UserModel = model('users',userSchema);
module.exports = UserModel;