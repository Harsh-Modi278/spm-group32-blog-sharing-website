// express related
const express = require("express");

// mongoose related
const mongoose = require("mongoose");
const User = require("../models/User.js");
const Post = require("../models/Post.js");
const Comment = require("../models/Comment.js");

// jwt related
const jwt = require("jsonwebtoken");

// passport related
const passport = require("passport");

const postsIndex_get = (req, res, next) => {
  res.redirect("/api");
};

const postId_get = (req, res, next) => {
  // console.log(req.params);
  Post.findById(req.params.postId)
    .then((result) => res.json(result))
    .catch((err) => console.error(err));
};

const postsComment_post = (req, res, next) => {
  // Now passport has attached jwtpayload to the req.user
  // and we can get current user from req.user by deserialization
  // console.log({user:req.user});
  // console.log(req.params);
  const newCommentInstance = new Comment({
    text: req.body.text,
    postId: req.params.postId,
    authorId: req.user.id,
  });
  // console.log(newCommentInstance);
  let commentsArray = [];
  Post.findById(req.params.postId)
    .then((post) => {
      // console.log({ post });
      commentsArray = post.commentsArray;
      commentsArray.push(newCommentInstance);

      const update = { commentsArray: commentsArray };
      Post.findByIdAndUpdate(req.params.postId, update, { new: true })
        .then((result) => {
          newCommentInstance
            .save()
            .then(() => res.json(newCommentInstance))
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
};

module.exports = { postsIndex_get, postId_get, postsComment_post };
