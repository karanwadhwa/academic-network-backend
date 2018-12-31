const express = require("express");
const passport = require("passport");

// Import Models
const Post = require("../../models/Post");

// Load input validation
const validateCreatePostInput = require("../validation/posts/createPost");

const router = express.Router();

// @route   GET /api/posts/test
// @desc    posts test route, nothing functional.
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "/api/posts/test route" });
});

// @route   POST /api/posts/
// @desc    create post
// @access  Protected
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Input Validation
    const { errors, isValid } = validateCreatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      title: req.body.title,
      body: req.body.body,
      audience: req.body.audience,
      author: `${req.user.fname} ${req.user.lname}`.trim(),
      userKey: req.user.id,
      avatar: req.user.avatar
    });

    newPost
      .save()
      .then(post => res.status(201).json(post))
      .catch(err => res.status(500).json(err));
  }
);

// @route   GET /api/posts/
// @desc    get all posts accessible by the logged in user
// @access  Protected
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.find({ audience: { $in: req.user.subscriptions } })
      .sort({ date: -1 })
      .then(posts => res.json(posts))
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET /api/posts/id=:id
// @desc    get post by id if its accessible by the logged in user
// @access  Protected
router.get(
  "/id=:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({
      _id: req.params.id,
      audience: { $in: req.user.subscriptions }
    })
      .then(posts => {
        // If a post with valid id is found but the user isnt the intended audience
        // because Post.find returns an empty array [] if the query results 0 posts
        // findOne fixes it since it does not respond with an array but a single object.
        // keeping this around regardless.
        if (posts.length === 0) {
          return res.status(400).json({
            error:
              "The post youre trying to access does not exist, or you are not a part of its intended audience."
          });
        }
        res.json(posts);
      })
      .catch(err =>
        res.status(404).json({
          err,
          error:
            "The post youre trying to access does not exist, or you are not a part of its intended audience."
        })
      );
  }
);

module.exports = router;
