const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const userController = require("../controllers/user");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Comment Routes - simplified for now
router.put("/createBio/:id", ensureAuth, userController.createBio);
router.put("/uploadProfilePic/:id", upload.single("file"), userController.uploadProfilePic);

//add liking, deleting, editing etc
module.exports = router;