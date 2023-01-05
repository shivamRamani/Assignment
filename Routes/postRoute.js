import express from "express";
import { getAllposts,createPost,updatePost,deletePost } from "../Controller/postController.js";

const postRouter=express.Router();

postRouter.get('/',getAllposts);
postRouter.post('/',createPost);
postRouter.patch('/:id',updatePost);
postRouter.delete('/:id',deletePost);



export default postRouter;