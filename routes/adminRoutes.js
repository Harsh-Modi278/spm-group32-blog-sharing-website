// express related
const express = require("express");
const router = express.Router();

// dotenv related
const dotenv = require("dotenv");
dotenv.config({ path: "./.env", encoding: "utf-8" });

// mongoose related
const mongoose = require("mongoose");
const User = require("../models/User.js");
const Post = require("../models/Post.js");
const Comment = require("../models/Comment.js");

// jwt related
const jwt = require("jsonwebtoken");

// passport related
const passport = require("passport");

// controllers
const {
  adminPosts_get,
  adminPosts_post,
  adminPostId_put,
  adminPostId_delete,
  adminPostIdCommentId_delete,
  adminLogin_post,
} = require("../controllers/adminControllers.js");

router.get(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  adminPosts_get
);

// https://www.npmjs.com/package/passport-jwt#authenticate-requests
router.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  adminPosts_post
);

router.put(
  "/posts/:postId",
  passport.authenticate("jwt", { session: false }),
  adminPostId_put
);

router.delete(
  "/posts/:postId",
  passport.authenticate("jwt", { session: false }),
  adminPostId_delete
);

router.delete(
  "/posts/:postId/:commentId",
  passport.authenticate("jwt", { session: false }),
  adminPostIdCommentId_delete
);

router.post(
  "/login",
  passport.authenticate("jwt", { session: false }),
  adminLogin_post
);

module.exports = router;
