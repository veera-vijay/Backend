import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StdForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [course, setCourse] = useState("");
  const [gender, setGender] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");

    // Validation
    if (!name || !email || !course || !gender) {
      setMsg({ type: "error", text: "Please fill all required fields" });
      setIsLoading(false);
      return;
    }

    const studentData = {
      name: name,
      email: email,
      course: course,
      age: age,
      gender: gender,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user-poststd",
        studentData,
       
      );

      console.log("Response:", response.data);
      setMsg({ type: "success", text: "Registration successful!" });

      // Reset form
      setName("");
      setEmail("");
      setCourse("");
      setAge("");
      setGender("");

      setTimeout(() => {
        navigate("/viewallstd");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setMsg({
        type: "error",
        text: error.response?.data?.message || "Registration failed",
      });
      setTimeout(() => setMsg(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center p-3">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-[350px] sm:max-w-sm">
        <div className="text-center mb-3">
          <i className="text-base font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Student Registration
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
          {/* Name Field */}
          <div>
            <label className="block  flex flex-start text-gray-600 text-xs font-medium mb-0.5">
              Student Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-purple-500 font-medium text-black text-xs"
              placeholder="Enter student name"
              required
              disabled={isLoading}
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block  flex flex-start  text-gray-600 text-xs font-medium mb-0.5">
              Email *
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

          {/* Course Field */}
          <div>
            <label className="block   flex flex-start  text-gray-600 text-xs font-medium mb-0.5">
              Course *
            </label>
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-purple-500 font-medium text-black text-xs"
              placeholder="Enter course"
              required
              disabled={isLoading}
            />
          </div>

          {/* Age Field */}
          <div>
            <label className="block  flex flex-start text-gray-600 text-xs font-medium mb-0.5">
              Age*
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-purple-500 font-medium text-black text-xs"
              placeholder="Enter age"
              disabled={isLoading}
            />
          </div>

          {/* Gender Field */}
          <div>
            <label className="block text-gray-600 flex flex-start text-xs font-medium mb-0.5">
              Gender *
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className={`w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-purple-500 font-medium text-xs ${
                gender ? "text-black" : "text-gray-400"
              }`}
              required
              disabled={isLoading}
            >
              <option value="" disabled className="text-gray-400">
                Select Gender
              </option>
              <option value="male" className="text-black">
                Male
              </option>
              <option value="female" className="text-black">
                Female
              </option>
              <option value="other" className="text-black">
                Other
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600  cursor-pointer to-indigo-600 text-white font-semibold py-1.5 rounded transition-opacity hover:opacity-90 text-sm mt-1 disabled:opacity-50"
          >
            {isLoading ? "Registering..." : "Submit"}
          </button>
        </form>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/adminstd")}
        className="fixed bottom-4 left-4 bg-white/90 cursor-pointer backdrop-blur-sm text-purple-600 font-semibold py-1.5 px-3 rounded-lg shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm"
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
        Go to Admin
      </button>
    </div>
  );
}

export default StdForm;
