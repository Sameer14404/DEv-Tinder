const jwt= require("jsonwebtoken");
const User=require("../Models/user")


const UserAuth=async(req,res,next)=>{
    try {
        const {token}=req.cookies;
        if(!token){
         res.status(401).send("Please login !!")
        }
        const decodedMessage=await jwt.verify(token,"DevTinder");
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