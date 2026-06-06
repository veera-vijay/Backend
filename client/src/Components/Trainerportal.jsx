import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FiMessageSquare, FiSend, FiTrash2, FiUser, 
  FiCalendar, FiThumbsUp, FiCheckCircle, FiAlertCircle,
  FiBookOpen, FiClock, FiStar, FiMapPin
} from "react-icons/fi";

function Trainerportal() {
  const [questions, setQuestions] = useState([]);
  const [answerText, setAnswerText] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/questions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data.data);
    } catch (err) {
      console.log(err);
      setMessage({ type: "error", text: "Failed to load questions" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (questionId) => {
    if (!answerText[questionId]) return;
    try {
      await axios.post(
        `http://localhost:5000/api/questions/${questionId}/answer`,
        { content: answerText[questionId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: "success", text: "Answer posted successfully!" });
      setAnswerText({ ...answerText, [questionId]: "" });
      fetchQuestions();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to post answer" });
    }
  };

  const handlePin = async (questionId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/questions/${questionId}/pin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: "success", text: "Question pinned/unpinned!" });
      fetchQuestions();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to pin/unpin" });
    }
  };

  const handleDelete = async (questionId) => {
    if (window.confirm("Delete this question permanently?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/admin/questions/${questionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage({ type: "success", text: "Question deleted!" });
        fetchQuestions();
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } catch (err) {
        setMessage({ type: "error", text: "Delete failed" });
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading questions...</p>
      </div>
    </div>
  );

  const sortedQuestions = [...questions].sort(
    (a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Toast Message */}
      {message.text && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg ${
          message.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}>
          {message.type === "success" ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold !text-pink-800 mb-2 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <FiBookOpen className="text-white text-2xl" />
                </div>
                Student Questions
              </h1>
              <p className="text-gray-500">Review and answer student doubts</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-purple-600">{questions.length}</div>
              <div className="text-gray-500 text-sm">Total Questions</div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <FiStar className="text-yellow-600 text-xl" />
              </div>
              <div className="text-xl font-bold text-gray-800">{questions.filter(q => q.isPinned).length}</div>
              <div className="text-gray-500 text-xs">Pinned</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <FiMessageSquare className="text-green-600 text-xl" />
              </div>
              <div className="text-xl font-bold text-gray-800">{questions.filter(q => q.answers?.length > 0).length}</div>
              <div className="text-gray-500 text-xs">Answered</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <FiClock className="text-blue-600 text-xl" />
              </div>
              <div className="text-xl font-bold text-gray-800">{questions.filter(q => !q.answers || q.answers.length === 0).length}</div>
              <div className="text-gray-500 text-xs">Pending</div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        {sortedQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
            <div className="text-7xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No questions yet</h3>
            <p className="text-gray-500">Students haven't posted any questions yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedQuestions.map((question) => (
              <div
                key={question._id}
                className={`bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 ${
                  question.isPinned ? 'border-2 border-yellow-400' : 'border border-gray-100'
                }`}
              >
                {/* Question Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {question.isPinned && (
                          <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                            <FiMapPin size={12} /> Pinned
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                          <FiUser size={12} /> {question.studentId?.username || "Student"}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                          <FiCalendar size={12} /> {new Date(question.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        <span className="text-gray-400 font-bold">Title{" "}:</span> {question.title}</h3>
                      <p className="text-gray-600"><span className="text-gray-400 font-bold">Content{" "}:</span>  {question.content}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handlePin(question._id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          question.isPinned
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <FiMapPin size={14} />
                        {question.isPinned ? "Unpin" : "Pin"}
                      </button>
                      <button
                        onClick={() => handleDelete(question._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-all"
                      >
                        <FiTrash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Answers Section */}
                <div className="p-6">
                  {question.answers && question.answers.length > 0 ? (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                        <span className="text-xl">👨‍🏫</span> Answers ({question.answers.length})
                      </h4>
                      {question.answers.map((answer) => (
                        <div
                          key={answer._id}
                          className="ml-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-400"
                        >
                          <p className="text-green-700 font-bold  mb-3"> <span className="text-purple-800 font-bold">Answer: </span>{answer.content}</p>
                          
                          <div className="flex items-center gap-4 mb-4">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <FiUser size={12} /> {answer.trainerId?.username || "You"}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <FiCalendar size={12} /> {new Date(answer.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Like Section */}
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1 px-3 py-1 bg-white rounded-full">
                              <FiThumbsUp className="text-blue-500 text-sm" />
                              <span className="text-sm font-medium text-blue-600">
                                {answer.likes || 0} likes
                              </span>
                            </div>
                            {answer.likedBy && answer.likedBy.length > 0 && (
                              <span className="text-xs text-gray-500">
                                Liked by: {answer.likedBy.map(s => s?.username || s).join(", ")}
                              </span>
                            )}
                          </div>

                          {/* Comments Section */}
                          {answer.comments && answer.comments.length > 0 && (
                            <div className="mt-4 ml-4 space-y-2">
                              <h5 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                                <FiMessageSquare size={14} />
                                Student Comments ({answer.comments.length})
                              </h5>
                              <div className="space-y-2">
                                {answer.comments.map((comment, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-white p-3 rounded-xl shadow-sm border-l-4 border-purple-400"
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                                        {comment.studentId?.username?.charAt(0) || "S"}
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-sm text-gray-700">
                                          <span className="font-semibold text-purple-600">
                                            {comment.studentId?.username || "Student"}:
                                          </span>{" "}
                                          {comment.text}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                          <FiClock size={10} /> {new Date(comment.createdAt).toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <div className="text-5xl mb-3">⏳</div>
                      <p className="text-gray-500">No answers yet. Be the first to answer!</p>
                    </div>
                  )}

                  {/* Add Answer Form */}
                  <div className="mt-5">
                    <textarea
                      placeholder="Write your answer here..."
                      value={answerText[question._id] || ""}
                      onChange={(e) =>
                        setAnswerText({
                          ...answerText,
                          [question._id]: e.target.value,
                        })
                      }
                      className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition bg-white"
                      rows="3"
                    />
                    <button
                      onClick={() => handleAnswer(question._id)}
                      className="mt-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:shadow-md transition-all flex items-center gap-2"
                    >
                      <FiSend size={14} />
                      Submit Answer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Trainerportal;