// express related
const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes.js");
const postsRoutes = require("./routes/postsRoutes.js");
const indexRoutes = require("./routes/indexRoutes.js");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const helmet = require("helmet");

// cors related
const cors = require("cors");

// dotenv related
const dotenv = require("dotenv");
dotenv.config({ path: "./.env", encoding: "utf-8" });

// mongoose related
const mongoose = require("mongoose");
const User = require("./models/User.js");
const Post = require("./models/Post.js");
const Comment = require("./models/Comment.js");

// bcrypt related
const bcryptjs = require("bcryptjs");

// jwt related
const jwt = require("jsonwebtoken");

// passport related
const passport = require("passport");
require("./config/passport-config.js")(passport);

// logging
app.use(morgan("tiny")); // logging framework

// connecting node.js app with database
const dbURI = process.env.DBURI;
mongoose
  .connect(dbURI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => console.error({ err }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// enable all cors requests
app.use(cors());

// middleware
app.use(bodyParser.json());
app.use(helmet());

// logger middleware for all requests
// app.use((req, res, next) => {
//   console.log();
//   console.log("New request made");
//   console.log("method:", req.method);
//   console.log("path:", req.path);
//   console.log("req.body", req.body);
//   console.log("req.params", req.params);
//   // console.log("headers: ", req.headers);
//   next();
// });

app.use("/api", indexRoutes);

app.use("/api/posts", postsRoutes);

app.use("/api/user", userRoutes);

// serve static assets if in production
if (process.env.NODE_ENV === "production") {
  console.log(process.env.NODE_ENV);
  // set static folder
  // location where index.html is located
  app.use(express.static("client/build"));

  app.get("*", (req, res, next) => {
    // location where index.html is located
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
