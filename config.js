const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

//links
const mongoServer = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.smk19mf.mongodb.net/SM-Project`;
const dbConfig = {
  url: mongoServer,
  database: "SM-Project",
  imgBucket: "photos",
};

const PORT = process.env.PORT;

// const url = `http://localhost:${PORT}`;
const url = `http://192.168.1.68:${PORT}`;

// Middleware configuration
function middleWareConfig(app) {
  app.use(cors());
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded());
}

//connect to mongoose
async function mongoConnect(server) {
  try {
    const response = await mongoose.connect(mongoServer);
    console.log("Connected to mongoose");
    server.listen(PORT, () => {
      console.log("Listening");
    });
  } catch (err) {
    console.log("could not connect to mongoose" + err);
  }
}

module.exports = { middleWareConfig, mongoConnect, url, dbConfig };
