const express= require("express");
const authRouter=express.Router();
const User=require("../Models/user");
const { validateSignUpData } = require("../utils/Validator");
const bcrypt = require("bcrypt");


// Signup API (POST)
 authRouter.post("/signup", async (req, res) => {
    const { firstName, lastName, emailId, password,age,gender } = req.body;
  
    try {
      validateSignUpData(req);
  
      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({
        firstName,
        lastName,
        emailId,
        age,
        gender,
        password: passwordHash,
      });
  
      await user.save();
      res.send("User added successfully");
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  });
 
// Login API (POST)
authRouter.post("/login", async (req, res) => {
    const { emailId, password } = req.body;
  
    try {
      const user = await User.findOne({ emailId });
      if (!user) {
        throw new Error("Invalid Credentials. Try again");
      }
  
      // const isPasswordValid = await bcrypt.compare(password, user.password);
          const isPasswordValid=user.validatePassword(password)
      if (isPasswordValid) {
  
        // const token= await jwt.sign({_id:user._id},"DevTinder")
        const token= await user.getJWT()
        res.cookie("token",token);
        res.send("Login Successful!");
      } else {
        throw new Error("Invalid Credentials!");
      }
    } catch (error) {
      res.status(404).send("ERROR: " + error.message);
    }
  });

  authRouter.post("/logout",(req,res)=>{
    res.cookie("token",null,{
      expires:new Date(Date.now())
    });
    res.send("Logout Sucessfully !!")
  })

  

module.exports=authRouter