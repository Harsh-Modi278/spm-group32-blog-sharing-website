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

const userController = require("../controllers/userController.js");

router.route("/:id").get(usercontroller.getUser);

router.route("/profile/:id").get(usercontroller.getUserProfile);

router.route("/").post(usercontroller.addUser);

router.route("/follow").post(usercontroller.followUser);