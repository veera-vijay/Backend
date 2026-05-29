import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdMenuBook, MdAutoStories, MdAdd, MdLibraryBooks } from "react-icons/md";
import { MdCreate, MdEdit, MdAddCircle } from "react-icons/md";


import { FaPlus, FaPlusCircle, FaBookOpen } from "react-icons/fa";


export const Adminbook = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Get user role from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData); // change string to object
      setUserRole(user.role);
      console.log("Logged in as:", user.role);
    }
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-100 p-4 sm:p-6 md:p-8">
        {/* Main Container */}
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-block bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
              <span className="text-3xl">
                {" "}
                <MdAutoStories className="text-6xl text-green-600" />
              </span>
            </div>
             {userRole === "admin" && (
            <b className="text-2xl sm:text-3xl md:text-4xl font-bold text-black block">
              Admin Dashboard
            </b>
             )}
            <p className="text-gray-600 text-sm sm:text-base mt-3! sm:mt-4">
              Manage Your Book Collection
            </p>
          </div>

          {/* Books Details Card - Only Books */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="flex items-center justify-center gap-3 mb-6 border-b-2 border-gray-200 pb-3">
              <MdMenuBook className="text-6xl text-purple-600" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                Books Management
              </h3>
            </div>

            {/* Buttons in ONE LINE - FIXED */}

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              {/* Create Button */}
              {userRole === "admin" && (
                <button
                  onClick={() => navigate("/createbook")}
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-900 via-pink-700 to-pink-400 hover:from-pink-300  hover:to-pink-900 cursor-pointer text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <div className="flex items-center gap-2">
                    <div className=" rounded-full">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <h5 className="text-white font-medium">Create Book</h5>
                  </div>
                </button>
              )}

              {/* View All Button */}
              <button
                onClick={() => navigate("/viewbooks")}
                className="w-full sm:w-auto bg-gradient-to-r from-green-900 via-green-600 to-green-400 hover:from-green-600 hover:to-green-700 cursor-pointer text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
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
                <span>View All Books</span>
              </button>
            </div>
          </div>

          {/* Go Back Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="fixed top-4 left-4 bg-white/90 backdrop-blur-sm cursor-pointer text-purple-600 font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm"
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

export default Adminbook;
