// logic for create,like,edit,update post model
const postModel = require("../models/post");
const userModel = require("../models/user");

const createPost = async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    // this content is sent from post profile page name="content" property just like we process form and sent its value as let {name,email,pass} =  req.body
    let { content } = req.body;

    //post creation
    let post = await postModel.create({
      user: user._id,
      content,
    });

    //to let user know that post is created
    user.posts.push(post._id); //we pushed the post created by user into our posts array which is in userschema
    await user.save();
    res.redirect("/profile");
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in creating post", error: err.message });
  }
};

//post like
const likePost = async (req, res) => {
  try {
    let post = await postModel.findOne({ _id: req.params.id }).populate("user");
    // console.log(post);
    // console.log(req.user.userid)

    //check if user is already present in likes array of post if not then push it and if already present then remove it from likes array of post
    if (post.likes.indexOf(req.user.userid) === -1) {
      post.likes.push(req.user.userid);
    } else {
      post.likes.splice(post.likes.indexOf(req.user.userid), 1);
    }
    await post.save();
    res.redirect("/profile");
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in liking post", error: err.message });
  }
};

const getEditpost = async (req, res) => {
  try {
    let post = await postModel
      .findOne({ _id: req.params.id })
      .populate("user")
      .lean(); //added lean() to fetch data which just needs to be displayed and not modified

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // await post.save();
    res.render("edit", { post });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in getting post for edit", error: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    let post = await postModel.findOneAndUpdate(
      { _id: req.params.id },
      { content: req.body.content },
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // await post.save();
    res.redirect("/profile");
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in updating post", error: err.message });
  }
};

//aggregation pipeline for stats
const getStats = async (req, res) => {
  try {
    //counted total user and posts first
    const totalUsers = await userModel.countDocuments();
    const totalPosts = await postModel.countDocuments();

    //aggregation pipe;ine
    //stage-1 : group all post by user and count total no of posts each user has

    const userStats = await postModel.aggregate([
      {
        $group: {
          _id: "$user", // group by user field in post document
          postCount: { $sum: 1 }, // add 1 for every post in this group
        },
      },

      //stage-2 : lookup to get user details from user collection

      {
        $lookup: {
          from: "users",
          localField: "_id", // _id here is the user ObjectId from $group
          foreignField: "_id", //id from user collection
          as: "userInfo", // array with collective stages output
        },
      },

      //stage-3 flatten userInfo array into single object such that we can access userdetails from obj instead of looping over userInfo array
      {
        $unwind: "$userInfo",
      },

      //stage - 4 sort by postCount highest first
      {
        $sort: { postCount: -1 },
      },

      //stage 5 return fields we want to show in response
      {
        $project: {
          _id: 0, //hide
          name: "$userInfo.name",
          username: "$userInfo.username",
          postCount: 1, //show
        },
      },
    ]);

    //console.log("userStats →", userStats);
    res.render("stats", { totalUsers, totalPosts, userStats });
  } catch (err) {
    res
      .status(404)
      .json({ message: "Error in getting stats", error: err.message });
  }
};

module.exports = { createPost, likePost, getEditpost, updatePost, getStats };
