import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  // ⭐ TIMER STATE - Start at 30 seconds
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // ⭐ TIMER EFFECT - Decrease every second
  useEffect(() => {
    if (step === "otp" && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [step, timeLeft]);

  // ⭐ WHEN TIMER REACHES 0, ENABLE RESEND
  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft]);

  // ⭐ RESET TIMER WHEN OTP SCREEN OPENS
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

  // ⭐ GET COLOR BASED ON TIME LEFT
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
        setTimeLeft(30); // ⭐ RESET TIMER
        setCanResend(false); // ⭐ DISABLE RESEND
        setMsg({ type: "success", text: "OTP sent to your email!" });
      }
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
    } finally {
      setIsLoading(false);
      setTimeout(() => setMsg(""), 3000);
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
      }
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Invalid OTP",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMsg(""), 3000);
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
        setTimeLeft(30); // ⭐ RESET TIMER
        setCanResend(false); // ⭐ DISABLE RESEND BUTTON
        setOtp(""); // ⭐ CLEAR OTP INPUT
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
      <div className="h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">📧</div>
            <h2 className="text-2xl font-bold text-gray-800">Verify OTP</h2>
            <p className="text-gray-600 text-sm mt-2">
              Enter the 4-digit code sent to
              <br />
              <strong className="text-purple-600">{userEmail}</strong>
            </p>
          </div>

          {msg && (
            <div
              className={`mb-4 p-2 rounded-lg text-center text-sm ${
                msg.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {msg.text}
            </div>
          )}

          <input
            type="text"
            maxLength="4"
            placeholder="0000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
            className="w-full text-center text-3xl tracking-widest border-2 rounded-lg py-3 mb-4 focus:outline-none focus:border-purple-500"
            autoFocus
          />

          {/* ⭐ TIMER DISPLAY WITH RED COLOR WHEN LOW ⭐ */}
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              OTP expires in:{" "}
              <span className={`font-bold ${getTimerColor()}`}>
                {formatTime(timeLeft)}
              </span>
            </p>
            {timeLeft <= 10 && (
              <p className="text-xs text-red-500 mt-1 animate-pulse">
                ⚠️ OTP expiring soon!
              </p>
            )}
          </div>

          <button
            onClick={handleVerifyOTP}
            disabled={isLoading}
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 mb-3"
          >
            {isLoading ? "Verifying..." : "Verify & Login"}
          </button>

          {/* ⭐ RESEND BUTTON - Only enabled after timer expires */}
          <button
            onClick={handleResendOTP}
            disabled={isLoading || !canResend}
            className={`w-full text-sm transition ${
              canResend
                ? "text-purple-600 hover:text-purple-700"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            {canResend ? "Resend OTP" : `Resend OTP in ${formatTime(timeLeft)}`}
          </button>

          <button
            onClick={() => setStep("login")}
            className="w-full text-gray-500 text-sm mt-4 hover:text-gray-700"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    );
  }

  // ========== LOGIN SCREEN ==========
  return (
    <div className="h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <div className="text-center mb-5">
          <p className="text-gray-500 font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Please login to your account
          </p>
        </div>

        {msg && (
          <div
            className={`mb-3 p-2 rounded-lg text-center text-sm ${
              msg.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
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
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg
                  className="h-4 w-4 text-violet-900 font-bold text-xs"
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
                className="w-full pl-9 pr-10 py-1.5 border-2 border-black rounded-full focus:outline-none focus:border-purple-500 text-xs font-bold text-black"
                placeholder="Enter your username"
                disabled={isLoading}
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block flex flex-start text-gray-700 font-semibold mb-1 text-xs">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg
                  className="h-4 w-4 text-violet-900 font-bold"
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
                className="w-full pl-9 pr-10 py-1.5 border-2 border-black rounded-full focus:outline-none focus:border-purple-500 text-xs font-bold text-black"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg
                  className="h-4 w-4 text-violet-900 font-bold text-xs"
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
            <label className="flex items-center">
              <input type="checkbox" className="w-3 h-3 rounded" />
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
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-1.5 rounded-lg hover:opacity-90 disabled:opacity-50 text-sm"
          >
            {isLoading ? "Sending OTP..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-xs">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-purple-600 font-semibold hover:text-purple-700"
            >
              Register here
            </button>
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate("/Home")}
        className="fixed top-4 left-4 bg-white/90 backdrop-blur-sm text-purple-600 font-semibold py-1.5 px-3 shadow-lg hover:bg-white transition-all text-sm flex items-center gap-2 rounded-full"
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
