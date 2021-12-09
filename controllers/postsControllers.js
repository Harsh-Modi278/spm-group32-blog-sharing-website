// express related
const express = require("express");

// mongoose related
const mongoose = require("mongoose");
const User = require("../models/User.js");
const Article = require("../models/Article.js");
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

const saveArticle = (obj) => {
  new Article(obj).save((err, article) => {
      if (err)
          res.send(err)
      else if (!article)
          res.send(400)
      else {
          return article.addAuthor(req.body.author_id).then((_article) => {
              return res.send(_article)
          })
      }
      next();
  })
}

const addArticle = (req, res, next) => {
  let { text, title, claps, description } = req.body
  if (req.files.image) {
      cloudinary.uploader.upload(req.files.image.path, (result) => {
          let obj = { text, title, claps, description, feature_img: result.url != null ? result.url : '' }
          saveArticle(obj)
          
      },{
          resource_type: 'image',
          eager: [
              {effect: 'sepia'}
          ]
      })
  }else {
      saveArticle({ text, title, claps, description, feature_img: '' })
  }

const getAll = (req, res, next) => {
  Article.find(req.params.id)
  .populate('author')
  .populate('comments.author').exec((err, article)=> {
      if (err)
          res.send(err)
      else if (!article)
          res.send(404)
      else
          res.send(article)
      next();            
  })
}

const commentArticle = (req, res, next) => {
  Article.findById(req.body.article_id).then((article)=> {
      return article.comment({
          author: req.body.author_id,
          text: req.body.comment
      }).then(() => {
          return res.json({msg: "Done"})
      })
  }).catch(next);
}

const getArticle = (req, res, next) => {
  Article.findById(req.params.id)
  .populate('author')
  .populate('comments.author').exec((err, article)=> {
      if (err)
          res.send(err)
      else if (!article)
          res.send(404)
      else
          res.send(article)
      next()            
  })
}

module.exports = { postsIndex_get, postId_get, postsComment_post };
