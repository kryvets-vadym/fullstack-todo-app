const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validateRegisterInput = require("../validation/registerValidation");
const jwt = require("jsonwebtoken");
const requiresAuth = require("../middleware/permissions");

// @route   POST /api/auth/register
// @desc    Create a new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    //check for existing user
    const existingUser = await User.findOne({
      email: new RegExp("^" + req.body.email + "$", "i"),
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "There is already a user with this email" });
    }
    //hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    //create a new user
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });

    //saved the user to the database
    const savedUser = await newUser.save();

    const payload = { userId: savedUser._id };

    //jwt creating
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //cookie creation
    res.cookie("access-token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    const userToReturn = { ...savedUser._doc };
    delete userToReturn.password;

    //return the new user
    return res.json(userToReturn);

    //errors
  } catch (err) {
    console.log(err);

    res.status(500).send(err.message);
  }
});

// @route   POST /api/auth/login
// @desc    Login user and return the access token
// @access  Public
router.post("/login", async (req, res) => {
  try {
    //search a user in the database
    const user = await User.findOne({
      email: new RegExp("^" + req.body.email + "$", "i"),
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "There was a problem with your login credentials" });
    }
    //password comparison
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordMatch) {
      return res
        .status(400)
        .json("There was a problem with your login credentials");
    }

    const payload = { userId: user._id };

    //jwt creating
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //cookie creation
    res.cookie("access-token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    const userToReturn = { ...user._doc };
    delete userToReturn.password;

    return res.json({
      token: token,
      user: userToReturn,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).send(err.message);
  }
});

// @route   GET /api/auth/current
// @desc    Return the currently authed user
// @access  Private
router.get("/current", requiresAuth, (req, res) => {
  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }

  return res.json(req.user);
});

// @route   PUT /api/auth/logout
// @desc    Logout user and clear a cookie
// @access  Private
router.put("/logout", async (req, res) => {
  try {
    res.clearCookie("access-token");
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

module.exports = router;
