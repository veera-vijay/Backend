import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Login from "./Login"

function Register() {
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg('');

    try {
      const response = await axios.post('http://localhost:5000/api/user-post', {
        username,
        email,
        password,
        age,
        gender
      });
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          console.log("Token saved from registration:", response.data.token);
        }
      setMsg({ type: 'success', text: 'Registration successful!' });
      setUsername('');
      setEmail('');
      setPassword('');
      setAge('');
      setGender('');
       setTimeout(() => {
        navigate('/Login');
       }, 1500);
    } catch (error) {
      setMsg({ type: 'error', text: error.response?.data?.message || 'Registration failed' });
      setTimeout(() => setMsg(''), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center p-3">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-[350px] sm:max-w-sm">
        <div className="text-center mb-3">
          <i className="text-base font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Create Account
          </i>
        </div>

        {msg && (
          <div
            className={`mb-2 p-1.5 rounded text-center text-xs ${
              msg.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label className="block flex flex-start text-gray-600 text-xs font-medium mb-0.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-purple-500 font-medium text-black text-xs"
              placeholder="Enter username"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block flex flex-start text-gray-600 text-xs font-medium mb-0.5 ">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-purple-500 font-medium text-black text-xs"
              placeholder="Enter email"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="flex flex-start text-gray-600 text-xs font-medium mb-0.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-purple-500 font-medium text-black text-xs pr-8"
                placeholder="Enter password"
                required
                disabled={isLoading}
              />

              {/* Eye Icon Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-2 cursor-pointer flex items-center cursor-pointer focus:outline-none"
              >
                {showPassword ? (
                  // Eye Open - Password Visible
                  <svg
                    className="h-3.5 w-3.5 text-gray-400 hover:text-purple-600 transition"
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
                  // Eye Closed - Password Hidden
                  <svg
                    className="h-3.5 w-3.5 text-gray-400 hover:text-purple-600 transition"
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

          <div className="flex flex-col gap-2">
            <div className="flex-1">
              <label className="block flex flex-start text-gray-600 text-xs font-medium mb-0.5">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-purple-500 font-medium text-black text-xs"
                placeholder="Age"
                required
                disabled={isLoading}
              />
            </div>

           <div>
  <label className="block text-gray-600 flex flex-start text-xs font-medium mb-2">
    Gender
  </label>
  <div className="flex gap-4">
    {/* Male - Medium size with Blue accent */}
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="gender"
        value="male"
        checked={gender === "male"}
        onChange={(e) => setGender(e.target.value)}
        disabled={isLoading}
        className=" text-blue-600 focus:ring-blue-500 focus:ring-offset-0 accent-blue-600"
        
      />
      <span className="text-xs text-gray-700">Male</span>
    </label>

    {/* Female - Medium size with Blue accent */}
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="gender"
        value="female"
        checked={gender === "female"}
        onChange={(e) => setGender(e.target.value)}
        disabled={isLoading}
        className=" text-blue-600 focus:ring-blue-500 focus:ring-offset-0 accent-blue-600"
       
      />
      <span className="text-xs text-gray-700">Female</span>
    </label>

    {/* Other - Medium size with Blue accent */}
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="gender"
        value="other"
        checked={gender === "other"}
        onChange={(e) => setGender(e.target.value)}
        disabled={isLoading}
        className=" text-blue-600 focus:ring-blue-500 focus:ring-offset-0 accent-blue-600"
        
      />
      <span className="text-xs text-gray-700">Other</span>
    </label>
  </div>
</div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r cursor-pointer from-purple-600 to-indigo-600 text-white font-semibold py-1.5 rounded transition-opacity hover:opacity-90 text-sm mt-1 disabled:opacity-50"
          >
            {isLoading ? "Registering..." : "Submit"}
          </button>
        </form>

        <div className="mt-3 text-center">
          <p className="text-gray-600 text-xs">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-purple-600 cursor-pointer font-semibold"
            >
              Login
            </button>
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate("/Home")}
        className="fixed top-4 cursor-pointer left-4 bg-white/90 backdrop-blur-sm text-purple-600 font-semibold py-1.5 px-3 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm"
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
}

export default Register;