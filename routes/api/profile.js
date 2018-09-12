const express = require("express");

const router = express.Router();

// @route   GET /api/profile/test
// @desc    profile test route, nothing functional.
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "/api/profile/test route" });
});

module.exports = router;
