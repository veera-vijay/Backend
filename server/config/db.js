const mongoose=require("mongoose")
const connectDB= async()=>{
    try{
         await mongoose.connect(process.env.MONGO_URL)
         console.log("Mongodb connect successfully");
         
    }
    catch(err){
           console.error(err);
           
    }
}
module.exports=connectDB