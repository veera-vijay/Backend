const userRoutes=require("./routes/userRoutes")
const express=require("express")
const dotenv=require("dotenv")
const cors=require("cors")
const bcrypt = require('bcryptjs');
const connectDb=require("./config/db")
const { verifyToken } = require("./utils/jwt");


const app=express();
dotenv.config();
connectDb()
require("dotenv").config();

// DEBUG - Add this temporarily
console.log("=== CHECKING ENV VARIABLES ===");
console.log("EMAIL_USER:", process.env.EMAIL_USER || "❌ NOT FOUND");
console.log(
  "EMAIL_PASS:",
  process.env.EMAIL_PASS ? "✅ FOUND" : "❌ NOT FOUND",
);
console.log("PORT:", process.env.PORT);
console.log("================================");


app.use(express.json())
app.use(cors());

app.use("/api",userRoutes)
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    success: true,
    message: "You have access to protected route!",
    user: req.user,
  });
});
app.get("/",(req,res)=>{
    res.send("Backend is running")
})

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`server is running  in ${PORT}`)
})