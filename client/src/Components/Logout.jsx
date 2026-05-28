// components/Logout.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaTimes, FaCheck } from "react-icons/fa";

function Logout() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);

    // Simulate logout delay (optional)
    setTimeout(() => {
      // Clear all localStorage data
      localStorage.clear();
     

      // Redirect to login page
      navigate("/login");
    }, 500);
  };

  const handleCancelLogout = () => {

    setTimeout(()=>{
        navigate('/home')
    },500)
  };

  return (
    <>
      {/* Logout Button */}
      {/* <button
        onClick={handleLogoutClick}
        className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
      >
        <FaSignOutAlt className="text-lg" />
        <span className="font-medium">Logout</span>
      </button> */}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-slideUp">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full">
                <FaSignOutAlt className="text-lg transform scale-x-[-1] " />
                </div>
                <h3 className="text-white text-xl font-bold">Confirm Logout</h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700 text-lg mb-2">
                Are you sure you want to logout?
              </p>
              <p className="text-gray-500 text-sm">
                You will need to login again to access your account.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={handleCancelLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition duration-300 font-medium"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading......
                  </>
                ) : (
                  <>
                    <FaTimes />
                    Cancel
                  </>
                )}
              </button>
              <button
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full hover:from-red-700 hover:to-red-800 transition duration-300 font-medium shadow-md"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging out...
                  </>
                ) : (
                  <>
                    <FaCheck />
                    Yes, Logout
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

export default Logout;
