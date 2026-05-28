const Assignment = require("../models/assignment");
const Submission = require("../models/submission");
const User = require("../models/user");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ============ FILE UPLOAD CONFIGURATION ============
const uploadDir = "uploads/assignments";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "text/plain",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF, DOC, DOCX, JPG, PNG allowed."));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter,
});

// ============ CREATE ASSIGNMENT  ============
const createAssignment = async (req, res) => {
  try {
    const { title, description, deadline, maxMarks, trainerId } = req.body;
 console.log("req.body:", req.body);
 console.log("req.body.trainerId:", req.body.trainerId);
 console.log("req.files:", req.files);
 console.log("==========================");

    

    
    

    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map((file) => ({
        fileName: file.originalname,
        fileUrl: file.path,
        fileType: file.mimetype,
        uploadedAt: new Date(),
      }));
    }

    const assignment = await Assignment.create({
      title,
      description,
      deadline,
      maxMarks,
      trainerId,
      attachments,
      status: "active",
    });

    res.status(201).json({
      success: true,
      message: "Assignment created successfully!",
      data: assignment,
    });
  } catch (error) {
    console.error("Create assignment error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET ALL ASSIGNMENTS ============
const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("trainerId", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
console.log("Upload created:", upload ? "YES" : "NO");





// ============ SUBMIT ASSIGNMENT (Student) ============
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Check if already submitted
    const existing = await Submission.findOne({ assignmentId, studentId });
    if (existing && existing.status !== 'resubmit') {
      return res.status(400).json({ success: false, message: "Assignment already submitted" });
    }

    const submission = await Submission.create({
      assignmentId,
      studentId,
      fileUrl: req.file.path,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      submittedAt: new Date(),
      status: 'pending'
    });

    res.status(201).json({ success: true, message: "Assignment submitted!", data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ GET STUDENT SUBMISSIONS ============
const getStudentSubmissions = async (req, res) => {
  try {
    const { studentId } = req.params;
    const submissions = await Submission.find({ studentId });
    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ REVIEW SUBMISSION (Trainer) ============
const reviewSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marks, feedback } = req.body;

    const submission = await Submission.findByIdAndUpdate(
      submissionId,
      {
        status: 'reviewed',
        marks,
        feedback,
        reviewedAt: new Date()
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Submission reviewed!", data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Get all submissions for trainer
// Get all submissions for review
// Get all submissions for review
const getSubmissionsForReview = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("assignmentId", "title maxMarks")
      .populate("studentId", "username email");
    
    res.status(200).json({ 
      success: true, 
      data: submissions 
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Submit review - SIMPLE VERSION
const submitReview = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marks, feedback } = req.body;

    console.log("=== REVIEW DEBUG ===");
    console.log("Submission ID:", submissionId);
    console.log("Marks:", marks);
    console.log("Feedback:", feedback);

    // Update using findByIdAndUpdate
    const updated = await Submission.findByIdAndUpdate(
      submissionId,
      {
        status: 'reviewed',
        marks: marks,
        feedback: feedback,
        reviewedAt: new Date()
      },
      { new: true }  // Return updated document
    );

    if (!updated) {
      return res.status(404).json({ 
        success: false, 
        message: "Submission not found" 
      });
    }

    console.log("Updated successfully:", updated);

    res.status(200).json({ 
      success: true, 
      message: "Review submitted!", 
      data: updated 
    });

  } catch (error) {
    console.error("Review error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports={
     createAssignment,
     getAllAssignments ,
     upload,reviewSubmission,getStudentSubmissions,submitAssignment,getSubmissionsForReview,submitReview
}