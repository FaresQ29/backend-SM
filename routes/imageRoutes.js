//app.use("/image", imageRoutes);

const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const cloudinary = require("cloudinary").v2;
const Multer = require("multer");
const checkToken = require("../middleware/checkToken");
//setup multer middleware
const storage = new Multer.memoryStorage();
const upload = Multer({
  storage,
});

cloudinary.config({
  cloud_name: process.env.C_API_NAME,
  api_key: process.env.C_API_KEY,
  api_secret: process.env.C_API_SECRET,
  secure: true,
});
router.post(
  "/upload-avatar-server",
  [upload.single("my_file"), checkToken],
  async (req, res) => {
    try {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await uploadImage(dataURI);
      res.json({ url: cldRes.secure_url, public_id: cldRes.public_id });
    } catch (err) {
      console.log(err);
    }
  }
);
router.post("/upload-avatar-user", checkToken, async (req, res) => {
  try {
    const response = await User.findByIdAndUpdate(req.body._id, req.body);
    console.log(response);
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
  }
});

async function uploadImage(imagePath) {
  const options = {
    use_filename: true,
    unique_filename: true,
    overwrite: true,
  };
  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    if (result && result.secure_url) {
      return result;
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = { imageRoutes: router };
