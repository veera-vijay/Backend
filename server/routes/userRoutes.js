const userController=require("../controller/userController")
const assignmentcontroller=require("../controller/assignmentcontroller")

const  express=require("express")
const router=express.Router();
const { generateToken } = require("../utils/jwt"); // ← ADD THIS


// const { upload,
//   createAssignment,reviewSubmission,getStudentSubmissions,submitAssignment,
//   getAllAssignments,}=require("../controller/assignmentcontroller")
router.post("/user-post",userController.createUser)
router.post("/user-verify-otp", userController.verifyOTP)   //  OTP
router.post("/user-resend-otp", userController.resendOTP)   //  RESEND OTP
router.post("/user-forgot-password", userController.forgotPassword);        // Send OTP
router.post("/user-verify-reset-otp", userController.verifyForgotPasswordOtp); // Verify OTP
router.post("/user-reset-password", userController.resetPassword);          // Reset password
router.post("/user-login",userController.login)
router.post("/user-createbook",userController.book)
router.get("/user-viewall",userController.viewall)
router.put("/user-updatebook/:id", userController.updateBook)    
router.delete("/user-deletebook/:id", userController.deleteBook) 
router.post("/user-poststd",userController.createstd)
router.get("/user-getstd",userController.viewallstd)
router.put("/user-updatestd/:id", userController.updatestd);
router.delete("/user-deletestd/:id", userController.deletestd);

const { upload } = require('../controller/assignmentcontroller');



router.post("/create", upload.array("attachments", 5),assignmentcontroller.createAssignment);
router.get("/all",assignmentcontroller.getAllAssignments);
router.post("/submit",upload.single("file"), assignmentcontroller.submitAssignment);
router.get("/submissions/student/:studentId",assignmentcontroller.getStudentSubmissions);
router.put("/submissions/review/:submissionId",assignmentcontroller.reviewSubmission);
router.get("/submissions/review",assignmentcontroller.getSubmissionsForReview);
router.put("/submissions/review/:submissionId",assignmentcontroller.submitReview);

module.exports=router