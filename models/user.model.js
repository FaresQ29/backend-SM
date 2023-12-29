const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, unique: true },
  userDetails: {
    firstName: String,
    lastName: String,
    about: String,
    location: Object,
    dateOfBirth: String,
    occupation: String,
    avatar: Object,
  },
});

const User = Model("User", userSchema);

module.exports = User;
