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

const addUser = (req, res, next) => {
  new User(req.body).save((err, newUser) => {
    if (err) res.send(err);
    else if (!newUser) res.send(400);
    else res.send(newUser);
    next();
  });
};

const getUser = (req, res, next) => {
  User.findById(req.params.id).then((err, user) => {
    if (err) res.send(err);
    else if (!user) res.send(404);
    else res.send(user);
    next();
  });
};

const followUser = (req, res, next) => {
  User.findById(req.body.id)
    .then((user) => {
      return user.follow(req.body.user_id).then(() => {
        return res.json({ msg: "followed" });
      });
    })
    .catch(next);
};

const getUserProfile = (req, res, next) => {
  User.findById(req.params.id)
    .then((_user) => {
      return User.find({ following: req.params.id }).then((_users) => {
        _users.forEach((user_) => {
          _user.addFollower(user_);
        });
        return Article.find({ author: req.params.id }).then((_articles) => {
          return res.json({ user: _user, articles: _articles });
        });
      });
    })
    .catch((err) => console.log(err));
};
