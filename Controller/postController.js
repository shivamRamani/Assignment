
import { Post } from "../Model/postModel.js";
import mongoose from "mongoose";
import { User } from "../Model/userModel.js";

export const getAllposts = async (req,res)=>{
    try{
        const allPosts= await Post.aggregate([
            {
                $match : {}
            }
        ]);
        res.status(200).json(allPosts);
    } catch(error){
        res.status(400).json({error: error.massage});
    }
}

export const createPost = async (req,res)=>{
    const creatorId=req.userId;
    const postData=new Post({...req.body,creatorId});

    try{
        let postId;
        await postData.save();
        res.status(201).json(postData);
    }
    catch(error){
        console.log(error);
        res.status(500).json({error: error.massage});
    }
    
}

export const updatePost = async (req,res)=>{
    console.log("requested update");

    const postId =mongoose.Types.ObjectId(req.params.id);
    const newPostData = req.body;
    try {
        // const updatedPost= await Post.findByIdAndUpdate({_id},{...postData},{new:true});
        
        const updatedPost= await Post.aggregate([
            {
                $match : {_id: postId}
            },
            {
                $set : {...newPostData}
            }
        ]);
        console.log(updatedPost);
        if(!updatedPost){
            res.status(404).json('No Post Found');
        }
        else {
            res.status(200).json(updatedPost);
        }
    } catch (error) {
        console.log(error);
        res.status(409).json(error);
    }
    
}

export const deletePost = async (req,res)=>{
    console.log("requested delete");

    const _id = req.params.id;

    try {
        
        // const deletedPost = await Post.findByIdAndDelete({_id},{new:true});
        const deletedPost = await Post.findByIdAndDelete({_id},{new:true});
        

        if(!deletedPost){
            res.status(404).json('No Post Found');
        }
        else {
            res.status(200).json(deletedPost);
        }
    } catch (error) {
        console.log(error);
        res.status(408).json(error.massage);
    }
    
}
