const Question = require("../models/Questions");
const Answer = require("../models/Answer");

// ============ CREATE QUESTION (Student only) ============
const createQuestion = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // Try all possible ID fields
    const studentId = req.user.id || req.user._id || req.user.userId;
    
    console.log("Using studentId:", studentId);
    
    const question = await Question.create({
      title,
      content,
      studentId,
    });

    res.status(201).json({
      success: true,
      message: "Question posted successfully!",
      data: question,
    });
  } catch (error) {
    console.error("Create question error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET ALL QUESTIONS ============
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ isActive: true })
      .populate("studentId", "username email")

      .sort({ isPinned: -1, createdAt: -1 });

    // Get answers for each question
    const questionsWithAnswers = await Promise.all(
      questions.map(async (question) => {
        const answers = await Answer.find({
          questionId: question._id,
          isActive: true,
        }).populate("trainerId", "username");

        return {
          ...question.toObject(),
          answers,
        };
      }),
    );

    res.status(200).json({
      success: true,
      count: questionsWithAnswers.length,
      data: questionsWithAnswers,
    });
  } catch (error) {
    console.error("Get questions error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET SINGLE QUESTION ============
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id).populate(
      "studentId",
      "username email",
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const answers = await Answer.find({
      questionId: id,
      isActive: true,
    }).populate("trainerId", "username");

    res.status(200).json({
      success: true,
      data: { ...question.toObject(), answers },
    });
  } catch (error) {
    console.error("Get question error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ EDIT QUESTION (Owner only) ============
const editQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    if (question.studentId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own questions",
      });
    }

    question.title = title;
    question.content = content;
    await question.save();

    res.status(200).json({
      success: true,
      message: "Question updated successfully!",
      data: question,
    });
  } catch (error) {
    console.error("Edit question error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ DELETE QUESTION (Owner only - Soft delete) ============
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    if (question.studentId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own questions",
      });
    }

    question.isActive = false;
    await question.save();

    res.status(200).json({
      success: true,
      message: "Question deleted successfully!",
    });
  } catch (error) {
    console.error("Delete question error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ ADD ANSWER (Trainer only) ============
const addAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;
    const trainerId = req.user.id;

    console.log("Adding answer:", { questionId, content, trainerId });

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const answer = await Answer.create({
      content,
      trainerId,
      questionId,
    });

    res.status(201).json({
      success: true,
      message: "Answer added successfully!",
      data: answer,
    });
  } catch (error) {
    console.error("Add answer error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ LIKE ANSWER (Student only) ============
// ============ LIKE ANSWER (Student only) ============
const likeAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;

    console.log("========== LIKE ANSWER ==========");
    console.log("Answer ID:", id);
    console.log("Student ID:", studentId);

    // Find the answer
    const answer = await Answer.findById(id);
    
    if (!answer) {
      console.log("Answer not found!");
      return res.status(404).json({
        success: false,
        message: "Answer not found",
      });
    }

    console.log("Answer found:", answer._id);
    console.log("Current likes:", answer.likes);
    console.log("Current likedBy:", answer.likedBy);

    // Check if already liked
    const alreadyLiked = answer.likedBy.includes(studentId);
    console.log("Already liked:", alreadyLiked);

    if (alreadyLiked) {
      // Unlike
      answer.likes--;
      answer.likedBy = answer.likedBy.filter(
        (id) => id.toString() !== studentId
      );
      console.log("Removed like. New likes:", answer.likes);
    } else {
      // Like
      answer.likes++;
      answer.likedBy.push(studentId);
      console.log("Added like. New likes:", answer.likes);
    }

    await answer.save();
    console.log("Answer saved successfully!");

    res.status(200).json({
      success: true,
      message: alreadyLiked ? "Like removed" : "Liked!",
      likes: answer.likes,
      liked: !alreadyLiked,
    });
  } catch (error) {
    console.error("Like answer error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ ADD COMMENT ON ANSWER (Student only) ============
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const studentId = req.user.id;

    console.log("Add comment request:", { answerId: id, text, studentId });

    const answer = await Answer.findById(id);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: "Answer not found",
      });
    }

    answer.comments.push({
      studentId,
      text,
      createdAt: new Date(),
    });

    await answer.save();

    res.status(201).json({
      success: true,
      message: "Comment added!",
      data: answer.comments,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ PIN QUESTION (Trainer only) ============
const pinQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    question.isPinned = !question.isPinned;
    await question.save();

    res.status(200).json({
      success: true,
      message: question.isPinned ? "Question pinned!" : "Question unpinned!",
      isPinned: question.isPinned,
    });
  } catch (error) {
    console.error("Pin question error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ DELETE ANY QUESTION (Admin/Trainer only) ============
const adminDeleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    await Question.findByIdAndDelete(id);
    // Also delete all answers for this question
    await Answer.deleteMany({ questionId: id });

    res.status(200).json({
      success: true,
      message: "Question permanently deleted!",
    });
  } catch (error) {
    console.error("Admin delete error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ DELETE ANY ANSWER (Admin/Trainer only) ============
const adminDeleteAnswer = async (req, res) => {
  try {
    const { id } = req.params;

    const answer = await Answer.findById(id);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: "Answer not found",
      });
    }

    await Answer.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Answer deleted!",
    });
  } catch (error) {
    console.error("Admin delete answer error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ GET MY QUESTIONS (Student) ============
const getMyQuestions = async (req, res) => {
  try {
    const studentId = req.user.id;

    console.log("Fetching questions for student:", studentId);

    const questions = await Question.find({
      studentId,
      isActive: true,
    }).sort({ createdAt: -1 });

    // Get answers for each question with full details
    const questionsWithAnswers = await Promise.all(
      questions.map(async (question) => {
        const answers = await Answer.find({
          questionId: question._id,
          isActive: true,
        })
          .populate("trainerId", "username")
          .populate("likedBy", "username")  // ✅ Add this - shows who liked
          .populate("comments.studentId", "username"); // ✅ Add this - shows comment authors

        return {
          ...question.toObject(),
          answers: answers || [],
        };
      })
    );

    console.log(`Found ${questionsWithAnswers.length} questions with answers`);

    res.status(200).json({
      success: true,
      count: questionsWithAnswers.length,
      data: questionsWithAnswers,
    });
  } catch (error) {
    console.error("Get my questions error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  editQuestion,
  deleteQuestion,
  addAnswer,
  likeAnswer,
  addComment,
  pinQuestion,
  adminDeleteQuestion,
  adminDeleteAnswer,
  getMyQuestions,
};
