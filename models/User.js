const mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  provider: String,
  provider_id: String,
  token: String,
  provider_pic: String,
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});
UserSchema.methods.follow = (user_id_) => {
  if (this.following.indexOf(user_id_) === -1) {
    this.following.push(user_id_);
  }
  return this.save();
};
UserSchema.methods.addFollower = (follower_) => {
  this.followers.push(follower_);
};
module.exports = mongoose.model("User", UserSchema);
