
import { Post } from "../Model/postModel.js"

export const getAllposts = async (req,res)=>{
    try{
        const allPosts= await Post.find({});
        res.status(200).json(allPosts);
    } catch(error){
        res.status(400).json({error: error.massage});
    }
}

export const createPost = async (req,res)=>{
    const creatorId=req.userId||'me';
    const postData=new Post({...req.body,creatorId});
    console.log('requested',postData);

    try{
        await postData.save();
        res.status(201).json(postData);
    }
    catch(error){
        res.status(500).json({error: error.massage});
    }
    
}

export const updatePost = async (req,res)=>{
    console.log("requested update");

    const _id =req.params.id;
    const postData = req.body;
    console.log(_id,postData);
    try {
        const updatedPost= await Post.findByIdAndUpdate({_id},{...postData},{new:true});
        console.log(updatePost);

        if(!updatedPost){
            res.status(404).json('No Post Found');
        }
        else {
            res.status(200).json(updatedPost);
        }
    } catch (error) {
        // handle error masssage
        console.log(error);
        res.status(409).json(error.massage);
    }
    
}

export const deletePost = async (req,res)=>{
    console.log("requested delete");

    const _id = req.params.id;

    try {
        
        const deletedPost = await Post.findByIdAndDelete({_id},{new:true});
        if(!deletedPost){
            res.status(404).json('No Post Found');
        }
        else {
            res.status(200).json(deletedPost);
        }
    } catch (error) {
        res.status(408).json(error.massage);
    }
    
}
