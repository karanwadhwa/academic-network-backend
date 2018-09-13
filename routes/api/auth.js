const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../../models/User");

const router = express.Router();

// @route   GET /api/auth/test
// @desc    auth test route, nothing functional.
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "/api/auth/test route" });
});

// @route   POST /api/auth/register
// @desc    register account
// @access  Public
router.post("/register", (req, res) => {
  User.findOne({ reg: req.body.reg }).then(user => {
    if (user) {
      return res.status(400).json({
        // prettier-ignore
        err: { reg: `An Account with Registration number: ${user.reg} already exists.` }
      });
    } else {
      newUser = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        reg: req.body.reg,
        smartCardId: req.body.smartCardId,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.status(201).json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

module.exports = router;
