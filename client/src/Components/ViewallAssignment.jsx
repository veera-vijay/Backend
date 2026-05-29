import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FiDownload, FiUpload, FiCheckCircle, FiClock, FiStar, 
  FiCalendar, FiUser, FiFile, FiLoader, FiAward, FiTrendingUp,
  FiPaperclip, FiSend, FiAlertCircle, FiFolder
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function ViewallAssignment() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);
  const [message, setMessage] = useState({ id: null, text: "", type: "" });
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const userStr = localStorage.getItem("user") || localStorage.getItem("userData");
    const token = localStorage.getItem("token");

    let studentId = null;

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        studentId = user.id || user._id || user.userId;
      } catch (e) {}
    }

    if (!studentId) {
      studentId = localStorage.getItem("userId") || localStorage.getItem("id") || localStorage.getItem("vid");
    }

    if (!studentId || studentId === "null" || studentId === "undefined" || !token) {
      alert("Please login again");
      window.location.href = "/login";
      return;
    }

    try {
      const assignRes = await axios.get("http://localhost:5000/api/all");
      setAssignments(assignRes.data.data);

      const subRes = await axios.get(
        `http://localhost:5000/api/submissions/student/${studentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const subMap = {};
      subRes.data.data.forEach((sub) => {
        subMap[sub.assignmentId] = sub;
      });
      setSubmissions(subMap);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (fileUrl, fileName) => {
    const url = `http://localhost:5000/${fileUrl.replace(/\\/g, "/")}`;
    window.open(url, "_blank");
  };

  const handleFileChange = (assignmentId, e) => {
    const file = e.target.files[0];
    if (file) {
      setSubmissions((prev) => ({
        ...prev,
        [assignmentId]: { ...prev[assignmentId], selectedFile: file },
      }));
    }
  };

  const handleSubmit = async (assignmentId) => {
    const submission = submissions[assignmentId];
    const file = submission?.selectedFile;

    if (!file) {
      setMessage({ id: assignmentId, text: "Please select a file", type: "error" });
      setTimeout(() => setMessage({ id: null, text: "", type: "" }), 3000);
      return;
    }

    let studentId = null;
    const userStr = localStorage.getItem("user");

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        studentId = user.id || user._id || user.userId;
      } catch (e) {}
    }

    if (!studentId) {
      studentId = localStorage.getItem("userId") || localStorage.getItem("id") || localStorage.getItem("vid");
    }

    const token = localStorage.getItem("token");

    if (!studentId || studentId === "null" || studentId === "undefined") {
      setMessage({ id: assignmentId, text: "Please login again", type: "error" });
      setTimeout(() => (window.location.href = "/login"), 2000);
      return;
    }

    setUploading(assignmentId);

    const formData = new FormData();
    formData.append("assignmentId", assignmentId);
    formData.append("studentId", studentId);
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/api/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setMessage({ id: assignmentId, text: "Assignment submitted successfully!", type: "success" });
        fetchData();
        setTimeout(() => setMessage({ id: null, text: "", type: "" }), 3000);
      }
    } catch (error) {
      setMessage({ id: assignmentId, text: error.response?.data?.message || "Submission failed", type: "error" });
      setTimeout(() => setMessage({ id: null, text: "", type: "" }), 3000);
    } finally {
      setUploading(null);
    }
  };

  const getFilteredAssignments = () => {
    if (selectedFilter === "all") return assignments;
    if (selectedFilter === "pending") {
      return assignments.filter(a => {
        const sub = submissions[a._id];
        return !sub || sub.status === "pending";
      });
    }
    if (selectedFilter === "reviewed") {
      return assignments.filter(a => submissions[a._id]?.status === "reviewed");
    }
    return assignments;
  };

  const getStats = () => {
    const total = assignments.length;
    const submitted = Object.keys(submissions).length;
    const reviewed = Object.values(submissions).filter(s => s.status === "reviewed").length;
    const pending = total - reviewed;
    return { total, submitted, reviewed, pending };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-400 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-300">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.4),transparent_50%)]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">My Assignments</h1>
          <p className="text-gray-400">Track, submit, and manage your academic work</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-dark-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Assignments</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <FiFolder className="text-purple-400 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-dark-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Submitted</p>
                <p className="text-2xl font-bold text-green-400">{stats.submitted}</p>
              </div>
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="text-green-400 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-dark-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Reviewed</p>
                <p className="text-2xl font-bold text-blue-400">{stats.reviewed}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <FiAward className="text-blue-400 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-dark-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <FiClock className="text-yellow-400 text-xl" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-6 border-b border-gray-700"
        >
          {[
            { id: "all", label: "All Assignments", count: stats.total },
            { id: "pending", label: "Pending", count: stats.pending },
            { id: "reviewed", label: "Reviewed", count: stats.reviewed }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-5 py-2 text-sm font-medium transition-all duration-200 ${
                selectedFilter === filter.id
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </motion.div>

        {/* Assignments Grid */}
        {getFilteredAssignments().length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-dark-800/50 rounded-2xl border border-gray-700"
          >
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Assignments Found</h3>
            <p className="text-gray-500">No assignments match your current filter</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {getFilteredAssignments().map((assignment, index) => {
                const submission = submissions[assignment._id];
                const isSubmitted = submission && submission.status !== undefined;
                const isReviewed = submission?.status === "reviewed";

                return (
                  <motion.div
                    key={assignment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="group bg-dark-800 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 overflow-hidden"
                  >
                    {/* Card Header */}
                    <div className="relative p-5 border-b border-gray-700">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">{assignment.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <FiUser size={12} />
                              {assignment.trainerId?.username || "Unknown"}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiCalendar size={12} />
                              Due: {new Date(assignment.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          isReviewed ? "bg-green-500/20 text-green-400" :
                          isSubmitted ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-gray-500/20 text-gray-400"
                        }`}>
                          {isReviewed ? "Reviewed" : isSubmitted ? "Submitted" : "Not Started"}
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{assignment.description}</p>

                      {/* Assignment Files */}
                      {assignment.attachments?.length > 0 && (
                        <div className="mb-4 p-3 bg-dark-700 rounded-lg">
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                            <FiPaperclip size={12} /> Materials
                          </p>
                          {assignment.attachments.map((file, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleDownload(file.fileUrl, file.fileName)}
                              className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition w-full group"
                            >
                              <FiFile size={14} />
                              <span className="flex-1 text-left">{file.fileName}</span>
                              <FiDownload size={12} className="opacity-0 group-hover:opacity-100 transition" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Submission Result */}
                      {isReviewed && submission && (
                        <div className="mb-4 p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-green-400 font-medium">Your Grade</p>
                              <p className="text-2xl font-bold text-green-400">
                                {submission.marks}/{assignment.maxMarks}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-400">Feedback</p>
                              <p className="text-sm text-gray-300">{submission.feedback || "No feedback provided"}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Upload Area */}
                      {!isReviewed && (
                        <div className={`mt-4 p-4 rounded-lg border-2 border-dashed ${
                          !isSubmitted ? "border-red-500/30 bg-red-500/5" : "border-yellow-500/30 bg-yellow-500/5"
                        }`}>
                          {!isSubmitted ? (
                            <>
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                                <p className="text-sm font-medium text-red-400">Awaiting Submission</p>
                              </div>
                              <input
                                type="file"
                                onChange={(e) => handleFileChange(assignment._id, e)}
                                accept=".pdf,.doc,.docx,.jpg,.png,.txt"
                                className="hidden"
                                id={`file-${assignment._id}`}
                              />
                              <label
                                htmlFor={`file-${assignment._id}`}
                                className="flex items-center justify-center gap-2 w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg cursor-pointer transition mb-3"
                              >
                                <FiUpload size={14} />
                                Choose File
                              </label>
                              {submission?.selectedFile && (
                                <p className="text-sm text-gray-400 mb-3 text-center">
                                  Selected: {submission.selectedFile.name}
                                </p>
                              )}
                              <button
                                onClick={() => handleSubmit(assignment._id)}
                                disabled={uploading === assignment._id}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                {uploading === assignment._id ? (
                                  <>
                                    <FiLoader className="animate-spin" size={16} />
                                    Submitting...
                                  </>
                                ) : (
                                  <>
                                    <FiSend size={14} />
                                    Submit Assignment
                                  </>
                                )}
                              </button>
                            </>
                          ) : (
                            <div className="text-center py-4">
                              <FiClock className="text-yellow-400 text-2xl mx-auto mb-2" />
                              <p className="text-sm font-medium text-yellow-400">Submitted - Pending Review</p>
                              <p className="text-xs text-gray-500 mt-1">Your work is being evaluated</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Toast Message */}
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
            {message.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
            <span className="text-white text-sm">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .bg-dark-900 { background-color: #0a0a0a; }
        .bg-dark-800 { background-color: #111111; }
        .bg-dark-700 { background-color: #1a1a1a; }
        .border-dark-700 { border-color: #1a1a1a; }
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

export default ViewallAssignment;