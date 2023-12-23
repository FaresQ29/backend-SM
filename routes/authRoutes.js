const express = require("express");
const router = express.Router()
const User = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const checkToken = require("../middleware/checkToken")


//to set the token expiry to 14 days
const maxAge = 14*24*60*60;


router.post("/register", async (req, res, next)=>{
    console.log(req.body);
    try{
        const response = await User.create(req.body)
        console.log(response);
    }
    catch(err){
        console.log(err);
    }
})


// Register user post request
router.post("/zregister", async (req, res, next)=>{
    const {name, password} = req.body
    if(!name) return res.status(422).json({msg: "Username is required"})
    if(!password) return res.status(422).json({msg: "Password is required"})
    if(password.length<8) return res.status(422).json({msg: "Password must be at least 8 characters"})
    const userExists = await User.findOne({name:name})
    if(userExists) return res.status(422).json({msg: "Email is already registered"})

    //create hashed password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)
    try{
        const response = await User.create({name, password: passwordHash})
        const userId = response._id;

        const token = jwt.sign(
            { id: userId },
            process.env.SECRET,
            {expiresIn: maxAge}
        )
        console.log();
        res.status(200).json( {name: response.name, password: passwordHash, userId:response._id,authToken: token, msg: "Successfully  registered"} )
    }
    catch(err){
        res.status(404).json({msg: "Could not connect to the server", err})
    }

})


// Login user post request
router.post("/login", async (req, res, next)=>{
    const { name, password} = req.body
    //Validations for email, pass and check if user actually exists in db
    //if(!/^([\w.*-]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email)) return res.status(422).json({msg: "Check email format"})
    if(!name) return res.status(422).json({msg: "Username is required"})
    if(!password) return res.status(422).json({msg: "Password is required"})

    //check if name exists
    const user = await User.findOne({name})
    if(!user){return res.status(422).json({msg: "User doesn't exist."})}

    try{
        //check if password matches
        const checkPassword = await bcrypt.compare(password, user.password)
        if(!checkPassword){return res.status(422).json({msg: "Invalid password."})}
        const token = jwt.sign({id: user._id}, process.env.SECRET)
        res.status(200).json({authToken: token, name:user.name, userId:user._id, msg: "Successfully logged in"})

    }
    catch(err){
        res.status(401).json({msg: "Cannot login"})
    }
})

router.get('/verify', checkToken, async (req, res, next) => {    
    const {id} = req.payload
    try{
        const user = await User.findById(id)
        res.status(200).json({token: req.token, user});
        console.log("token worked");
    }
    catch(err){
        console.log("token didn't work")
        res.status(400).json({msg: "could not verify user"})
    }
});


module.exports = router