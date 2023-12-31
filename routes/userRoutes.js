const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const Relation = require("../models/relation.model.js");
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
//used in findUser
router.get("/all", async (req, res) => {
  try {
    const response = await User.find(
      { _id: { $ne: req.headers.userid } },
      { userDetails: 1, _id: 1, username: 1, friends: 1 }
    );
    res.status(200).json(response);
  } catch (error) {}
});

//adds a friend
router.post("/add-friend/:id", async (req, res) => {
  const otherUserId = req.params.id;
  const userId = req.body.userId;
  try {
    const otherUser = await User.findById(otherUserId);
    otherUser.friends.friendRequests.push(userId);
    const response = await User.findByIdAndUpdate(otherUserId, otherUser);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ msg: "Server error. Could not add as a friend." });
  }
});
//accepts a friend

function createRelationObj(user) {
  return {
    userId: user._id,
    username: user.username,
  };
}

router.put("/accept-friend/", async (req, res) => {
  const { otherUser, user } = req.body;
  const otherUserId = otherUser._id;
  const userObj = createRelationObj(user);
  const otherUserObj = createRelationObj(otherUser);
  try {
    //create relationship (used for socket)
    const relation = await Relation.create({
      userList: [userObj, otherUserObj],
      chatLogs: [],
    });

    const userCopy = structuredClone(user);
    userCopy.friends.friendList.push({
      userId: otherUserId,
      relId: relation._id,
    });
    userCopy.friends.friendRequests = userCopy.friends.friendRequests.filter(
      (id) => id !== otherUserId
    );
    const response = await User.findByIdAndUpdate(user._id, userCopy);
    const findOtherUser = await User.findById(otherUserId);
    findOtherUser.friends.friendList.push({
      userId: user._id,
      relId: relation._id,
    });
    await User.findByIdAndUpdate(otherUserId, findOtherUser);
    res.status(201).json({ msg: "Successfully accepted friend request" });
  } catch (err) {
    res.status(500).json({ msg: "Server error. Could not accept a friend." });
  }
});
//cancels a friend request
router.put("/cancel-friend-request/", async (req, res) => {
  const { otherUserId, userId } = req.body;
  try {
    const otherUser = await User.findById(otherUserId);
    otherUser.friends.friendRequests = otherUser.friends.friendRequests.filter(
      (id) => id != userId
    );

    await User.findByIdAndUpdate(otherUserId, otherUser);
    res.status(201).json({ msg: "Successfully cancelled friend request" });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Server error. Could not cancel friend request." });
  }
});
router.put("/remove-friend/", async (req, res) => {
  try {
    const { otherUserId, user } = req.body;
    const userCopy = structuredClone(user);
    let relId = null;

    userCopy.friends.friendList = userCopy.friends.friendList.filter((elem) => {
      if (elem.userId._id.toString() !== otherUserId) {
        return elem;
      } else {
        relId = elem.relId;
        return;
      }
    });

    await User.findByIdAndUpdate(user._id, userCopy);
    const otherUser = await User.findById(otherUserId);
    otherUser.friends.friendList = otherUser.friends.friendList.filter(
      (elem) => elem.userId.toString() !== user._id
    );
    await User.findByIdAndUpdate(otherUserId, otherUser);
    await Relation.findByIdAndDelete(relId);
    res.status(201).json({ msg: "Successfully removed friend" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error. Could not remove friend." });
  }
});

// -----------------------
router.put("/edit-user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body);
    res.status(201).json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: "Server error. Could edit user." });
  }
});
module.exports = { userRoutes: router };
