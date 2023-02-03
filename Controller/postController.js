
import mongoose from "mongoose";
import { postSchema } from "../Utils/validationSchema.js"
import postServices from "../Services/postServices.js";

export const getAllposts = async (req,res)=>{
    try{
        const allPosts = await postServices.getPosts(); 
        res.status(200).json(allPosts);
    } catch(error){
        console.log(error);
        res.status(400).json({error: error.message});
    }
}

export const createPost = async (req,res)=>{
    const creatorId=req.userId;

    try{
        const result = await postSchema.validateAsync({...req.body,creatorId});
        const postData= await postServices.createPost(result);
        
        res.status(201).json(postData);
    }
    catch(error){
        console.log(error);
        if(error.isJoi===true){
            res.status(422).json(error.details);
        }else
        res.status(500).json({error: error.massage});
    }
    
}

export const updatePost = async (req,res)=>{
    console.log("requested update");


    const postId =mongoose.Types.ObjectId(req.params.id);
    const newPostData = req.body;
    try {
        const updatedPost= await postServices.updatePost(postId,newPostData);
        
        if(!updatedPost){
            res.status(404).json('No Post Found');
        }
        else {
            res.status(200).json(updatedPost);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
    
}

export const deletePost = async (req,res)=>{
    console.log("requested delete");

    const postId = req.params.id;

    try {

        const deletedPost = await postServices.deletePost(postId)

        if(!deletedPost){
            res.status(404).json('No Post Found to delete');
        }
        else {
            res.status(200).json(deletedPost);
        }
    } catch (error) {
        console.log(error);
        res.status(408).json(error.massage);
    }
    
}
