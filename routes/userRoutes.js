const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {url} = require("../config.js");
const checkToken = require("../middleware/checkToken");



router.put("/", checkToken, async (req, res)=>{
    const id = req.params.id
    try{


    }
    catch(err){

    }
})

module.exports = router