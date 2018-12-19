const express = require("express");
const passport = require("passport");

// Import Models
const Post = require("../../models/Post");

const router = express.Router();

// @route   GET /api/posts/test
// @desc    posts test route, nothing functional.
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "/api/posts/test route" });
});

// @route   POST /api/posts/test
// @desc    create post
// @access  Protected
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newPost = new Post({
      title: req.body.title,
      body: req.body.body,
      audience: req.body.audience,
      author: `${req.user.fname} ${req.user.lname}`.trim(),
      userKey: req.user.id,
      avatar: req.user.avatar
    });

    newPost.save().then(post => res.status(201).json(post));
  }
);

module.exports = router;
