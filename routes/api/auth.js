const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  const { fname, lname, reg, smartCardId, email, password } = req.body;

  // Check if user exists
  User.findOne({ reg: req.body.reg }).then(user => {
    if (user) {
      return res.status(400).json({
        // prettier-ignore
        err: { reg: `An Account with Registration number: ${user.reg} already exists.` }
      });
    } else {
      // Create new User object
      newUser = new User({ fname, lname, reg, smartCardId, email, password });

      // Hash password before saving
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

// @route   POST /api/auth/login
// @desc    login / generate JWT token
// @access  Public
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Check if login request is using email or registration no
  query = username.indexOf("@") == -1 ? { reg: username } : { email: username };

  // Find user
  User.findOne(query).then(user => {
    // Check if account exists
    if (!user) {
      return res
        .status(404)
        .json({ err: { username: "Invalid Credentials." } });
    }

    // Validate Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // Create Payload for JWT
        const payload = {
          id: user.id,
          email: user.email,
          reg: user.reg,
          fname: user.fname,
          lname: user.lname
        };

        // Sign Token
        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: "2h" },
          (err, token) => {
            res.json({
              loginSuccess: true,
              token: `Bearer ${token}`
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ err: { password: "Invalid Credentials." } });
      }
    });
  });
});

module.exports = router;
