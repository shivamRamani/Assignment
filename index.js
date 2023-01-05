import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import postRoute from "./Routes/postRoute.js"
import userRoute from "./Routes/userRoute.js"
import cors from "cors"

const port=process.env.PORT||5000;
const app=express();

app.use(cors())
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
    });
app.use(express.json());

app.use('/posts',postRoute);
app.use('/user',userRoute);

mongoose.set('strictQuery', true);
mongoose.connect(process.env.CONNECTION_URL).then(()=>console.log('Database Connected'));


app.listen(port,()=>{
    console.log(`Listening to port ${port}`);
})