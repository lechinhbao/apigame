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

const RankSchema = new Schema({
    id:{type:ObjectId},
    id_user:{type: ObjectId,ref:"User"},
    diem:{type: Number},
    man:{type: Number},
    coin:{type: Number},
});

const PETUSERSchema = new Schema({
    id_petS:{type:ObjectId},
    id_User:{type: ObjectId,ref:"User"},
    id_PET:{type: ObjectId,ref:"PET"},
});

const PETSchema = new Schema({
    id_PET:{type:ObjectId},
    petname:{type: String},
    MT:{type: String},
})

let Rank = mongoose.model("Rank",RankSchema);
let User = mongoose.model("User",UserSchema);
let PETUser = mongoose.model("PETUSER",PETUSERSchema);
let PET = mongoose.model("PET",PETSchema);
module.exports={Rank,User,PETUser,PET};