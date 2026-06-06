import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Logout from "./Components/Logout";
import ForgotPassword from "./components/ForgotPassword";
import Register from './Components/Register';
import Adminbook from"./Components/Adminbook";
import Adminstd from "./Components/Adminstd";
import Createbooks from './Components/Createbooks';
import Viewbooks from './Components/Viewbooks';
import Dashboard from "./Components/Dashboard";
import StdForm from "./Components/StdForm";
import Viewallstd from "./Components/Viewallstd";
import Assignment from"./Components/Assignment";
import CreateAssignment from "./Components/CreateAssignment";
import ViewallAssignment from "./Components/ViewallAssignment";
import ReviewAssignment from "./Components/ReviewAssignment";
import DoubtSection from "./Components/DoubtSection";
import StudentPortal from './Components/Studentportal';
import Trainerportal from './Components/Trainerportal';

function App() {
  useEffect(() => {
    const checkToken = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (Date.now() >= payload.exp * 1000) {
            alert("⚠️ Session expired! Please login again.");
            localStorage.clear();
            window.location.href = "/login";
          }
        } catch(e) {}
      }
    }, 10000); // Checks every 10 seconds
    
    return () => clearInterval(checkToken);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="home" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/createbook" element={<Createbooks />} />
        <Route path="/viewbooks" element={<Viewbooks />} />
        <Route path="/adminbook" element={<Adminbook />} />
        <Route path="/adminstd" element={<Adminstd />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stdform" element={<StdForm />} />
        <Route path="/viewallstd" element={<Viewallstd />} />
        <Route path="/assignment" element={<Assignment />} />
        <Route path="/createassignment" element={<CreateAssignment />} />
        <Route path="/viewallassignment" element={<ViewallAssignment />} />
        <Route path="/reviewassignment" element={<ReviewAssignment />} />
        <Route path="/doubt" element={<DoubtSection />} />
        <Route path="/studentportal" element={<StudentPortal />} />
        <Route path="/trainerportal" element={<Trainerportal />} />
      </Routes>
    </Router>
  );
}

export default App;