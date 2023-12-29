const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkToken = require("../middleware/checkToken");
//app.use("/auth", authRoutes);
//to set the token expiry to 14 days
const maxAge = 14 * 24 * 60 * 60;

router.post("/register", async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username) {
    return res
      .status(400)
      .json({ msg: "Username must be at least 3 characters" });
  }
  if (username.includes("@")) {
    return res
      .status(400)
      .json({ msg: "Username cannot have the @ character." });
  }
  if (/\s/.test(username)) {
    return res.status(400).json({ msg: "Username cannot have spaces." });
  }
  if (!password) return res.status(400).json({ msg: "Enter a password" });
  if (password.length < 5)
    return res
      .status(400)
      .json({ msg: "Password must be at least 5 characters" });

  const userExists = await User.findOne({ username: username });
  if (userExists) {
    return res.status(409).json({ msg: "Username is already registered" });
  }
  if (email && !email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
    return res.status(400).json({ msg: "Check email format" });
  }
  const emailExists = await User.findOne({ email: email });

  if (email && emailExists) {
    return res.status(409).json({ msg: "Email is already registered" });
  }

  try {
    //validation passed
    //create hashed password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const formObj = Object.assign(
      { username, password: passwordHash },
      defaultRegisterValues
    );

    console.log(formObj);
    if (email) {
      formObj.email = email;
    }
    const response = await User.create(formObj);
    const userId = response._id;
    const token = jwt.sign({ id: userId }, process.env.SECRET, {
      expiresIn: maxAge,
    });
    res.status(201).json({
      username: response.username,
      email: response.email,
      password: passwordHash,
      lynxToken: token,
      msg: "Successfully Registered",
    });
  } catch (err) {
    res.status(500).json({
      msg: "Could not register due to a server error. Please try again.",
      err,
    });
  }
});

// Login user post request
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username)
    return res
      .status(400)
      .json({ msg: "Username must be at least 3 characters" });
  if (!password)
    return res.status(400).json({ msg: "Please enter your password" });

  const user = await User.findOne({ username });
  const email = await User.findOne({ email: username });
  if (!user && !email) {
    return res.status(404).json({ msg: "Username/email doesn't exist." });
  }

  try {
    //check if password matches
    const checkPassword = await bcrypt.compare(
      password,
      user ? user.password : email.password
    );

    if (!checkPassword) {
      return res.status(400).json({ msg: "Invalid password." });
    }
    const token = jwt.sign(
      { id: user ? user._id : email._id },
      process.env.SECRET
    );
    res.status(200).json({
      lynxToken: token,
      username: user ? user.username : email.username,
      userId: user ? user._id : email._id,
      msg: "Successfully logged in",
    });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Cannot login due to server error. Please try again." });
  }
});

router.get("/verify", checkToken, async (req, res, next) => {
  const { id } = req.payload;
  try {
    const user = await User.findById(id);
    res.status(200).json({ token: req.token, user });
  } catch (err) {
    res.status(409).json({ msg: "Could not verify user token." });
  }
});

const defaultRegisterValues = {
  userDetails: {
    firstName: "",
    lastName: "",
    about: "",
    location: null,
    dateOfBirth: "",
    occupation: "",
    avatar: null,
  },
};

module.exports = { authRoutes: router };
