const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const Relation = require("../models/relation.model");

const checkToken = require("../middleware/checkToken");
//app.use("/dm", userRoutes);

router.get("/get-relations/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await Relation.find({
      userList: {
        $elemMatch: {
          userId: id,
        },
      },
    });

    res.status(200).json(response);
  } catch (error) {}
});
router.post("/post", async (req, res) => {
  try {
    const response = await Relation.findByIdAndUpdate(req.body._id, req.body);
    const data = await Relation.findById(req.body._id);
    res.status(200).json(data);
  } catch (error) {
    console.log(err);
  }
});

module.exports = { dmRoutes: router };
