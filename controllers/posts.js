const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/comment")

//functions
function determineRank(postCount) {
  if (postCount >= 1 && postCount <= 2) {
    return "Beginner Explorer";
  } else if (postCount >= 3 && postCount <= 5) {
    return "Novice Explorer";
  } else if (postCount >= 6 && postCount <= 8) {
    return "Advanced Explorer";
  } else if (postCount >= 9 && postCount <= 10) {
    return "Expert Explorer";
  } else {
    return "Unknown Explorer";
  }
}

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user, determineRank });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const filter = req.params.filter
      if(filter === 'oldest'){
        const posts = await Post.find().sort({ createdAt: 1  }).lean();
        res.render("feed.ejs", { posts: posts });
      }
      else if(filter === 'top'){
        const posts = await Post.find().sort({ likes: -1 }).lean();
        res.render("feed.ejs", { posts: posts });
        
      }else if(filter === 'new'){
        const posts = await Post.find().sort({ createdAt: -1  }).lean();
        res.render("feed.ejs", { posts: posts });
      }
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({post: req.params.id}).sort({ createdAt: "desc" }).lean();
      res.render("post.ejs", { post: post, user: req.user, comments: comments });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
