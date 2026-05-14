import React from "react";
import { useNavigate } from "react-router-dom";

export const Admin = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        {/* Main Container */}
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <b className="text-4xl font-bold text-black -mt-8 ">
              Admin Dashboard
            </b>
            <p className="text-gray-600 mt-12">Manage Books Records</p>
          </div>

          {/* Student Details Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b-2 border-gray-200 pb-3">
              Books Details
            </h3>

            {/* Button Grid */}
            <div className=" gap-14 h-40 flex justify-center ">
              {/* Create Button */}
              <button
                onClick={() => navigate("/createbook")}
                className="bg-green-500 hover:bg-green-600 cursor-pointer text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                ✨ Create
              </button>

              {/* Get Button */}
              {/* <button
                onClick={() => navigate("/Get")}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                📖 Get
              </button> */}

              {/* View All Button */}
              <button
                onClick={() => navigate("/viewbooks")}
                className="bg-purple-500 hover:bg-purple-600 cursor-pointer text-white font-semibold py-3 px-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                👁️ View All
              </button>

              {/* Delete Button */}
              {/* <button
                onClick={() => navigate("/Delete")}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                🗑️ Delete
              </button> */}

              {/* Update Button */}
              {/* <button
                onClick={() => navigate("/Put")}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                ✏️ Update
              </button> */}
            </div>
          </div>

          {/* Go Back Button */}
          <div className="text-center">
            <button
              onClick={() => navigate("/connect")}
              className="fixed bottom-4 left-4 bg-white/90 cursor-pointer backdrop-blur-sm text-purple-600 font-semibold py-1.5 px-3 rounded-lg shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm"
            >
              <svg
                className="w-3 h-3"
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
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
