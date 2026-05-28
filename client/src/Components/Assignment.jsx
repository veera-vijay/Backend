import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUniversity,
  FaSchool,
  FaClipboardList,
   FaUserCheck, 
} from "react-icons/fa";
import {  MdGroupAdd } from "react-icons/md";

export const Assignment = () => {
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
              <FaClipboardList className="text-6xl text-blue-500" />
            </div>
            {userRole === "admin" && (
              <b className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-900 via-gray-600 to-gray-300 bg-clip-text text-transparent block">
                Admin Dashboard
              </b>
            )}
            <p className="text-gray-600 text-sm sm:text-base mt-4! sm:mt-4">
              Manage Assignment records
            </p>
          </div>

          {/* Student Details Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <FaClipboardList className="text-6xl text-white" />

              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                Students Assignments
              </h3>
            </div>
            <div className="border-t-2 my-3 border-dashed   "></div>

            {/* Buttons in ONE LINE - FIXED */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              {/* Create Button */}
              <button
                onClick={() => navigate("/createAssignment")}
                className="bg-gradient-to-r from-pink-900 via-pink-700 to-pink-400 hover:from-pink-300 hover:to-pink-900 cursor-pointer text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <MdGroupAdd className="text-3xl text-white" />
                <h5 className="text-white font-medium">Create Assignment</h5>
              </button>

              {/* Review Button */}
              <button
                onClick={() => navigate("/reviewassignment")}
                className="bg-gradient-to-r from-green-900 via-green-600 to-green-400 hover:from-green-600 hover:to-green-700 cursor-pointer text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <FaUserCheck className="text-3xl text-blue-400" />
                <span>Review All Assignment</span>
              </button>

              {/* View All Button */}
              <button
                onClick={() => navigate("/viewallassignment")}
                className="bg-gradient-to-r from-blue-900 via-blue-600 to-blue-400 hover:from-green-600 hover:to-green-700 cursor-pointer text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>View All Assignment</span>
              </button>
            </div>
          </div>

          {/* Go Back Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="fixed top-4 left-4 bg-white/90 backdrop-blur-sm cursor-pointer text-purple-600 font-semibold py-2 px-4  shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm rounded-full"
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

export default Assignment;
