// models/Answer.js
const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  content: { 
    type: String, 
    required: true 
  },
  trainerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  questionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Question", 
    required: true 
  },
  likes: { 
    type: Number, 
    default: 0 
  },
  likedBy: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }],
  comments: [{
    studentId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    text: { 
      type: String, 
      required: true 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

// Create indexes for better performance
answerSchema.index({ questionId: 1 });
answerSchema.index({ trainerId: 1 });

module.exports = mongoose.model("Answer", answerSchema);