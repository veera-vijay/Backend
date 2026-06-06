import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FiPlus, FiEdit2, FiTrash2, FiMessageSquare, 
  FiSend, FiX, FiCheckCircle, FiAlertCircle, FiCalendar, 
  FiUser, FiHeart, FiBookOpen, FiTrendingUp, FiClock 
} from "react-icons/fi";

function Studentportal() {
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [commentText, setCommentText] = useState({});
  const [liked, setLiked] = useState({});

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const studentId = user?.id;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/questions/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data.data || []);
      
      // IMPORTANT: Initialize liked state from database (permanent)
      const likedState = {};
      if (res.data.data) {
        res.data.data.forEach(question => {
          if (question.answers) {
            question.answers.forEach(answer => {
              // Check if current student has liked this answer
              if (answer.likedBy && answer.likedBy.includes(studentId)) {
                likedState[answer._id] = true;
              } else {
                likedState[answer._id] = false;
              }
            });
          }
        });
      }
      setLiked(likedState);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load questions" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        await axios.put(
          `http://localhost:5000/api/questions/${editingQuestion._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showMessage("success", "Question updated successfully!");
      } else {
        await axios.post(
          "http://localhost:5000/api/questions",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showMessage("success", "Question posted successfully!");
      }
      setShowForm(false);
      setEditingQuestion(null);
      setFormData({ title: "", content: "" });
      fetchQuestions();
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Error");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ show: true, id });
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/questions/${deleteModal.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage("success", "Question deleted successfully!");
      fetchQuestions();
      setDeleteModal({ show: false, id: null });
    } catch (err) {
      showMessage("error", "Delete failed");
    }
  };

  // FIXED: Like function that updates UI AND saves to database
  const handleLike = async (answerId) => {
    const isCurrentlyLiked = liked[answerId];
    
    // Update UI immediately
    setLiked(prev => ({ ...prev, [answerId]: !isCurrentlyLiked }));
    
    try {
      // Send request to backend
      const response = await axios.post(
        `http://localhost:5000/api/answers/${answerId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the like count in questions state
      setQuestions(prevQuestions => {
        return prevQuestions.map(question => ({
          ...question,
          answers: question.answers?.map(answer => 
            answer._id === answerId 
              ? { 
                  ...answer, 
                  likes: response.data.likes,
                  likedBy: response.data.liked ? [...(answer.likedBy || []), studentId] 
                          : (answer.likedBy || []).filter(id => id !== studentId)
                }
              : answer
          )
        }));
      });
      
    } catch (err) {
      // Revert on error
      setLiked(prev => ({ ...prev, [answerId]: isCurrentlyLiked }));
      showMessage("error", "Failed to like");
    }
  };

  const handleAddComment = async (answerId) => {
    if (!commentText[answerId]?.trim()) return;
    
    try {
      await axios.post(
        `http://localhost:5000/api/answers/${answerId}/comment`,
        { text: commentText[answerId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText({ ...commentText, [answerId]: "" });
      fetchQuestions();
      showMessage("success", "Comment added!");
    } catch (err) {
      showMessage("error", "Failed to add comment");
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your questions...</p>
      </div>
    </div>
  );

  const myQuestions = questions.filter((q) => {
    const questionStudentId = q.studentId?._id || q.studentId;
    return questionStudentId === studentId;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiTrash2 className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Question?</h3>
              <p className="text-gray-500 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ show: false, id: null })}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold !text-black mb-2 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <FiBookOpen className="text-white text-2xl" />
                </div>
                My Questions
              </h1>
              <p className="text-gray-500">Post your doubts and get answers from expert trainers</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-purple-600">{myQuestions.length}</div>
              <div className="text-gray-500 text-sm">Total Questions</div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <FiTrendingUp className="text-green-600 text-xl" />
              </div>
              <div className="text-xl font-bold text-gray-800">{myQuestions.filter(q => q.answers?.length > 0).length}</div>
              <div className="text-gray-500 text-xs">Answered</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <FiMessageSquare className="text-blue-600 text-xl" />
              </div>
              <div className="text-xl font-bold text-gray-800">{myQuestions.reduce((sum, q) => sum + (q.answers?.length || 0), 0)}</div>
              <div className="text-gray-500 text-xs">Total Answers</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <FiHeart className="text-red-600 text-xl" />
              </div>
              <div className="text-xl font-bold text-gray-800">{Object.keys(liked).filter(key => liked[key] === true).length}</div>
              <div className="text-gray-500 text-xs">Likes Given</div>
            </div>
          </div>
        </div>

        {/* Ask Question Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              setEditingQuestion(null);
              setFormData({ title: "", content: "" });
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <FiPlus size={20} />
            Ask New Question
          </button>
        </div>

        {/* Ask Question Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {editingQuestion ? "Edit Question" : "Ask a Question"}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingQuestion(null);
                    setFormData({ title: "", content: "" });
                  }}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <FiX size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Enter your question title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 mb-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                  required
                />
                <textarea
                  placeholder="Describe your doubt in detail..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 mb-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                  rows="4"
                  required
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-md transition"
                  >
                    {editingQuestion ? "Update Question" : "Post Question"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingQuestion(null);
                      setFormData({ title: "", content: "" });
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Questions List */}
        {myQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
            <div className="text-7xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No questions yet</h3>
            <p className="text-gray-500 mb-6">Click "Ask New Question" to post your first doubt!</p>
            <button
              onClick={() => {
                setEditingQuestion(null);
                setFormData({ title: "", content: "" });
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2"
            >
              <FiPlus /> Ask Your First Question
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {myQuestions.map((question) => (
              <div
                key={question._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
              >
                {/* Question Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {question.isPinned && (
                          <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                            📌 Pinned
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                          <FiUser size={12} /> Student Question
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                          <FiCalendar size={12} /> {formatDate(question.createdAt)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2"> <span className="text-purple-500 font-bold"> Title{"  "}:</span> {question.title}</h3>
                      <p className="text-gray-600"> <span className="text-purple-500 font-bold"> Content{"  "}:</span> {question.content}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setEditingQuestion(question);
                          setFormData({ title: question.title, content: question.content });
                          setShowForm(true);
                        }}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      >
                       <div className="flex justify-center items-center gap-2 px-4 py-1 bg-green-500 text-white rounded-full"> 
                        <FiEdit2 size={18} /> Edit
                        </div>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(question._id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                                               <div className="flex justify-center items-center gap-2 px-4  py-1 bg-red-500 text-white rounded-full"> 

                        <FiTrash2 size={18} /> Delete
                        </div>

                      </button>
                    </div>
                  </div>
                </div>

                {/* Answers Section */}
                <div className="p-6">
                  {question.answers && question.answers.length > 0 ? (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-green-700 flex items-center gap-2">
                        <span className="text-xl">👨‍🏫</span> Answers ({question.answers.length})
                      </h4>
                      {question.answers.map((answer) => (
                        <div
                          key={answer._id}
                          className="ml-4 p-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-300 rounded-xl border-l-4 border-green-400"
                        >
                          <p className="text-green-500 mb-3 font-bold">Answer:{"  " }{answer.content}</p>
                          
                          <div className="flex items-center gap-4 mb-4">
                            <span className="text-xsl text-black flex items-center gap-1">
                              <FiUser size={20} /> {answer.trainerId?.username || "Trainer"}
                            </span>
                            <span className="text-xsl text-black flex items-center gap-1">
                              <FiCalendar size={20} /> {formatDate(answer.createdAt)}
                            </span>
                          </div>

                          {/*  PERMANENT LIKE BUTTON - Color saves permanently */}
                          <button
                            onClick={() => handleLike(answer._id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                              liked[answer._id] === true 
                                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md' 
                                : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500 border border-gray-200'
                            }`}
                          >
                            <FiHeart size={16} className={liked[answer._id] === true ? 'fill-white' : ''} />
                            <span className="text-sm font-medium">
                              {liked[answer._id] === true ? 'Liked' : 'Like'}
                            </span>
                          </button>

                          {/* Comments Section */}
                          {answer.comments && answer.comments.length > 0 && (
                            <div className="mt-5 ml-6 space-y-3">
                              <h5 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                                <FiMessageSquare size={14} />
                                Comments ({answer.comments.length})
                              </h5>
                              <div className="space-y-2">
                                {answer.comments.map((comment, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-white p-3 rounded-xl shadow-sm border-l-4 border-purple-400"
                                  >
                                    <div className="flex items-start gap-3">
                                     
                                      <div className="flex-1">
                                        <p className="text-sm text-gray-500 font-bold">
                                          <span className="font-semibold text-purple-600">You:</span> {comment.text}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                          <FiClock size={10} /> {formatDate(comment.createdAt)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Add Comment */}
                         <div className="mt-5 flex gap-2">
  <input
    type="text"
    placeholder="Write a comment..."
    value={commentText[answer._id] || ""}
    onChange={(e) =>
      setCommentText({
        ...commentText,
        [answer._id]: e.target.value,
      })
    }
    className="flex-1 bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
    onKeyPress={(e) => {
      if (e.key === 'Enter') {
        handleAddComment(answer._id);
      }
    }}
  />
  <button
    onClick={() => handleAddComment(answer._id)}
    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:shadow-md transition-all flex items-center gap-2"
  >
    <FiSend size={14} />
    Send
  </button>
</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-xl">
                      <div className="text-5xl mb-3">⏳</div>
                      <p className="text-gray-500">No answers yet. Waiting for trainer response...</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Studentportal;