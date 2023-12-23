const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Model = mongoose.model

const userSchema = new Schema({
    name: {type: String, required: true, unique: true},
    password: { type: String, required: true },
})


const User = Model("User", userSchema)

module.exports = User