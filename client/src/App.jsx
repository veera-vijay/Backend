import React from 'react';
import {useEffect} from 'react';
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
import Assignment from"./Components/Assignment"
import CreateAssignment from "./Components/CreateAssignment";
import ViewallAssignment from "./Components/ViewallAssignment";
import ReviewAssignment from "./Components/ReviewAssignment";

function App() {
  useEffect(() => {
  const interval = setInterval(() => {
    const loginTime = localStorage.getItem("loginTime");
    
    if (loginTime) {
      const secondsPassed = (Date.now() - parseInt(loginTime)) / 1000;
      
      if (secondsPassed >= 3600) {
        alert("Session expired! Please login again.");
        localStorage.clear();
        window.location.href = "/login";
      }
    }
  }, 1000);
  
  return () => clearInterval(interval);
}, []);
  return (
    <Router>
      {" "}
      {/* Only one Router here */}
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


        

        
        
      </Routes>
    </Router>
  );
}

export default App;