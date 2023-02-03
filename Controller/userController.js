import dotenv from "dotenv";
dotenv.config();

import { User } from "../Model/userModel.js";
import { OtpVerifiaction } from "../Model/userOtpVerification.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { userSchema } from "../Utils/validationSchema.js"
import userServices from "../Services/userServices.js";

let transport = nodemailer.createTransport({
    port: 465,
        host: "smtp.gmail.com",
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.PASSWORD, 
        },
        secure: true,
 });

const sendVerificationMail = async (_id,email,res)=>{
    try{
        const otp=`${Math.floor(1000+Math.random()*9000)}`;
        const mailOptions = {
            from: process.env.SENDER_EMAIL, 
            to: email,                      
            subject: 'Verification OTP',    
            text: `Your verification OTP is ${otp}.It will expire in one hour!`,
        };
        const hashedotp= await bcrypt.hash(otp,10);
        const newOtpVerification= new OtpVerifiaction({
            userId: _id,
            otp: hashedotp,
            createdTime: Date.now(),
            expireTime: Date.now()+3600000,
        });
        
        await newOtpVerification.save();
        transport.sendMail(mailOptions, function(err, info) {
            if (err) {
              console.log(err);
              throw new Error(err);
            } else {
              console.log(info);
            }
         });
         return {
            status: "Pending",
            massage: "Verification Otp is sent to your email",
            data:{
                userId: _id,
                email
            }
         };
         
    }
    catch(error){
        throw new Error(error);
        
    }
}
export const verifyotp = async (req,res) =>{
   
    try {
        const {userId,otp}= req.body;
        if(!userId||!otp){
            throw new Error("UserId and otp is required");
        }

        const userOtpData=await userServices.getOtpVerificationData(userId);
        if(!userOtpData){
            throw new Error("User Not found");
        }
        
        const otpExpired=userOtpData.expireTime<Date.now();

        if(otpExpired){
            await userServices.deleteOtpVerificationData(userId);
            throw new Error("otp expired");
        }
        
        const valid=await bcrypt.compare(otp,userOtpData.otp);
        
        if(valid){

            const verifiedUserData=await userServices.updateVerifiedUserData(userId);
            await userServices.deleteOtpVerificationData(userId);
            res.status(200).json({
                message: "user verified", 
                data: {
                    id: verifiedUserData._id,
                    userName: verifiedUserData.userName,
                    email: verifiedUserData.emailId,
                    verified: verifiedUserData.verified
                }
            })
        }
        else {
            throw new Error(" Wrong Otp ");
        }

    } catch (error) {
        console.log(error.message);
        res.status(404).json(error.message);
    }

}


export const signIn = async (req,res) =>{

    const {emailId,password} = req.body;
    try {
        const currentUser= await userServices.findUser(emailId);
        
        if(!currentUser) {
            return res.status(404).json({massage: "User doesn't exist"});
        }

        const matchPassword= await bcrypt.compare(password,currentUser.password);
        if(!matchPassword) return res.status(404).json({ massage: 'Invalid Password'});

        const token = jwt.sign({email: currentUser.emailId, id: currentUser._id},process.env.SECRET_KEY,{expiresIn: "2h"});
        res.status(200).json(token);

    } catch (error) {
        res.status(500).json(error);
    }


}

export const signUp = async (req,res) =>{
    
    try{
        
        const result= await userSchema.validateAsync(req.body,{abortEarly: false});
        const {userName,emailId,password,confirmPassword} = result; 
        console.log(result);
        const existingUser= await userServices.findUser(emailId);
        
        if(existingUser) {
            return res.status(400).json({massage: "User already exist"});
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser= new User({userName,emailId: emailId,password: hashedPassword});
        let verificationData;

        await newUser.save().then(async (result)=>{
            verificationData = await sendVerificationMail(result._id,emailId,res);
        });
        console.log(verificationData);

        const token = jwt.sign({email: newUser.emailId, id: newUser._id},process.env.SECRET_KEY,{expiresIn: "2h"});

        res.status(200).json({...verificationData,token});

    }
    catch(error){
        console.log(error);
        if(error.isJoi===true){
            res.status(422).json(error.details);
        }else
        res.status(409).json(error.massage);
    }

}



export const getUser = async (req,res) =>{
    try {

        const userData = await userServices.getUsers();
        res.status(200).json(userData);
        
    } catch (error) {
        res.status(409).json(error.massage);
    }
}


 







