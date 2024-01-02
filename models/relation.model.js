const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const relationSchema = new Schema({
  userList: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      username: String,
    },
  ],
  chatLogs: [
    {
      currentRoom: String,
      author: String,
      authorId: String,
      message: String,
      timestamp: Number,
      read: Boolean,
    },
  ],
});

const Relation = Model("Relation", relationSchema);

module.exports = Relation;
