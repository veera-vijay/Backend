import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Adminstd = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  
    useEffect(() => {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUserRole(user.role);
        console.log("Logged in as:", user.role);
      }
    }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8">
        {/* Main Container */}
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-block bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
              <span className="text-3xl">👨‍🎓</span>
            </div>
            <b className="text-2xl sm:text-3xl md:text-4xl font-bold text-black block">
              Admin Dashboard
            </b>
            <p className="text-gray-600 text-sm sm:text-base mt-3 sm:mt-4">
              Manage Student Records
            </p>
          </div>

          {/* Student Details Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center border-b-2 border-gray-200 pb-3">
              👨‍🎓 Student Management
            </h3>

            {/* Buttons in ONE LINE - FIXED */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              {/* Create Button */}
              {userRole === "admin" &&(
              <button
                onClick={() => navigate("/stdform")}
                className="w-full sm:w-auto bg-green-500 cursor-pointer hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span className="text-xl">✨</span>
                <span>Create Student</span>
              </button>
              )}
              {/* View All Button */}
              <button
                onClick={() => navigate("/viewallstd")}
                className="w-full sm:w-auto bg-purple-500 cursor-pointer hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span className="text-xl">👁️</span>
                <span>View All Students</span>
              </button>
            </div>
          </div>

          {/* Go Back Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="fixed top-4 left-4 bg-white/90 backdrop-blur-sm cursor-pointer text-purple-600 font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm"
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
            Back
          </button>
        </div>
      </div>
    </>
  );
};

export default Adminstd;
