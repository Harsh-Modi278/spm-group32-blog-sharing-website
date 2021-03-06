// express related
const express = require("express");
const router = express.Router();

// dotenv related
const dotenv = require("dotenv");
dotenv.config({ path: "./.env", encoding: "utf-8" });

// bcrypt related
const bcryptjs = require("bcryptjs");

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
  index_get,
  register_post,
  login_post,
  logout_post,
} = require("../controllers/indexControllers");

router.get("/", index_get);

router.post("/register", register_post);

router.post("/login", login_post);

router.post("/logout", logout_post);

module.exports = router;
