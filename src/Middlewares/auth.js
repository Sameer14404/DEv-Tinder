const jwt= require("jsonwebtoken");
const User=require("../Models/user")
require('dotenv').config()

const UserAuth=async(req,res,next)=>{
    try {
        const {token}=req.cookies;
        
        if(!token){
          return res.status(401).send("please Login !")
        }
        const decodedMessage=await jwt.verify(token,process.env.SECRET_KEY);
        const {_id}=decodedMessage;
        const user= await User.findById(_id);
        if(!user){
            throw new Error("User is not exsist")
        }
        req.user=user;
        
        next()
    } catch (error) {
        res.status(400).send("ERROR: "+error.message)
    }

}

module.exports={
    UserAuth
}