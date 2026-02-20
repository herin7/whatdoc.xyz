const mongoose = require('mongoose');
const { optional } = require('zod');
const Schema = mongoose.Schema;
const model = mongoose.model;

const userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
    githubId: { type: String,optional:true, sparse: true },
    githubAccessToken: String
})

const ProjctSchema = new Schema({
    userId : {type : Schema.Types.ObjectId , ref : 'users',required : true},
    repoName : {type : String,required : true},
    slug : {type : String,required : true,unique : true},
    techstack : {type:String,enum : ['MERN','Next.js','other'],default : 'other'},
    generatedDocs : {type : String,default : ""},
    isPublic : {type : Boolean,default : true}
},{timestamps : true})

const UserModel = model('users',userSchema);
const ProjectModel = model('projects',ProjctSchema);

module.exports = { UserModel, ProjectModel };