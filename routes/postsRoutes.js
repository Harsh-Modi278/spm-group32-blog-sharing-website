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
const articlecontroller = require("../controllers/postsControllers.js");

const multipart = require("connect-multiparty");
const multipartWare = multipart();

router.route("/articles").get(articlecontroller.getAll);

router.route("/article").post(multipartWare, articlecontroller.addArticle);

router.route("/article/clap").post(articlecontroller.clapArticle);

router.route("/article/comment").post(articlecontroller.commentArticle);

router.route("/article/:id").get(articlecontroller.getArticle);

module.exports = router;
