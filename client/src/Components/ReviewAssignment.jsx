import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiDownload,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiFile,
  FiStar,
  FiSend,
  FiX,
  FiAlertCircle,
  FiAward,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function ReviewAssignment() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [filter, setFilter] = useState("pending");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/submissions/review",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setSubmissions(res.data.data);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Failed to load submissions" });
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (submissionId) => {
    if (!marks) {
      setMessage({ type: "error", text: "Please enter marks" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/submissions/review/${submissionId}`,
        { marks: parseInt(marks), feedback },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setMessage({
        type: "success",
        text: "Review submitted successfully!",
      });
      setSelectedSub(null);
      setMarks("");
      setFeedback("");
      fetchSubmissions();

      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "❌ Failed to submit review" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const getFilteredSubmissions = () => {
    if (filter === "pending") {
      return submissions.filter((s) => s.status === "pending");
    }
    if (filter === "reviewed") {
      return submissions.filter((s) => s.status === "reviewed");
    }
    return submissions;
  };

  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    reviewed: submissions.filter((s) => s.status === "reviewed").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading submissions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-300 via-red-300 to-pink-300 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <b className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Review Submissions
          </b>
          <p className="text-gray-500">
            Grade and provide feedback to students
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.total}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiFile className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FiClock className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Reviewed</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.reviewed}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 mb-6 border-b border-gray-200"
        >
          {[
            {
              id: "pending",
              label: "Pending",
              count: stats.pending,
              color: "yellow",
            },
            {
              id: "reviewed",
              label: "Reviewed",
              count: stats.reviewed,
              color: "green",
            },
            { id: "all", label: "All", count: stats.total, color: "purple" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-5 py-2 text-sm font-medium transition-all duration-200 ${
                filter === tab.id
                  ? `text-${tab.color}-600 border-b-2 border-${tab.color}-600`
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </motion.div>

        {/* Message Toast */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 ${
                message.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {message.type === "success" ? (
                <FiCheckCircle className="text-white" />
              ) : (
                <FiAlertCircle className="text-white" />
              )}
              <span className="text-white text-sm">{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submissions List */}
        {getFilteredSubmissions().length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Submissions
            </h3>
            <p className="text-gray-400">
              No {filter === "pending" ? "pending" : ""} submissions found
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-5">
            {getFilteredSubmissions().map((sub, index) => (
              <motion.div
                key={sub._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div
                  className={`px-5 py-4 ${
                    sub.status === "pending"
                      ? "bg-gradient-to-r from-yellow-50 to-orange-50"
                      : "bg-gradient-to-r from-green-50 to-emerald-50"
                  }`}
                >
                  <div className="flex flex-wrap justify-between items-start gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {sub.assignmentId?.title || "Unknown Assignment"}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiUser size={14} />
                          {sub.studentId?.username || "Unknown Student"}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock size={14} />
                          Submitted:{" "}
                          {new Date(sub.submittedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {sub.status === "reviewed" ? (
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <FiCheckCircle size={14} />
                        Reviewed - {sub.marks} marks
                      </div>
                    ) : (
                      <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <FiClock size={14} />
                        Pending Review
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                        Assignment Details
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        Max Marks:{" "}
                        <span className="font-semibold">
                          {sub.assignmentId?.maxMarks || "N/A"}
                        </span>
                      </p>
                      <button
                        onClick={() =>
                          window.open(
                            `http://localhost:5000/${sub.fileUrl?.replace(/\\/g, "/")}`,
                            "_blank",
                          )
                        }
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
                      >
                        <FiDownload size={14} />
                        Download {sub.fileName}
                      </button>
                    </div>

                    {sub.status === "pending" && (
                      <button
                        onClick={() => setSelectedSub(sub)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                      >
                        Review Submission
                      </button>
                    )}
                  </div>

                  {/* Review Form */}
                  {selectedSub?._id === sub._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-5 pt-4 border-t border-gray-100"
                    >
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <FiAward className="text-purple-600" />
                        Grade Submission
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        <div className="flex-1 min-w-[150px]">
                          <label className="block text-xs text-gray-500 mb-1">
                            Marks
                          </label>
                          <input
                            type="number"
                            placeholder={`Out of ${sub.assignmentId?.maxMarks}`}
                            value={marks}
                            onChange={(e) => setMarks(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div className="flex-[2] min-w-[200px]">
                          <label className="block text-xs text-gray-500 mb-1">
                            Feedback (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="Provide feedback to student..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div className="flex gap-2 items-end">
                          <button
                            onClick={() => handleReview(sub._id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                          >
                            <FiSend size={14} />
                            Submit
                          </button>
                          <button
                            onClick={() => setSelectedSub(null)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1"
                          >
                            <FiX size={14} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Reviewed Info */}
                  {sub.status === "reviewed" && sub.marks && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-green-600 font-semibold">
                          Grade: {sub.marks}/{sub.assignmentId?.maxMarks}
                        </span>
                        {sub.feedback && (
                          <span className="text-gray-500">
                            💬 {sub.feedback}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default ReviewAssignment;
