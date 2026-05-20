import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaExclamationCircle, FaEnvelope, FaUser, FaLock, FaSignInAlt, FaCheckCircle } from "react-icons/fa";
import { MdTimerOff, MdLogin, MdVpnKey } from "react-icons/md";
import { HiLogin } from "react-icons/hi";
import { RiLoginBoxLine } from "react-icons/ri";
import { TbLogin } from "react-icons/tb";
import { IoLogInOutline } from "react-icons/io5";
import axios from "axios";

export const Login = () => {
  const navigate = useNavigate();

  // Login form states
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // OTP states
  const [step, setStep] = useState("login");
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [otp, setOtp] = useState("");

  // Timer state
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Timer effect
  useEffect(() => {
    if (step === "otp" && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [step, timeLeft]);

  // When timer reaches 0, enable resend
  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Reset timer when OTP screen opens
  useEffect(() => {
    if (step === "otp") {
      setTimeLeft(30);
      setCanResend(false);
    }
  }, [step]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
    return `${seconds}s`;
  };

  // Get color based on time left
  const getTimerColor = () => {
    if (timeLeft <= 10) return "text-red-600 font-bold";
    if (timeLeft <= 20) return "text-orange-500";
    return "text-green-600";
  };

  // Handle Login - Send OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");

    if (!user || !password) {
      setMsg({
        type: "error",
        text: "Please enter both username and password",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user-login",
        {
          username: user,
          password: password,
        },
      );

      if (response.data.requiresOTP) {
        setUserId(response.data.userId);
        setUserEmail(response.data.email);
        setStep("otp");
        setTimeLeft(30);
        setCanResend(false);
        setMsg({ type: "success", text: "OTP sent to your email!" });
      }
      setIsLoading(false);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setMsg({
          type: "error",
          text: "User not found! Please register first.",
        });
      } else if (err.response && err.response.status === 401) {
        setMsg({ type: "error", text: "Invalid password! Please try again." });
      } else {
        setMsg({ type: "error", text: "Login failed. Please try again." });
      }
      setIsLoading(false);
    }
  };

  // Handle OTP Verification
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 4) {
      setMsg({ type: "error", text: "Please enter valid 4-digit OTP" });
      return;
    }

    setIsLoading(true);
    setMsg("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user-verify-otp",
        {
          userId: userId,
          otpCode: otp,
        },
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        

        const role = response.data.user?.role;
        setMsg({ type: "success", text: "Login successful! Redirecting..." });

        setTimeout(() => {
          if (role === "admin") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        }, 1000);
      } else {
        setMsg({
          type: "error",
          text: response.data.message || "Verification failed",
        });
        setIsLoading(false);
      }
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Invalid OTP",
      });
      setIsLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOTP = async () => {
    setIsLoading(true);
    setMsg("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user-resend-otp",
        {
          userId: userId,
        },
      );

      if (response.data.success) {
        setMsg({ type: "success", text: "New OTP sent to your email!" });
        setTimeLeft(30);
        setCanResend(false);
        setOtp("");
      } else {
        setMsg({ type: "error", text: "Failed to resend OTP" });
      }
    } catch (err) {
      setMsg({ type: "error", text: "Failed to resend OTP" });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  // ========== OTP SCREEN ==========
  if (step === "otp") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <FaEnvelope className="text-5xl mb-5 text-purple-600 mx-auto" />
            <p className="text-2xl mb-2 font-bold text-gray-800">Verify OTP</p>
            <p className="text-gray-600 text-sm py-2">
              Enter the 4-digit code sent to
              <br />
              <strong className="text-purple-600 py-2">{userEmail}</strong>
            </p>
          </div>

          {/* Message with icon */}
          {msg && (
            <div
              className={`mb-4 p-3 rounded-lg text-center text-sm flex items-center justify-center gap-2 ${
                msg.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {msg.type === "success" && <FaCheckCircle className="w-4 h-4" />}
              {msg.type === "error" && <FaExclamationCircle className="w-4 h-4" />}
              <span>{msg.text}</span>
            </div>
          )}

          <input
            type="text"
            maxLength="4"
            placeholder="0000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
            className="w-full text-center text-3xl tracking-widest border-2 border-gray-300 rounded-lg py-3 mb-4 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            autoFocus
          />

          {/* Timer Display */}
        <div className="flex flex-col items-center justify-center mb-4 gap-3">
  {/* Timer Badge */}
  <div className="flex items-center justify-center">
    <div className="bg-gray-100 rounded-full px-4 py-2 shadow-sm">
      <p className="text-sm text-gray-700 font-medium">
        OTP expires in:{" "}
        <span className={`font-bold ${getTimerColor()}`}>
          {formatTime(timeLeft)}
        </span>
      </p>
    </div>
  </div>

  {/* Warning Messages */}
  {timeLeft <= 10 && timeLeft > 0 && (
    <p className="text-xs text-red-500 mt-3 animate-pulse flex items-center justify-center gap-1">
      <FaExclamationTriangle className="text-yellow-500" />
      <span className="font-bold">OTP expiring soon!</span>
    </p>
  )}

  {timeLeft <= 0 && (
    <p className="text-xs text-red-500  animate-pulse flex items-center justify-center gap-1">
      <MdTimerOff className="text-red-500" />
      <span className="font-bold">Your OTP is expired!</span>
    </p>
  )}
</div>
          <button
            onClick={handleVerifyOTP}
            disabled={isLoading || otp.length !== 4}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-2.5 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 mb-3"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify & Login"
            )}
          </button>

          {/* Resend Button */}
          <button
            onClick={handleResendOTP}
            disabled={isLoading || !canResend}
            className={`w-full text-sm py-2 rounded-lg transition-all duration-300 ${
              canResend
                ? "text-purple-600 hover:text-purple-700 font-semibold"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            {canResend ? "⟳ Resend OTP" : `Resend OTP in ${formatTime(timeLeft)}`}
          </button>

          <button
            onClick={() => {
              setStep("login");
              setOtp("");
              setMsg("");
            }}
            className="w-full text-gray-500 text-sm mt-4 hover:text-purple-600 transition-colors duration-300 flex items-center justify-center gap-1"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    );
  }

  // ========== LOGIN SCREEN ==========
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center shadow-md">
              <FaSignInAlt className="text-white text-2xl" />
            </div>
          </div>
          <b className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome Back
          </b>
          <p className="text-gray-500 text-sm mt-1">
            Please login to your account
          </p>
        </div>

        {/* Message with icon */}
        {msg && (
          <div
            className={`mb-3 p-2 rounded-lg text-center text-sm flex items-center justify-center gap-2 ${
              msg.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {msg.type === "success" && <FaCheckCircle className="w-4 h-4" />}
            {msg.type === "error" && <FaExclamationCircle className="w-4 h-4" />}
            <span>{msg.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block flex flex-start text-gray-700 font-semibold mb-1 text-xs">
              Username
            </label>
            <div className="group relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" />
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-sm text-gray-700"
                placeholder="Enter your username"
                disabled={isLoading}
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block  flex flex-start  text-gray-700 font-semibold mb-1 text-xs">
              Password
            </label>
            <div className="group relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-sm text-gray-700"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg
                  className="h-4 w-4 text-gray-400 hover:text-purple-600 transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {showPassword ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="w-3 h-3 rounded cursor-pointer" />
              <span className="ml-1 text-xs text-gray-600">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-xs text-purple-600 hover:text-purple-700 font-semibold transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 text-sm"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending OTP...
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
              className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
            >
              Register here
            </button>
          </p>
        </div>
      </div>

      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/Home")}
        className="fixed top-4 left-4 bg-white/90 backdrop-blur-sm text-purple-600 font-semibold py-1.5 px-3 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm z-50"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>
    </div>
  );
};

export default Login;