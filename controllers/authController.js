//logic for register,login, logout
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const postModel = require("../models/post");

//home controller
const getHome = (req, res) => {
  res.render("index");
};

//login controller
const getLogin = (req, res) => {
  res.render("login");
};

//User registration auth
const registerUser = async (req, res) => {
  try {
    let { username, name, age, email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(409).json({ message: "User already exist" });
    }
    let encryptedPassword = await bcrypt.hash(password, 10);
    let usercreated = await userModel.create({
      username,
      name,
      age,
      email,
      password: encryptedPassword,
    }); //user created in mongo

    //created jwt token along with user and sent it in the form of cookie to client/browser
    // here instead of sending whole data in jwttoken we are just sending email and userid for creating token
    let jwttoken = jwt.sign(
      { email: usercreated.email, userid: usercreated._id },
      process.env.JWT_SECRET,
    );
    res.cookie("token", jwttoken);
    // res.redirect("/profile");
    res.status(201).json({ message: "User created succesfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in registering user", error: err.message });
  }
};

//User login auth
const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    let user = await userModel.findOne({ email }).select("+password"); //as we have set select false for password in usermodel to exclude it when fetching user data from database for security purpose. so we need to explicitly select it here to compare it with password sent by user during login
    if (!user) {
      return res
        .status(404)
        .json({ message: "User doesn't exist plz register first" });
      res.redirect("/index");
    }
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    let jwttoken = jwt.sign(
      { email: user.email, userid: user._id },
      process.env.JWT_SECRET,
    );
    res.cookie("token", jwttoken);
    res.redirect("/profile");
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in logging in user", error: err.message });
  }
};

//Profile controller
const getProfile = async (req, res) => {
  try {
    //pagination for posts of user in profile page
    const page = parseInt(req.query.page) || 1; // Get the current page number from query parameters/ default to 1
    const postsPerPage = 2; // Number of posts to display per page
    const skip = (page - 1) * postsPerPage; // Calculate the number of posts to skip based on the current page

    let user = await userModel
      .findOne({ email: req.user.email })
      // .populate("posts")
      .lean(); //added lean() to fetch data which just needs to be displayed and not modified if the data is
    //modified for like user.save(), user.posts.push() then lean will not work
    // console.log(user);
    // to show actual post of user who created it instead of showing id as we add referancing of posts in usermodel we populate it to show all posts/data
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await postModel
      .find({ user: user._id })
      .sort({ createdAt: -1 }) // Sort posts by creation date in descending order
      .skip(skip) // Skip previous page
      .limit(postsPerPage) // show only these posts
      .lean();

    const totalPosts = await postModel.countDocuments({ user: user._id }); // Get total number of posts for pagination
    const totalPages = Math.ceil(totalPosts / postsPerPage); // Calculate total pages needed for pagination

    res.render("profile", {
      user,
      posts,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in fetching user profile", error: err.message });
  }
};

const getLogout = (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
};

module.exports = {
  getHome,
  getLogin,
  getLogout,
  registerUser,
  loginUser,
  getProfile,
};
