import mongoose from "mongoose";

const verificationSchema= mongoose.Schema({
    userId: String,
    otp: String,
    createdTime: Date,
    expireTime: Date,
}); 

export const OtpVerifiaction = mongoose.model("OtpVerifiaction",verificationSchema);