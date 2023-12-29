const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const { url } = require("../config.js");
const checkToken = require("../middleware/checkToken");

//app.use("/user", userRoutes);
//finds user from username string. Used in registration form to check if user exists as user is typing
router.post("/find-username", async (req, res) => {
  const { username } = req.body;
  try {
    const response = await User.findOne({ username }, "username");
    console.log(response);
    res.status(200).json(response);
  } catch (err) {
    res.status(503);
  }
});

router.put("/edit-user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body);
    res.status(201).json(updatedUser);
  } catch (err) {
    res.status(500).json({ err });
  }
});
module.exports = { userRoutes: router };
