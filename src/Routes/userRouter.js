const express = require("express");
const { UserAuth } = require("../Middlewares/auth");
const ConnectionRequest = require("../Models/connectionRequestSchema"); 
const User = require("../Models/user");
const userRouter = express.Router();
const SAFE_DATA=["firstName", "lastName","age","about","skills","photoUrl","gender"]
userRouter.get("/user/requests/received", UserAuth, async (req, res) => { 
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
           status:'interested',
           toUserId: loggedInUser._id,
        }).populate("fromUserId",SAFE_DATA )
        
        res.json({
            message: "Data fetched successfully!", 
            data: connectionRequests
        });

    } catch (error) {
        console.error(error); 
        res.status(400).send("Error: " + error.message); 
    }
});

userRouter.get("/user/connections", UserAuth, async (req, res) => {
    try {
      const loggedInUser = req.user; 
      const connections = await ConnectionRequest.find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" }
        ]
      })
        .populate("fromUserId", SAFE_DATA) 
        .populate("toUserId", SAFE_DATA); 
  
     
      const data = connections.map((connection) => {
        // If the logged-in user is the sender, return the receiver's details
        if (connection.fromUserId._id.toString() === loggedInUser._id.toString()) {
          return connection.toUserId;
        }
        // Otherwise, return the sender's details
        return connection.fromUserId;
      });
  
      // Send the response with the connection data
      res.json({ data: data });
    } catch (error) {
      // Send an error response with a status code 500
      res.status(500).send({ error: error.message });
    }
  });


userRouter.get("/feed",UserAuth,async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
       let limit = parseInt(req.query.limit) || 10;
       limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
        const loggedInUser = req.user;
        const data= await ConnectionRequest.find({
            $or:[{toUserId:loggedInUser._id},{fromUserId:loggedInUser._id}]
        })
        const hideFromUser=new Set();
        data.forEach(element => {
            hideFromUser.add(element.fromUserId.toString())
            hideFromUser.add(element.toUserId.toString())
        });
        const users = await User.find({
            $and: [
              { _id: { $nin: Array.from(hideFromUser) } },
              { _id: { $ne: loggedInUser._id } },
            ],
          })
            .select(SAFE_DATA)
            .skip(skip)
            .limit(limit);
        res.json({data:users})
      
    } catch (error) {
        console.log(error)
    }
})
  
module.exports = userRouter;
