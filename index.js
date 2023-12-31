require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const { middleWareConfig, mongoConnect } = require("./config.js");
const { connectSocket } = require("./socketConfig.js");
//for configuration:
middleWareConfig(app);
//connect to mongo db and listen
mongoConnect(server);
connectSocket(server);

app.get("/test", (req, res) => {
  res.send("verified!");
});

//Auth Routes
const { authRoutes } = require("./routes/authRoutes");
app.use("/auth", authRoutes);

//User Routes
const { userRoutes } = require("./routes/userRoutes");
app.use("/user", userRoutes);

//Image Routes
const { imageRoutes } = require("./routes/imageRoutes");
app.use("/image", imageRoutes);
