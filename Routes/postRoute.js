import express from "express";
import { getAllposts,createPost,updatePost,deletePost } from "../Controller/postController.js";
import { auth } from "../MiddleWare/auth.js";

const postRouter=express.Router();

postRouter.get('/',getAllposts);
postRouter.post('/',auth,createPost);
postRouter.patch('/:id',auth,updatePost);
postRouter.delete('/:id',auth,deletePost);



export default postRouter;