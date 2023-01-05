import { User } from "../Model/userModel.js";
import { OtpVerifiaction } from "../Model/userOtpVerification.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import userRouter from "../Routes/userRoute.js";

let transport = nodemailer.createTransport({
    service: "Hotmail",
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.PASSWORD
    }
 });

const sendVerificationMail =async(_id,email,res)=>{
    console.log("this is s",_id,email);
    try{
        const otp=`${Math.floor(1000+Math.random()*9000)}`;
        const mailOptions = {
            from: process.env.SENDER_EMAIL, // Sender address
            to: email, // List of recipients
            subject: 'Verification OTP', // Subject line
            text: `Your verification OTP is ${opt}`, // Plain text body
        };
        
        const hashedotp= await bcrypt.hash(otp,10);
        const newOtpVerification= new OtpVerifiaction({
            userId: _id,
            otp: hashedotp,
            createdTime: Date.now(),
            expireTime: Date.now()+3600000,
        })
        
        await newOtpVerification.save();
        // transport.sendMail(mailOptions, function(err, info) {
        //     if (err) {
        //       console.log(err)
        //     } else {
        //       console.log(info);
        //     }
        //  });
        
         res.json({
            status: "Pending",
            massage: "Verification Otp is sent to your email",
            data:{
                userId: id,
                email
            }
         })
         
    }
    catch(error){
        res.json(error.massage )
    }
}
export const verifyotp = async (req,res) =>{
   
    try {
        const {userId,otp}= req.body;
        if(!userId||!otp){
            throw new Error("not found");
        }
        const userOtpData=await OtpVerifiaction.findOne({userId: userId});
        console.log(userOtpData);
        if(!userOtpData){
            throw new Error("not found");
        }

        const otpExpired=userOtpData.expireTime<Date.now();

        if(otpExpired){
            await OtpVerifiaction.deleteMany({userId});
            throw new Error("expired");
        }
        console.log(otp,userOtpData.otp);
        
        const valid=await bcrypt.compare(otp,userOtpData.otp);
        console.log(userOtpData,valid);
        
        if(valid){
            console.log('HIiiI',userId);
            const use =await User.findById(userId);
            console.log(use);

            await User.findByIdAndUpdate(userId,{verified: true},{new:true});
            await OtpVerifiaction.deleteMany({userId});
            res.status(200).json({
                status: "verified", 
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
        const currentUser= await User.findOne({email: email});

        if(!currentUser) {
            return res.status(404).json({massage: "User doesn't exist"});
        }

        const matchPassword= await bcrypt.compare(password,existingUser.password);

        if(!matchPassword) return res.status(404).json({ massage: 'Invalid Password'});

        const token = jwt.sign({email: existingUser.email, id: existingUser._id},"SECRET_KEY",{expiresIn: "2h"});
        res.status(200).json(token);

    } catch (error) {
        res.status(500).json({massage: 'Something went wrong'});
    }


}

export const signUp =  async (req,res) =>{
    
    const {userName,email,password,confirmPassword} =req.body; 
    console.log("signup",userName,email,password,confirmPassword);
    try{

        const existingUser= await User.findOne({emailId: email});

        if(existingUser) {
            console.log("this is a user ",existingUser);
            return res.status(400).json({massage: "User already exist"});
        }

        if(password!=confirmPassword) return res.status(400).json({massage: "Passwords don't match"});

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser= new User({userName,emailId: email,password: hashedPassword});

        await newUser.save().then((result)=>{
            console.log(result);
            sendVerificationMail(result._id,email,res)
        })
        // console.log(JSON.stringify(newUser));
        const token = jwt.sign({email: newUser.email, id: newUser._id},"SECRET_KEY",{expiresIn: "2h"});
        // console.log(token);
        res.status(200).json({result: newUser,token});

    }
    catch(error){
        console.log(error);
        res.status(409).json(error.massage);
    }

}


 







