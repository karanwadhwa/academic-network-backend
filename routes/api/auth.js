const express = require("express");

const router = express.Router();

// @route   GET /api/auth/test
// @desc    auth test route, nothing functional.
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "/api/auth/test route" });
});

module.exports = router;
