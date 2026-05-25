// Route for /post, /like, /edit, /update
const express = require("express");
const router = express.Router();
const isLoggedin = require("../middleware/isLoggedin");

const {
  createPost,
  likePost,
  getEditpost,
  updatePost,
  getStats,
} = require("../controllers/postController");

router.post("/post", isLoggedin, createPost);
router.get("/post/:id/like", isLoggedin, likePost); //need to add proper restful convention for eg /posts/:id/like, added ✅
router.get("/post/:id/edit", isLoggedin, getEditpost);
router.post("/post/:id/update", isLoggedin, updatePost);

// for aggregation routes
router.get("/stats", isLoggedin, getStats);

module.exports = router;
