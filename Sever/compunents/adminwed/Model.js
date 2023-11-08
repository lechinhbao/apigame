const mongoose = require("mongoose");
const Schema= mongoose.Schema;
const ObjectId = Schema.ObjectId;

const AdminSchema = new Schema({
    id:{type: ObjectId},
    email:{type: String,unique:true},
    name:{type: String},
    password:{type: String,require:true},
    roll:{type: String,require:true},
});




module.exports={};