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

// dotenv related
const dotenv = require("dotenv");

const adminPosts_get = (req, res, next) => {
  // console.log("here: ", { user: req.user });
  User.findById(req.user.id)
    .then((user) => {
      // console.log({ user });
      if (!user.isAdmin) return res.sendStatus(403);
      Post.find({})
        .sort({ createdAt: -1 })
        .then((result) => res.json(result));
    })
    .catch((err) => console.error(err));
};

const adminPosts_post = (req, res, next) => {
  // Now passport has attached jwtpayload to the req.user
  // and we can get current user from req.user by deserialization
  // console.log({user:req.user});
  User.findById(req.user.id)
    .then((user) => {
      if (!user.isAdmin) res.sendStatus(403);
      else {
        const newPostInstance = new Post({
          title: req.body.title,
          text: req.body.text,
          authorId: req.user.id,
        });
        newPostInstance
          .save()
          .then(() => res.json(newPostInstance))
          .catch((err) => console.error(err));
      }
    })
    .catch((err) => console.error(err));
};

const adminPostId_put = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user || !user.isAdmin) res.sendStatus(403);
      else {
        // console.log({params:req.params});
        // const update = {title:req.body.title||,text:req.body.text,isPublished:req.body.isPublished||false};
        const update = {};
        if (req.body.title && req.body.title.length > 0) {
          update.title = req.body.title;
        }
        if (req.body.text && req.body.text.length > 0) {
          update.text = req.body.text;
        }
        if (req.body.hasOwnProperty("isPublished")) {
          update.isPublished = req.body.isPublished || false;
        }
        // console.log({ update });
        Post.findByIdAndUpdate(req.params.postId, update, { new: true })
          .then((result) => {
            // console.log({ result });
            return res.json(result);
          })
          .catch((err) => console.error(err));
      }
    })
    .catch((err) => console.error(err));
};

const adminPostId_delete = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user.isAdmin) res.sendStatus(403);
      Post.findByIdAndDelete({ _id: req.params.postId })
        .then((result) => res.sendStatus(200))
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
};

const adminPostIdCommentId_delete = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user.isAdmin) res.sendStatus(403);
      else {
        Post.findById(req.params.postId)
          .then((post) => {
            // console.log(req.params);
            const temp = post.commentsArray.filter(
              (comment) => comment._id != req.params.commentId
            );
            // console.log(temp.length);
            Comment.findByIdAndDelete(req.params.commentId)
              .then(() => {
                Post.findByIdAndUpdate(
                  req.params.postId,
                  { commentsArray: temp },
                  { new: true }
                )
                  .then((result) => res.json(result))
                  .catch((err) => console.error(err));
              })
              .catch((err) => console.error(err));
          })
          .catch((err) => console.error(err));
      }
    })
    .catch((err) => console.error(err));
};

const adminLogin_post = (req, res, next) => {
  console.log({ user: req.user });
  User.findById(req.user.id)
    .then((user) => {
      // console.log({user});
      if (user.isAdmin) {
        res.json({ msg: "You are already an admin" });
      } else {
        const adminKey = req.body.password;
        if (adminKey === process.env.ADMIN_KEY) {
          req.user.isAdmin = true;
          const filter = { _id: req.user.id };
          const update = { isAdmin: true };
          User.findByIdAndUpdate(filter, update, { new: true })
            .then((result) => res.json({ msg: "You are now an admin" }))
            .catch((err) => console.error(err));
        } else {
          res.json({ msg: "Invalid password" });
        }
      }
    })
    .catch((err) => console.error(err));
};

module.exports = {
  adminPosts_get,
  adminPosts_post,
  adminPostId_put,
  adminPostId_delete,
  adminPostIdCommentId_delete,
  adminLogin_post,
};
