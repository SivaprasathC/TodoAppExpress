import mongoose, {model,Schema} from "mongoose";

const userschema= new Schema({

    name:{type: String,required:true},
    number:{type:Number,required:true},
    mail:{type: String,required:true,unique:true},
    password:{type: String,required:true},
    resettoken:{type: String},
    tokenexpire:{type: Date},
    

},{timestamps:true})

export const user = mongoose.models.user || new model("user", userschema)