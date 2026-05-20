import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { HiLockClosed } from "react-icons/hi";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=newpassword
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Timer for OTP expiry
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const getTimerColor = () => {
    if (timeLeft <= 10) return "text-red-600 font-bold";
    if (timeLeft <= 20) return "text-orange-500";
    return "text-green-600";
  };
  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user-forgot-password",
        { email },
      );

      if (response.data.success) {
        setMessage(" OTP sent to your email!");
        setTimeLeft(30); // 30s
        setCanResend(false);
         setOtp(" ");
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || "❌ Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    if (!otp || otp.length !== 4) {
      setError("Please enter valid 4-digit OTP");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user-verify-reset-otp",
        {
          email,
          otp: otp,
        },
      );

      if (response.data.success) {
        setMessage("✅ OTP verified! Enter your new password.");
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.message || "❌ Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user-reset-password",
        {
          email,
          otp,
          newPassword,
        },
      );

      if (response.data.success) {
        setMessage(" Password reset successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user-forgot-password",
        { email },
      );

      if (response.data.success) {
        setMessage(" New OTP sent!");
        setTimeLeft(30);
        setCanResend(false);
      }
    } catch (err) {
      setError(" Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // ========== STEP 1: EMAIL FORM ==========
  if (step === 1) {
    return (
 <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
     <div className="text-center mb-6">
  <HiLockClosed className="text-5xl text-violet-600 mx-auto mb-3" />
  <b className="text-2xl font-bold text-violet-600 block">
    Forgot Password?
  </b>
  
</div>
          {error && (
            <div className="mb-4 p-3 rounded-lg text-center text-sm bg-red-100 text-red-700 border border-red-200">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 rounded-lg text-center text-sm bg-green-100 text-green-700 border border-green-200">
              {message}
            </div>
          )}

          <form onSubmit={handleSendOTP}>
            <div className="mb-4">
              <label className="block flex flex-start text-gray-700 font-semibold mb-2 text-sm">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition text-black text-sm "
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>

          <button
            onClick={() => navigate("/login")}
            className="w-full text-gray-500 text-sm mt-4 hover:text-purple-600 transition flex items-center justify-center gap-1"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    );
  }

  // ========== STEP 2: OTP FORM ==========
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">📧</div>
            <h2 className="text-2xl font-bold text-gray-800">Verify OTP</h2>
            <p className="text-gray-500 text-sm mt-2">
              Enter the 4-digit code sent to <br />
              <strong className="text-purple-600">{email}</strong>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-center text-sm bg-red-100 text-red-700 border border-red-200">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 rounded-lg text-center text-sm bg-green-100 text-green-700 border border-green-200">
              {message}
            </div>
          )}

          <form onSubmit={handleVerifyOTP}>
            <div className="mb-4">
              <label className="block flex flex-start text-gray-700 font-semibold mb-2 text-sm">
                OTP Code
              </label>
              <input
                type="text"
                maxLength="4"
                placeholder="0000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full text-center text-3xl tracking-widest border-2 border-gray-200 rounded-lg py-4 focus:outline-none focus:border-purple-500 transition"
                autoFocus
              />
            </div>

            <div className="text-center mb-4">
              {!canResend ? (
                <p className="text-sm text-gray-600">
                  OTP expires in:{" "}
                   <span className={`font-bold ${getTimerColor()}`}>
                {formatTime(timeLeft)}
              </span>
                </p>
              ) : (
                <p className="text-sm text-red-600">
                  OTP expired. Please resend.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 mb-3"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>

            {canResend && (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isLoading}
                className="w-full text-purple-600 text-sm hover:text-purple-700 transition"
              >
                Resend OTP
              </button>
            )}
          </form>

          <button
            onClick={() => setStep(1)}
            className="w-full text-gray-500 text-sm mt-4 hover:text-purple-600 transition flex items-center justify-center gap-1"
          >
            ← Back to Email
          </button>
        </div>
      </div>
    );
  }

  // ========== STEP 3: RESET PASSWORD FORM ==========
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">🔐</div>
          <h2 className="text-2xl font-bold text-violet-800">Reset Password</h2>
          <p className="text-gray-500 text-sm mt-2">Enter your new password</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-center text-sm bg-red-100 text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 rounded-lg text-center text-sm bg-green-100 text-green-700 border border-green-200">
            {message}
          </div>
        )}

        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <label className="block flex flex-start   text-gray-700 font-semibold mb-2 text-sm">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5 text-gray-500"
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
                    className="h-5 w-5 text-gray-500"
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

          <div className="mb-6">
            <label className="block flex flex-start text-gray-700 font-semibold mb-2 text-sm">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <button
          onClick={() => navigate("/login")}
          className="w-full text-gray-500 text-sm mt-4 hover:text-purple-600 transition flex items-center justify-center gap-1"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
