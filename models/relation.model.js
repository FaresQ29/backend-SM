const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const relationSchema = new Schema({
  userList: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Relation = Model("Relation", relationSchema);

module.exports = Relation;
