const userController=require("../controller/userController")
const  express=require("express")
const router=express.Router();
const { verifyToken } = require("../utils/jwt"); // ← ADD THIS

router.post("/user-post",userController.createUser)
router.post("/user-login",userController.login)
router.post("/user-createbook",userController.book)
router.get("/user-viewall",userController.viewall)
router.put("/user-updatebook/:id", userController.updateBook)    
router.delete("/user-deletebook/:id", userController.deleteBook) 
router.post("/user-poststd",userController.createstd)
router.get("/user-getstd",userController.viewallstd)
router.put("/user-updatestd/:id", userController.updatestd);
router.delete("/user-deletestd/:id", userController.deletestd); 
module.exports=router