const express = require("express");
const connectDB = require("./config/database");
const cookieParser= require("cookie-parser")
const cors= require("cors")

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
const authRouter=require("./Routes/authRouter")
const profileRouter=require("./Routes/profileRouter");
const requestRouter = require("./Routes/requestRouter");
const userRouter=require("./Routes/userRouter")
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);




// Start the server
app.listen(3000, async () => {
  try {
    await connectDB();
    console.log("Server is listening on port 3000");
  } catch (error) {
    console.log(error);
  }
});
