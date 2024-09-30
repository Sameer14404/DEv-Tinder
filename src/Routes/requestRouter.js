const express=require("express");
const requestRouter=express.Router();
const {UserAuth}=require("../Middlewares/auth");
const ConnectionRequest=require("../Models/connectionRequestSchema");
const User = require("../Models/user");
requestRouter.post("/request/send/:status/:toUserId", UserAuth,async (req,res)=>{
 
    try {
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;
        const connectionRequest= new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const isAllowed=["ignored","interested"]
        if(!isAllowed.includes(status)){
            throw new Error("Invaild request !!!")
        }
        const toUser= await User.findById(toUserId);
        if(!toUser){
            throw new Error("user is not found")
        };
        const existingConnectionrequest= await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })
        
        if(existingConnectionrequest){
            throw new Error ("connection request is already send !")
        }
        
        const data= await connectionRequest.save();
        res.json({
            "message":`${req.user.firstName} is ${status}  ${toUser.firstName}`,
            "data":data
        })
    } catch (error) {
        res.send(error.message)
    }
})

requestRouter.post("/request/review/:status/:requestId", UserAuth, async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      console.log(loggedInUser._id)
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Invalid status provided!"); // Return 400 Bad Request for invalid status
      }
     
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested" , // Fixed typo in "intrested "interested""
      });
      console.log(requestId)

      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection request not found!",
        });
      }
      connectionRequest.status = status;
      await connectionRequest.save();
      res.json({
        message: "done",
        data: connectionRequest,
      });
    } catch (error) {
      console.error(error); // Log the actual error for debugging
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message, // Send a safe error message to the client
      });
    }
  });
  



module.exports=requestRouter;