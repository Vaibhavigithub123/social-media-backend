// routes for /, /login, /register, /logout
const express = require("express");
const router = express.Router();
const isLoggedin = require("../middleware/isLoggedin");

const {
  getHome,
  getLogin,
  getLogout,
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController");

//All Routes
router.get("/", getHome);
router.get("/login", getLogin);

router.get("/logout", getLogout);

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", isLoggedin, getProfile);

module.exports = router;
