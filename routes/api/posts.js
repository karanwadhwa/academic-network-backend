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

// @route   DELETE /api/posts/id=:id
// @desc    delete post by id, only accessible by the post author or admin
// @access  Protected
router.delete(
  "/id=:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // check if the request is coming from the post author or admin
        if (
          post.userKey.toString() !== req.user.id &&
          req.user.userType.toString() !== "admin"
        ) {
          return res.status(401).json({ error: "Unauthorized." });
        }

        // delete post
        post
          .remove()
          .then(post =>
            res.json({ success: true, msg: "Post deleted.", post })
          );
      })
      .catch(err => res.status(400).json({ err, error: "post not found." }));
  }
);

// @route   POST /api/posts/like/id=:id
// @desc    add or remove like to a post
// @access  Protected
router.post(
  "/like/id=:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({
      _id: req.params.id,
      audience: { $in: req.user.subscriptions }
    })
      .then(post => {
        // check to see if the user has already liked the post
        // remove users like if they have already liked the post
        // find the index of users like in the likes array
        const removeIndex = post.likes
          .map(item => item.userKey.toString())
          .indexOf(req.user.id);

        if (removeIndex == -1) {
          // Add user to likes array
          post.likes.push({ userKey: req.user.id });
        } else {
          // remove entry from likes[removeIndex]
          post.likes.splice(removeIndex);
        }

        // Save and return post
        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res
          .status(404)
          .json({
            err,
            error:
              "The post youre trying to access does not exist, or you are not a part of its intended audience."
          })
      );
  }
);

module.exports = router;
