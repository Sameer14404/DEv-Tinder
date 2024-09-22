const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://sameer:dangi@cluster0.qeaiy.mongodb.net/devTinder");
        console.log("MongoDB connected");
    } catch (err) {
        console.error(err.message);
        
    }
};

module.exports=connectDB