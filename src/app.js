const express=require("express");
const connectDB=require("./config/database")
const app= express();
const User=require("./Models/user")
const bcrypt=require("bcrypt")
app.use(express.json())

const {validateSignUpData}=require("./utils/Validator")
// signup api post
app.post("/signup", async (req,res)=>{
 const {firstName,lastName,email,password}=req.body;
 const passwordHash= await bcrypt.hash(password,10)
  const user= new User ({
    firstName,
    lastName,
    email,
    password:passwordHash
  })
 
 try {
  validateSignUpData(req)
  await user.save()
 res.send("added Sucessfully")
 } catch (error) {
  res.status(404).send("ERROR : "+error.message)
 }
})

// login Api 
app.post("/login",async(req,res)=>{
  try {
    const {emailId,password}=req.body;
    const user=User.findOne({emailId:emailId});
    if(!user){
      throw new Error("Invaild Credential Try again")
    }
    const isPasswordValid=bcrypt.compare(password,user.password);
    if(isPasswordValid){
      res.send("Login Sucessfull !")
    }else{
      throw new Error("Invaild Credentials  !")
    }
  } catch (error) {
    res.status(404).send("ERROR : "+error.message)
  }
})
//find Api 
app.get("/user",async (req,res)=>{
  const UserEmail=req.body.emailId;
try {

  const user=await User.find({emailId:UserEmail});
  if(user.length<=0){
    res.status(404).send("User not found")
  }
  else{
    res.send(user)
  }

} catch (error) {
  res.status(400).send("something went wrong")
}
})

// feed api  Get Request
app.get("/feed",async(req,res)=>{
  try {

    const users=await User.find({});
    res.status(200).send(users)
  
  } catch (error) {
    res.status(400).send("something went wrong")
  }
})
//  Delete the user from database
 app.delete("/user",async(req,res)=>{
  const id=req.body._id

  try {
    const user= await User.findByIdAndDelete(id)
    res.send("user deleted Sucessfully !")
  } catch (error) {
    res.status(404).send("Something Went Wrong")
  }
 })

//  update the database 
app.patch("/user/:id",async(req,res)=>{
  const id=req.params.id
  const data=req.body
  try {
    const ALLOWED_UPDATES=["photoUrl","about","gender","age","skills"];
    const isUpdateAllowed=Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));
    if(!isUpdateAllowed){
      throw new Error("Update not Allowed")
    }
    if(data.skills.length>10){
      throw new Error("Max Number of Skills should be 10 ")
    }
    const user=await User.findByIdAndUpdate({_id:id},data);
    res.send("update Suceessfully");

  } catch (error) {
      res.status(404).send("Something Went Wrong")
  }
})

app.listen(3000,async()=>{
 try {
  await connectDB();
  console.log("server is listening in port number 3000")
 } catch (error) {
  console.log(error)
 }
})

