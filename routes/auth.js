const express = require("express");
const router = express.Router();

// @route   GET /api/auth/test
// @desc    Test the auth route
// @access  Public
router.get("/test", (req, res) => {
    res.send("Auth route working");
});

// @route   POST /api/auth/register
// @desc    Create a new user
// @access  Public
module.exports = router;