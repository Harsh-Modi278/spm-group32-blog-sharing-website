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
  saveArticle,
  addArticle,
  getAll,
  commentArticle,
  getArticle,
  clapArticle,
} = require("../controllers/postsControllers.js");

const multipart = require("connect-multiparty");
const multipartWare = multipart();

router.route("/").get(getAll);

router.route("/").post(multipartWare, addArticle);

router.route("/clap").post(clapArticle);

router.route("/comment").post(commentArticle);

router.route("/:id").get(getArticle);

module.exports = router;
