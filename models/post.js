const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, //referance to user object
    ref: "user",
  },
  date: {
    type: Date,
    default: Date.now(), //current date
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    maxlength: 500,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }], //likes of users to posts
});

module.exports = mongoose.model("post", postSchema);
