const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const postObj = {
    title: {type: String, require:true},
    text: {type: String, require:true},
    authorId: {type:String, required: true, ref:"User"},
    isPublished: {type: Boolean, default: false},
    datePosted: {type: Date, default: Date.now()},
    commentsArray: {type:Array,default:[]}
};

const postSchema = new Schema(postObj,{timestamps:true});
const Post = mongoose.model("post",postSchema);

module.exports = Post;