// express related
const express = require("express");

// mongoose related
const mongoose = require("mongoose");
const User = require("../models/User.js");
const Post = require("../models/Post.js");
const Comment = require("../models/Comment.js");

// bcrypt related
const bcryptjs = require("bcryptjs");

// jwt related
const jwt = require("jsonwebtoken");

// passport related
const passport = require("passport");

const index_get = (req, res, next) => {
  Post.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .then((result) => res.json(result))
    .catch((err) => console.error(err));
};

const register_post = (req, res, next) => {
  // check if the user with same email already exists
  // if no then send success message and add user to db else send failure message
  const user = { email: req.body.email, password: req.body.password };
  let errors = [];
  if (req.body.password !== req.body.password2) {
    errors.push("Passowrds don't match");
  }
  if (req.body.password.length < 6) {
    errors.push("Password must be of atleast 6 characters");
  }
  // console.log(errors);
  User.find({ email: req.body.email })
    .then((result) => {
      // console.log(typeof result);
      if (result.length > 0) {
        errors.push("The email is already registered");
        res.json(JSON.stringify(errors));
      } else {
        if (errors.length > 0) {
          // console.log("here");
          res.json(JSON.stringify(errors));
        } else {
          // creating a new user instance
          const newUserInstance = new User({
            email: req.body.email,
            password: req.body.password,
          });
          bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(newUserInstance.password, salt, (err1, hash) => {
              if (err1) throw err1;
              newUserInstance.password = hash;
              newUserInstance
                .save()
                .then((result) => {
                  res.json({ msg: "You are successfully registered" });
                })
                .catch((err2) => console.error(err2));
            });
          });
        }
      }
    })
    .catch((err) => console.error(err));
};

const login_post = (req, res, next) => {
  // check is the email is registered or not?

  //disabling session:
  // After successful authentication, Passport will establish a persistent login session.
  // This is useful for the common scenario of users accessing a web application via a browser.
  // However, in some cases, session support is not necessary.
  // For example, API servers typically require credentials to be supplied with each request.
  // When this is the case, session support can be safely disabled by setting the session option to false.

  // In this example, note that authenticate() is called from within the route handler, rather than being used as route middleware.
  // This gives the callback access to the req and res objects through closure.
  // If authentication failed, user will be set to false. If an exception occurred, err will be set.
  // An optional info argument will be passed, containing additional details provided by the strategy's verify callback.
  // The callback can use the arguments supplied to handle the authentication result as desired.
  // Note that when using a custom callback, it becomes the application's responsibility to establish a session (by calling req.login()) and send a response.
  passport.authenticate("local", { session: false }, (err, user, info) => {
    // console.log({ err, user, info });
    if (err) return res.send(err);
    if (!user) return res.sendStatus(401);
    // we don't want to use sessions
    // const user = {email:req.body.email,password:req.body.password};

    const accessToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({ accessToken, isAdmin: user.isAdmin });
  })(req, res, next);
};

const logout_post = (req, res, next) => {
  // user must be already logged in(option to logout only available if the user is logged in)
  res.json({
    msg: "You are logged out",
    redirect: "/",
  });
};

module.exports = { index_get, register_post, login_post, logout_post };
