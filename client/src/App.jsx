import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import Admin from"./Components/Admin";
import Adminstd from "./Components/Adminstd";
import Createbooks from './Components/Createbooks';
import Viewbooks from './Components/Viewbooks';
import Dashboard from "./Components/Dashboard";
import StdForm from "./Components/StdForm";
import Viewallstd from "./Components/Viewallstd";
function App() {
  return (
    <Router>
      {" "}
      {/* Only one Router here */}
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="home" />} />
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route path="/createbook" element={<Createbooks />} />
        <Route path="/viewbooks" element={<Viewbooks />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/adminstd" element={<Adminstd />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stdform" element={<StdForm />} />
        <Route path="/viewallstd" element={<Viewallstd />} />

        <Route
          path="/connect"
          element={
            <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                  Dashboard
                </h1>
                <p className="text-gray-600 mb-4">
                  Welcome back, {localStorage.getItem("username")}!
                </p>
                <button
                  onClick={() => {
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("username");
                    window.location.href = "/login";
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;