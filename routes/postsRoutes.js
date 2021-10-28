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
  postsIndex_get,
  postId_get,
  postsComment_post,
} = require("../controllers/postsControllers.js");

// "/" = "/posts/"
router.get("/", postsIndex_get);

router.get("/:postId", postId_get);

router.post(
  "/:postId/comments",
  passport.authenticate("jwt", { session: false }),
  postsComment_post
);

module.exports = router;
