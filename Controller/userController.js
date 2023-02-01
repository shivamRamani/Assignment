import dotenv from "dotenv";
dotenv.config();

import { User } from "../Model/userModel.js";
import { OtpVerifiaction } from "../Model/userOtpVerification.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import userRouter from "../Routes/userRoute.js";

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
            throw new Error("not found");
        }
        const userOtpData=await OtpVerifiaction.findOne({userId: userId});
        if(!userOtpData){
            throw new Error("not found");
        }

        const otpExpired=userOtpData.expireTime<Date.now();

        if(otpExpired){
            await OtpVerifiaction.deleteMany({userId});
            throw new Error("expired");
        }
        
        const valid=await bcrypt.compare(otp,userOtpData.otp);
        
        if(valid){

            const verifiedUserData=await User.findByIdAndUpdate(userId,{verified: true},{new:true});
            await OtpVerifiaction.deleteMany({userId});
            res.status(200).json({
                message: "user verified", 
                data: {
                    id: verifiedUserData._id,
                    userName: verifiedUserData.userName,
                    email: verifiedUserData.userName,
                    verified: verifiedUserData.verified
                }
            })
        }
        else {
            throw new Error(" not correct otp  ")
        }

    } catch (error) {
        res.status(404).json(error.massage);
    }

}


export const signIn = async (req,res) =>{

    const {email,password} = req.body;
    try {
        const currentUser= await User.findOne({emailId: email});
        
        if(!currentUser) {
            return res.status(404).json({massage: "User doesn't exist"});
        }

        const matchPassword= await bcrypt.compare(password,currentUser.password);
        if(!matchPassword) return res.status(404).json({ massage: 'Invalid Password'});

        const token = jwt.sign({email: currentUser.email, id: currentUser._id},process.env.SECRET_KEY,{expiresIn: "2h"});
        res.status(200).json(token);

    } catch (error) {
        res.status(500).json(error);
    }


}

export const signUp = async (req,res) =>{
    
    const {userName,email,password,confirmPassword} =req.body; 
    try{

        const existingUser= await User.findOne({emailId: email});

        if(existingUser) {
            return res.status(400).json({massage: "User already exist"});
        }

        if(password!=confirmPassword) return res.status(400).json({massage: "Passwords don't match"});

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser= new User({userName,emailId: email,password: hashedPassword});
        let verificationData;

        await newUser.save().then(async (result)=>{
            verificationData = await sendVerificationMail(result._id,email,res);
        })

        

        const token = jwt.sign({email: newUser.email, id: newUser._id},process.env.SECRET_KEY,{expiresIn: "2h"});

        res.status(200).json({...verificationData,token});

    }
    catch(error){
        console.log(error);
        res.status(409).json(error.massage);
    }

}
let transport = nodemailer.createTransport({
    port: 465,
        host: "smtp.gmail.com",
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.PASSWORD, 
        },
        secure: true,
 });


export const getUser = async (req,res) =>{
    console.log('hiii');
    try {

        const userData = await User.aggregate([

            {
                $project: {
                    _id: {
                        "$toString": "$_id"
                    },
                    userName: 1,
                    email: 1,
                    verified: 1
                }
              },
              {
				  $lookup: {
                  from: "posts",
                  localField: "_id",
                  foreignField: "creatorId",
                  as: "userPosts",
                  pipeline: [
                      {
                      	  $project: {
                          _id: 0,
                          creatorName: 1,
                          postData: 1
                          }
                      }
                  ]
                  }
              }
        ]);
        res.status(200).json(userData);

        
    } catch (error) {
        res.status(409).json(error.massage);
    }
}


 







