const express=require("express");
const profileRouter=express.Router()
const {UserAuth}=require("../Middlewares/auth");
const { validateEditProfileData, validateUpdatePassword } = require("../utils/Validator");

profileRouter.get("/profile/view",UserAuth,async(req,res)=>{

    try {
      const {user}=req
      res.send(user)
    } catch (error) {
     res.send(error)
    }
  
  })
 profileRouter.patch("/profile/edit",UserAuth,async(req,res)=>{
  try {
    if(!validateEditProfileData){
      throw new Error("profile data is not vaild")
    }
    const loggedInUser=req.user
    Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]))
     await loggedInUser.save();
     res.json({"message":`${loggedInUser.firstName} is updated sucessfully !!`,"data":loggedInUser})
  } catch (error) {
     res.send(error)
  }
 })

 const bcrypt = require('bcrypt');

 profileRouter.patch("/profile/updatePassword", UserAuth, async (req, res) => {
  
  const {currentPassword,newPassword}=req.body
   try {
    validateUpdatePassword(req)
    const { user } = req;
   
     const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
     if (!isPasswordValid) {
       throw new Error("Current password is incorrect.");
     }
     const saltRounds = 10;
     const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
     console.log(hashedNewPassword)
     // Update user's password
     user.password = hashedNewPassword;
     await user.save();
 
     res.status(200).send("Password updated successfully.");
   } catch (error) {
     res.status(400).send("ERROR: " + error.message);
   }
 });
 
module.exports=profileRouter