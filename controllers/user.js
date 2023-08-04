const User = require("../models/User")
const cloudinary = require("../middleware/cloudinary");

module.exports = {
  createBio: async (req,res) => {
    console.log(req.body.bio)
    try {
      await User.findOneAndUpdate({_id:req.params.id}, {
        bio: req.body.bio
      })
      console.log("Bio updated");
      res.redirect("/profile");
    } catch (error) {
      console.log(error)
    }
  },
  uploadProfilePic: async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);

      await User.findOneAndUpdate({_id:req.params.id}, {
        profilePicture: result.secure_url,
        pfpCloudinaryId: result.public_id
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (error) {
      console.log(error)
    }
  }
    }


