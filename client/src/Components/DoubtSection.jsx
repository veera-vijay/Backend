import React from "react";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaComments,
  FaLightbulb
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function DoubtSection() {  
  const navigate = useNavigate(); 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header Section */}
        <div>

        <div className="text-center  flex gap-2 items-center justify-center ">
        
            <FaComments className="text-6xl text-blue-300" />
          
          <h1 className="text-2xl font-bold !text-blue-800 mb-2">
            Doubt Resolution Portal
          </h1>
          </div>
          
         
        </div>

        {/* Two Cards Row */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Student Card */}
          <button 
            onClick={() => navigate("/studentportal")}  
            className="group relative overflow-hidden cursor-pointer rounded-2xl p-8 text-center bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            {/* Card Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Card Content */}
            <div className="relative z-10">
              <div className="text-6xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full group-hover:bg-white/20 transition-colors duration-300">
                  <FaUserGraduate className="text-6xl text-blue-600 group-hover:text-black transition-colors duration-300" />
                </div>
              </div>
              <h2 className="text-2xl font-bold !text-gray-600 group-hover:text-white transition-colors duration-300">
                Student Portal
              </h2>
              <p className="mt-2 text-gray-500 group-hover:text-blue-100 transition-colors duration-300">
                Post doubts, like answers, and learn better
              </p>
              
              {/* Feature List */}
              <div className="mt-4 space-y-1 text-sm text-gray-400 group-hover:text-blue-100">
                <p>✓ Ask unlimited questions</p>
                <p>✓ Like helpful answers</p>
                <p>✓ Comment for clarifications</p>
              </div>
            </div>
          </button>

          {/* Trainer Card */}
          <button
            onClick={() => navigate("/trainerportal")} 
            className="group relative overflow-hidden cursor-pointer rounded-2xl p-8 text-center bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            {/* Card Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Card Content */}
            <div className="relative z-6">
              <div className="text-6xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full group-hover:bg-white/20 transition-colors duration-300">
                  <FaChalkboardTeacher className="text-6xl text-purple-600 group-hover:text-black transition-colors duration-300" />
                </div>
              </div>
              <h2 className="text-2xl font-bold !text-gray-600 group-hover:text-white transition-colors duration-300">
                Trainer Portal
              </h2>
              <p className="mt-2 text-gray-500 group-hover:text-purple-100 transition-colors duration-300">
                Answer doubts, pin important questions
              </p>
              
              {/* Feature List */}
              <div className="mt-4 space-y-1 text-sm text-gray-400 group-hover:text-purple-100">
                <p>✓ Answer student questions</p>
                <p>✓ Pin important doubts</p>
                <p>✓ Track engagement</p>
              </div>
            </div>
          </button>
        </div>

       
      </div>
    </div>
  );
}

export default DoubtSection;