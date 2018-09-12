const express = require("express");

const router = express.Router();

// @route   GET /api/posts/test
// @desc    posts test route, nothing functional.
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "/api/posts/test route" });
});

module.exports = router;
