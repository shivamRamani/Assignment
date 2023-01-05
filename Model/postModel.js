import mongoose from "mongoose";

const postschema=mongoose.Schema({

    creatorName: {
        type: String,
        unique: true,
    },
    postData: String,
    creatorId: String,

});

export const Post = mongoose.model('Post',postschema);