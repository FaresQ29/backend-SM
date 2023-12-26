require("dotenv").config();
const express = require("express");
const app = express();

const { middleWareConfig, mongoConnect } = require("./config.js");

//for configuration:
middleWareConfig(app);
//connect to mongo db and listen
mongoConnect(app);

app.get("/test", (req, res) => {
  res.send("verified!");
});

//Auth Routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

//User Routes
const userRoutes = require("./routes/userRoutes");
app.use("/user", userRoutes);
