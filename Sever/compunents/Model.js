const mongoose = require("mongoose");
const Schema= mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    id:{type: ObjectId},
    email:{type: String,unique:true},
    name:{type: String},
    password:{type: String,require:true},
    diem:{type: Number},
    man:{type: Number},
    coin:{type: Number},
});

let User = mongoose.model("User",UserSchema);
module.exports={User};