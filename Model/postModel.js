import mongoose from "mongoose";

const postschema=mongoose.Schema({

    creatorName: {
        type: String,
    },
    postData: String,
    creatorId: String,

});

export const Post = mongoose.model('Post',postschema);