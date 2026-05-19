import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
const Home = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600">
      {/* Navbar */}
      <nav className="bg-white/10 scrollbar-hide backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <span className="text-2xl">📚</span>
              <span className="text-white font-bold text-xl">BookStore</span>
            </div>

            {/* DESKTOP MENU */}
            <div className="hidden lg:flex space-x-3">
              <button
                onClick={() => navigate("/")}
                className="bg-gray-300 text-black px-3 cursor-pointer rounded-full hover:bg-white/30 transition duration-300 font-medium"
              >
                Home
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-1.5 bg-white/20 text-white cursor-pointer rounded-full hover:bg-white/30 transition duration-300 font-medium"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-1.5 bg-white/20 cursor-pointer text-white rounded-full hover:bg-white/30 transition duration-300 font-medium"
              >
                Register
              </button>
            </div>

            {/* MOBILE & TABLET MENU BUTTON */}
            <div className="block lg:hidden">
              <button
                onClick={toggleMenu}
                className="text-white p-2 rounded-lg hover:bg-white/20 transition duration-300 focus:outline-none"
              >
                {!isMenuOpen ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE & TABLET DROPDOWN MENU */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-64 opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
          } overflow-hidden bg-white/10 backdrop-blur-md`}
        >
          <div className="px-4 pt-2 pb-4 space-y-2">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/");
              }}
              className="w-full text-left px-4 py-2 text-white bg-white/10 rounded-lg hover:bg-white/20 transition duration-300 font-medium"
            >
              🏠 Home
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/login");
              }}
              className="w-full text-left px-4 py-2 text-white bg-white/10 rounded-lg hover:bg-white/20 transition duration-300 font-medium"
            >
              🔐 Login
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/register");
              }}
              className="w-full text-left px-4 py-2 text-white bg-white/10 rounded-lg hover:bg-white/20 transition duration-300 font-medium"
            >
              📝 Register
            </button>
          </div>
        </div>
      </nav>
      {/* Hero Section - This will grow to push footer down */}
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <div className="inline-block animate-bounce mb-4">
              <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm ">
                ✨ Welcome to BookStore ✨
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fadeIn">
              Discover Your Next
              <span className="text-yellow-300"> Great Read</span>
            </h1>

            <p className="text-lg md:text-xl flex justify-center text-center text-white/90 mb-8 animate-slideUp">
              Join our community of book lovers. Explore thousands of books,
              connect with authors, and share your reading journey.
            </p>

            <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center animate-slideUp">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-3 bg-yellow-500 cursor-pointer text-purple-900 font-bold rounded-full hover:bg-yellow-400 transform hover:scale-105 transition duration-300 shadow-lg"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-3 bg-white/20 cursor-pointer text-white font-semibold rounded-full hover:bg-white/30 transform hover:scale-105 transition duration-300 backdrop-blur-sm"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
     
      <footer className="w-full bg-gray-900/95 backdrop-blur-sm md:-mt-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-2 py-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.50 }}
          >
            <p className="text-white/70 text-sm text-center">
              © 2024 BookStore. All rights reserved. Made with ❤️ for book
              lovers.
            </p>
          </motion.div>
        </div>
      </footer>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        ::-webkit-scrollbar {
          display: none;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }

        .animate-bounce {
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
