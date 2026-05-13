const userRoutes=require("./routes/userRoutes")
const express=require("express")
const dotenv=require("dotenv")
const cors=require("cors")
const bcrypt = require('bcryptjs');
const connectDb=require("./config/db")
const app=express();
dotenv.config();
connectDb()


app.use(express.json())
app.use(cors());

app.use("/api",userRoutes)
app.get("/",(req,res)=>{
    res.send("Backend is running")
})

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`server is running  in ${PORT}`)
})