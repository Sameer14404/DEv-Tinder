const mongoose= require("mongoose");

const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        index:true,
        ref:"user"
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        index:true,
        ref:"user"
    },
    status:{
        type:String,
        enum:{
            values:["ignored","accepted","rejected","interested"],
            message:"{values} is incorrect type `"
        },
        require:true
    }
},{
    timestamps:true
})
connectionRequestSchema.index({fromUserId:1,toUserId:1})
connectionRequestSchema.pre("save",function (next){
if(this.fromUserId.equals(this.toUserId)){
    throw new Error("You can not sent request to own !")
}
next();
})
const ConnectionRequestModel= new mongoose.model("connectionRequest",connectionRequestSchema);
module.exports=ConnectionRequestModel;
