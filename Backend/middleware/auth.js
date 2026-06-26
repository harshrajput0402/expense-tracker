import User from '../models/usermodel.js' ;

import jwt from 'jsonwebtoken' ; 
const jwt_secret =process.env.JWT_KEY;

export default async function authMiddleware(req,res,next){

    // grab the token first 
    const authHeader = req.headers.authorization;
   if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return res.status(400).json({
        success: false,
        message: "Not authorised or token is missing"
    });
}
    const token = authHeader.split(" ")[1];

    try{
    const payload = jwt.verify(token,jwt_secret);
    const user = await User.findById(payload.id).select("-password");
    if(!user){
        res.status(404).json({
            success:false,
            message:"User does not exixt."
        })
    }
    req.user = user ;
    next();
    }
    catch(err){
        console.log("JWT verification failed here ",err);
    res.status(400).json({
        success:false,
        message:"Middleware not response"
    })
    }

} 