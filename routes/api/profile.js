const express = require("express");
const passport = require("passport");

// Import Models
const User = require("../../models/User");
const StudentProfile = require("../../models/StudentProfile");

const router = express.Router();

// @route   GET /api/profile/test
// @desc    profile test route, nothing functional.
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "/api/profile/test route" });
});

// @route   GET /api/profile
// @desc    fetches currently logged in users profile
// @access  Protected
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    StudentProfile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "Profile not found.";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(400).json(err));
  }
);

module.exports = router;
