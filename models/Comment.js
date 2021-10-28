const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const commentObj = {
    text: {type: String, require:true},
    authorId: {type:String, required: true, ref:"User"},
    postId:{type:String, required:true, ref:"Post"},
    datePosted: {type: Date, default: Date.now()}
};

const commentSchema = new Schema(commentObj,{timestamps:true});
const Comment = mongoose.model("comment",commentSchema);

module.exports = Comment;