import { Post } from "../Model/postModel.js";

const getPosts = async () =>{
    try{
        const allPosts= await Post.aggregate([
            {
                $match : {}
            }
        ]);
        return allPosts;
    } catch(error){
        throw error;
    }
}

const updatePost = async (postId,postData) =>{
    try{
        const updatedPost= await Post.aggregate([
            {
                $match : {_id: postId}
            },
            {
                $set : {...postData}
            }
        ]);
        return updatedPost[0];
    } catch(error){
        throw error;
    }
}

const deletePost = async (postId) =>{
    try{
        const deletedPost = await Post.findByIdAndDelete(postId,{new:true});
        return deletedPost;
    } catch(error){
        throw error;
    }
}


export default {getPosts,updatePost,deletePost}