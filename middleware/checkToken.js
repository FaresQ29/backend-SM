const jwt = require("jsonwebtoken")

/*
For routes we want to protect with authentication
*/

function checkToken(req, res, next){
    const authHeader = req.headers["authorization"];
    
   const token = authHeader && authHeader.split(" ")[1]
   if(!token){
    return res.status(401).json({msg: "Access denied"})
   }
   try{
    const secret = process.env.SECRET
    const payload = jwt.verify(token, secret)
    req.payload = payload
    req.token = token
    next()
   }
   catch(err){
    res.status(400).json({msg: "Invalid token"})
   }
}


module.exports = checkToken