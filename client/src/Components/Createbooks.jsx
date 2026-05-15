import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Createbooks = () => {
  const [details, setDetails] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");

    if (!title || !author || !category || !publishedYear) {
      setMsg({ type: "error", text: "Please fill in all fields" });
      setIsLoading(false);
      setTimeout(() => setMsg(""), 3000);
      return;
    }

    const bookData = {
      title,
      author,
      publishedYear: parseInt(publishedYear),
      category,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user-createbook",
        bookData
       
      );

      console.log(response.data);
      setDetails(response.data);
      setMsg({ type: "success", text: "Book created successfully!" });

      setTitle("");
      setAuthor("");
      setCategory("");
      setPublishedYear("");

      setTimeout(() => setMsg(""), 3000);
    } catch (error) {
      console.error(error);
      setMsg({ type: "error", text: "Error creating book. Please try again." });
      setTimeout(() => setMsg(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-white rounded-xl shadow-xl p-5 w-full max-w-sm">
        <div className="text-center flex justify-center gap-2 mb-3">
          <div className="inline-block  p-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mb-2">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <b className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Create New Book
          </b>
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
            <label className="block flex flex-start  text-gray-600 text-xs font-semibold mb-0.5">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-black px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 text-xs placeholder-black-400 bg-white font-medium text-xs"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block flex flex-start text-gray-600 text-xs font-semibold mb-0.5">
              Author
            </label>
            <input
              type="text"
              placeholder="Enter author name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full text-black px-2 py-1.5 font-medium border border-gray-300 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 text-xs"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block  flex flex-start text-gray-600 text-xs font-semibold mb-0.5">
              Published Year
            </label>
            <input
              type="number"
              placeholder="Enter published year"
              value={publishedYear}
              onChange={(e) => setPublishedYear(e.target.value)}
              className="w-full px-2 py-1.5 border font-medium border-gray-300 rounded text-black focus:outline-none focus:border-purple-500 focus:ring-1 font-medium focus:ring-purple-200 text-xs"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block flex flex-start text-gray-600 text-xs font-semibold mb-0.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-purple-500 font-medium text-xs ${
              category ? "text-black" : "text-gray-500"
              }`}
              disabled={isLoading}
            >
              <option value="">Select Category</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Technology">Technology</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-1.5 rounded transition-all duration-300 hover:opacity-90 disabled:opacity-50 text-sm mt-2"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-3 w-3 mr-1 text-white"
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
                Creating...
              </span>
            ) : (
              "Create Book"
            )}
          </button>
        </form>
      </div>

      <button
        onClick={() => navigate("/Admin")}
        className="fixed top-3 left-3  cursor-pointer bg-white/90 backdrop-blur-sm text-purple-600 font-semibold py-1 px-2.5 rounded-lg shadow-md hover:bg-white text-xs flex items-center gap-1"
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

export default Createbooks;
