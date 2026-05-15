import React, { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");

    if (!user || !password) {
      setMsg({ type: 'error', text: 'Please enter both username and password' });
      setIsLoading(false);
      setTimeout(() => setMsg(""), 3000);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/user-login", {
        username: user,
        password: password,
      });
 if (response.data.token) {
                    setMsg({ type: 'success', text: 'Login successful! Redirecting...' });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      
       const role = JSON.parse(localStorage.getItem('user')).role;
  console.log("Your role is:", role); // "admin" or "student"
  
 
  if (role === 'admin') {
    console.log("Welcome Admin!");
  } else {
    console.log("Welcome Student!");
  }
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setMsg({ type: 'error', text: 'Login failed. Please check your credentials.' });
        setTimeout(() => setMsg(""), 3000);
      }
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 404) {
        setMsg({ type: 'error', text: 'User not found! Please register first.' });
        setTimeout(() => {
          const confirmRegister = window.confirm("User not found! Would you like to register?");
          if (confirmRegister) {
            navigate("/register");
          }
        }, 500);
      } else if (err.response && err.response.status === 401) {
        setMsg({ type: 'error', text: 'Invalid password! Please try again.' });
      } else {
        setMsg({ type: 'error', text: 'Login failed. Please check your credentials.' });
      }
      setTimeout(() => setMsg(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 w-full max-w-md">
      
        <div className="text-center mb-5">
          {/* <i className=" -ml-10 p-4 text-xl text-center font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            welcome
          </i> */}
          <p className="text-gray-500 text-xsl mt-1 font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Please login to your account
          </p>
        </div>

        {msg && (
          <div
            className={`mb-3 p-2 rounded-lg text-center text-sm ${
              msg.type === "success"
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block flex flex-start text-gray-700 font-semibold mb-1 text-xs">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                <svg
                  className="h-4 w-4 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border-2 border-black rounded-full focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-xs font-medium text-black"
                placeholder="Enter your username"
                disabled={isLoading}
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block flex flex-start text-gray-700 font-medium mb-1 text-xs">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 text-xs py-1.5 border-2 border-black rounded-full focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-black font-medium"
                placeholder="Enter your password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <svg
                    className="h-4 w-4 text-black hover:text-purple-600"
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
                ) : (
                  <svg
                    className="h-4 w-4 text-gray-500 hover:text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-3 h-3 bg-white  rounded focus:ring-purple-500"
              />
              <span className="ml-1 text-xs text-gray-600">Remember me</span>
            </label>
            <a
              href="/forgot-password"
              className="text-xs text-purple-600 hover:text-purple-700 font-semibold"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-1.5 px-4 rounded-lg transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-4 w-4 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-xs">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-purple-600 cursor-pointer font-semibold hover:text-purple-700 transition-colors"
            >
              Register here
            </button>
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate("/Home")}
        className="fixed top-4 cursor-pointer left-4 bg-white/90 backdrop-blur-sm text-purple-600 font-semibold py-1.5 px-3 rounded-lg shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm"
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
        Back
      </button>
    </div>
  );
};

export default Login;