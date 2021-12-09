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

const saveArticle = (obj) => {
  new Article(obj).save((err, article) => {
    if (err) res.send(err);
    else if (!article) res.send(400);
    else {
      return article.addAuthor(req.body.author_id).then((_article) => {
        return res.send(_article);
      });
    }
    next();
  });
};

const addArticle = (req, res, next) => {
  let { text, title, claps, description } = req.body;
  if (req.files.image) {
    cloudinary.uploader.upload(
      req.files.image.path,
      (result) => {
        let obj = {
          text,
          title,
          claps,
          description,
          feature_img: result.url != null ? result.url : "",
        };
        saveArticle(obj);
      },
      {
        resource_type: "image",
        eager: [{ effect: "sepia" }],
      }
    );
  } else {
    saveArticle({ text, title, claps, description, feature_img: "" });
  }
};

const getAll = (req, res, next) => {
  Article.find(req.params.id)
    .populate("author")
    .populate("comments.author")
    .exec((err, article) => {
      if (err) res.send(err);
      else if (!article) res.send(404);
      else res.send(article);
      next();
    });
};

const commentArticle = (req, res, next) => {
  Article.findById(req.body.article_id)
    .then((article) => {
      return article
        .comment({
          author: req.body.author_id,
          text: req.body.comment,
        })
        .then(() => {
          return res.json({ msg: "Done" });
        });
    })
    .catch(next);
};

const getArticle = (req, res, next) => {
  Article.findById(req.params.id)
    .populate("author")
    .populate("comments.author")
    .exec((err, article) => {
      if (err) res.send(err);
      else if (!article) res.send(404);
      else res.send(article);
      next();
    });
};

const clapArticle = (req, res, next) => {
  Article.findById(req.body.article_id)
    .then((article) => {
      return article.clap().then(() => {
        return res.json({ msg: "Done" });
      });
    })
    .catch(next);
};

module.exports = {
  saveArticle,
  addArticle,
  getAll,
  commentArticle,
  getArticle,
  clapArticle,
};
