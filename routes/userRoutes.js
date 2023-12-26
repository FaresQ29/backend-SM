const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { url } = require("../config.js");
const checkToken = require("../middleware/checkToken");

//app.use("/user", userRoutes);
//finds user from username string. Used in registration form to check if user exists as user is typing
router.post("/find-username", async (req, res) => {
  const { username } = req.body;
  try {
    const response = await User.findOne({ username });
    res.status(200).json(response);
  } catch (err) {
    res.status(503);
  }
});

module.exports = router;
