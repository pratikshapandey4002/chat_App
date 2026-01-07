import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    email : {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required : true,
        minlength : 6
    },
    profilePic: {
        type:String,
        required: true,
        minlength: 6,
        default: ""
    },
    bio :{
        type: String,
    }}, {timestamps: true}
);

const User = mongoose.model('user', userSchema);

export default User;