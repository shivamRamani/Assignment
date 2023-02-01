import express from "express";
import { signIn,signUp,verifyotp,getUser } from "../Controller/userController.js";

const userRouter=express.Router();

userRouter.get('/',getUser);
userRouter.get('/signin',signIn);
userRouter.post('/signup',signUp);
userRouter.post('/verifyotp',verifyotp);

export default userRouter;