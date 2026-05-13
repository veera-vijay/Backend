import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen scrollbar-hide bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600">
      {/* Navbar */}
      <nav className="bg-white/10 scrollbar-hide backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              className="flex items-center space-x-2 cursor-pointer "
              onClick={() => navigate("/")}
            >
              <span className="text-2xl">📚</span>
              <span className="text-white font-bold text-xl">BookStore</span>
            </div>

            {/* Auth Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => navigate("/")}
                className="bg-gray-300 text-black px-3 cursor-pointer rounded-full hover:bg-white/30 transition duration-300 font-medium"
              >
                Home
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-1.5 bg-white/20 text-white cursor-pointer  rounded-full hover:bg-white/30 transition duration-300 font-medium"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-1.5 bg-white/20 cursor-pointer text-white rounded-full hover:bg-white/30 transition duration-300 font-medium  hover:cursor"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          {/* Animated Badge */}
          <div className="inline-block animate-bounce mb-4">
            <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm">
              ✨ Welcome to BookStore ✨
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fadeIn">
            Discover Your Next
            <span className="text-yellow-300"> Great Read</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl flex justify-center text-center text-white/90 mb-8 animate-slideUp ">
            Join our community of book lovers. Explore thousands of books,
            connect with authors, and share your reading journey.
          </p>

          {/* CTA Buttons */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center animate-slideUp">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-3 bg-yellow-500  cursor-pointer text-purple-900 font-bold rounded-full hover:bg-yellow-400 transform hover:scale-105 transition duration-300 shadow-lg"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 bg-white/20  cursor-pointer text-white font-semibold rounded-full hover:bg-white/30 transform hover:scale-105 transition duration-300 backdrop-blur-sm"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* ========== FOOTER - FULL WIDTH ========== */}
      {/* Moved OUTSIDE the max-w-7xl container */}
      <footer className="w-full bg-gray-900/95 backdrop-blur-sm -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-white/70 text-sm text-center">
            © 2024 BookStore. All rights reserved. Made with ❤️ for book lovers.
          </p>
        </div>
      </footer>

      {/* Animations */}
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
