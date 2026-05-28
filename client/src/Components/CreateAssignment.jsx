// client/src/components/CreateAssignment.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUpload,
  FaFile,
  FaCheckCircle,
  FaExclamationCircle,
  FaCalendarAlt,
  FaStar,
  FaTrash,
  FaAlignLeft,
} from "react-icons/fa";

function CreateAssignment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    maxMarks: "",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const token = localStorage.getItem("token");

    // Try multiple ways to get user ID
    let trainerId =
      localStorage.getItem("userId") ||
      localStorage.getItem("vid") ||
      localStorage.getItem("id") ||
      localStorage.getItem("user_id");

    if (!trainerId || trainerId === "null" || trainerId === "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          trainerId = user.id || user._id || user.userId || user.vid;
        } catch (e) {}
      }
    }

    console.log("=== FRONTEND DEBUG ===");
    console.log("Token exists:", token ? "Yes" : "No");
    console.log("TrainerId:", trainerId);
    console.log("======================");

    if (!token) {
      setMessage({
        type: "error",
        text: "No token found. Please login again.",
      });
      setLoading(false);
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (!trainerId || trainerId === "null" || trainerId === "undefined") {
      setMessage({
        type: "error",
        text: "User not logged in properly. Please login again.",
      });
      setLoading(false);
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("deadline", formData.deadline);
    data.append("maxMarks", formData.maxMarks);
    data.append("trainerId", trainerId);

    files.forEach((file) => {
      data.append("attachments", file);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/create",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text: "Assignment created successfully!",
        });
        setTimeout(() => {
          navigate("/viewallassignment");viewallassignment;
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to create assignment. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/assignment")}
          className="mb-5 flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors group"
        >
          <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Assignments</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-7 py-5">
            <h1 className="text-2xl font-bold text-white">
              Create New Assignment
            </h1>
            <p className="text-purple-100 text-sm mt-1">
              Fill in the details to create a new assignment
            </p>
          </div>

          {message.text && (
            <div
              className={`mx-7 mt-5 p-3 rounded-lg flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaExclamationCircle className="text-red-500" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assignment Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-sm"
                  placeholder="e.g., React.js Final Project"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-1 text-gray-400" />{" "}
                  Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaStar className="inline mr-1 text-yellow-500" /> Maximum
                  Marks <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="maxMarks"
                  value={formData.maxMarks}
                  onChange={handleChange}
                  required
                  min="1"
                  max="100"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-sm"
                  placeholder="e.g., 100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaUpload className="inline mr-1 text-gray-400" /> Attachments
                  (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition bg-gray-50">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.png,.txt"
                    multiple
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm border border-gray-300"
                  >
                    <FaUpload className="text-purple-500" />
                    Choose Files
                  </label>
                  <p className="text-xs text-gray-400 mt-2">
                    PDF, DOC, DOCX, JPG, PNG (Max 10MB each)
                  </p>
                </div>

                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-3 flex items-center justify-between border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <FaFile className="text-purple-500 text-lg" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 transition p-1"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaAlignLeft className="inline mr-1 text-gray-400" />{" "}
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-sm resize-none"
                placeholder="Describe the assignment requirements, instructions, and expectations..."
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/assignment")}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50 text-sm font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  "Create Assignment"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAssignment;
