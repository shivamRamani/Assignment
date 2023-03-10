import mongoose from "mongoose";

const userschema=mongoose.Schema({

    userName: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type :String,
    },
    verified: {
        type: Boolean,
        default: false
    }

});

export const User = mongoose.model('User',userschema);