const mongoose = require("mongoose");

//Schema creation
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  name: String,
  age: {
    type: Number,
    min: 18,
    max: 100,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false, //to exclude password field when fetching user data from database for security purpose.
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ], //refencing to post schema
});

//collection creation
module.exports = mongoose.model("user", userSchema);
