import React from "react";
import { useNavigate } from "react-router-dom";

const Connect = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4">
      {/* Main Card */}
      <div className="max-w-2xl w-full">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <span className="text-5xl">📚</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Welcome to Dashboard
          </h1>
          <p className="text-white/80 text-lg">
            Choose an option to manage your data
          </p>
        </div>

        {/* Button Container */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Books Button */}
          <button
            onClick={() => navigate("/admin")}
            className="group relative cursor-pointer overflow-hidden bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                📖
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Books</h2>
              <p className="text-white/80 text-sm">
                Manage your book collection
              </p>
              <div className="mt-4 inline-flex cursor-pointer items-center text-white text-sm font-semibold">
                Go to Books
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </button>

          {/* Students Button */}
          <button
            onClick={() => navigate("/adminstd")}
            className="group relative overflow-hidden cursor-pointer bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                👨‍🎓
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Students</h2>
              <p className="text-white/80 text-sm">Manage student records</p>
              <div className="mt-4 inline-flex items-center cursor-pointer text-white text-sm font-semibold">
                Go to Students
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Back Button - FIXED at bottom-left corner */}
      <button
        onClick={() => navigate("/")}
        className="fixed bottom-4 left-4 z-50 inline-flex cursor-pointer items-center gap-2 px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 text-sm font-semibold shadow-lg"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Home
      </button>
    </div>
  );
};

export default Connect;
