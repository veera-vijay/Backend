const mongoose=require("mongoose")
const userSchema= new mongoose.Schema(
    {
        username:String,
        password:String,
        email:String,
        gender:String,
        age:Number
    }
)



module.exports=mongoose.model("User",userSchema)

