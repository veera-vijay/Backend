import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const Viewbooks = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [editingBook, setEditingBook] = useState(null) //pop
    const [deletingBook, setDeletingBook] = useState(null)//pop
    const [editForm, setEditForm] = useState({ title: '', author: '', category: '', publishedYear: '' })
    const [updating, setUpdating] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [message, setMessage] = useState(null)
    const navigate = useNavigate()


    useEffect(() => {
        fetchBooks()
    }, [])

    const fetchBooks = async () => {
        try {
            setLoading(true)
            const response = await axios.get("http://localhost:5000/api/user-viewall")
            const booksData = response.data.data || response.data
            setUsers(Array.isArray(booksData) ? booksData : [])
        } catch (error) {
            console.error('Error fetching books:', error)
            setError('Failed to load books. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const openEditModal = (book) => {
        setEditingBook(book)
        setEditForm({
            title: book.title || '',
            author: book.author || '',
            category: book.category || '',
            publishedYear: book.publishedYear || ''
        })
    }

    const openDeleteModal = (book) => {
        setDeletingBook(book)
    }

    const closeModals = () => {
        setEditingBook(null)
        setDeletingBook(null)
        setMessage(null)
    }

    const handleEditChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        })
    }

    const saveEdit = async () => {
        setUpdating(true)
        setMessage(null)

        try {
            await axios.put(
                `http://localhost:5000/api/user-updatebook/${editingBook._id}`,
                editForm
              
            )

            setMessage({ type: 'success', text: '✅ Book updated successfully!' })
            
            setUsers(users.map(book => 
                book._id === editingBook._id ? { ...book, ...editForm } : book
            ))
            
            setTimeout(() => {
                closeModals()
                setMessage(null)
            }, 1500)
            
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || '❌ Failed to update book' })
        } finally {
            setUpdating(false)
        }
    }

    const confirmDelete = async () => {
        setDeleting(true)
        setMessage(null)

        try {
            await axios.delete(
                `http://localhost:5000/api/user-deletebook/${deletingBook._id}`,
               
            )

            setMessage({ type: 'success', text: '🗑️ Book deleted successfully!' })
            
            setUsers(users.filter(book => book._id !== deletingBook._id))
            
            setTimeout(() => {
                closeModals()
                setMessage(null)
            }, 1500)
            
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || '❌ Failed to delete book' })
        } finally {
            setDeleting(false)
        }
    }

    const getAnimationClass = (index) => {
        const animations = [
            'animate-slideInLeft', 'animate-slideInRight', 'animate-fadeInUp',
            'animate-zoomIn', 'animate-flipIn', 'animate-bounceIn'
        ]
        return animations[index % animations.length]
    }

    const getGradientClass = (index) => {
        const gradients = [
            'from-blue-500 to-indigo-600', 'from-purple-500 to-pink-600',
            'from-green-500 to-teal-600', 'from-orange-500 to-red-600'
        ]
        return gradients[index % gradients.length]
    }

    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-6">
              <div className="flex gap-1.5 p-1 bg-white shadow-sm mb-2 rounded flex justify-center h-10  rounded-full ">
                <i className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  All Books
                </i>
                <span className="text-xl">📚</span>
              </div>
              <p className="text-gray-600 text-sm">
                {users.length} books in library
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600 text-sm">Loading...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg mb-4 text-center text-sm">
                {error}
              </div>
            )}

            {/* Books Grid - Compact Cards */}
            {!loading && !error && (
              <>
                {users.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <span className="text-5xl block mb-2">📖</span>
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">
                      No Books Found
                    </h3>
                    <button
                      onClick={() => navigate("/Createbook")}
                      className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-1.5 px-4 rounded-lg transition"
                    >
                      Create Book
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {users.map((user, index) => (
                      <div
                        key={user._id || index}
                        className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${getAnimationClass(index)}`}
                      >
                        {/* Small color bar */}
                        <div
                          className={`h-1 bg-gradient-to-r ${getGradientClass(index)}`}
                        ></div>

                        <div className="p-4 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-white/50 relative">
                          {/* Ribbon Badge - Top Right */}

                          {/* Cover Image Placeholder */}
                          <div className="relative mb-4">
                            <div className="w-full h-28 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                              <span className="text-5xl opacity-80">📚</span>
                            </div>
                          </div>

                          {/* Book Title */}
                          {/* Key-Value Pairs - Perfect Alignment */}
                          <div className="space-y-2">
                            {/* Title Row - Full width (special handling) */}
                            <div className="pb-1.5">
                              <span className="text-[11px] font-semibold text-gray-500">
                                📚 TITLE
                              </span>
                              <p className="text-xs text-gray-800 font-medium mt-0.5 break-words">
                                {user.title || "Untitled"}
                              </p>
                            </div>

                            {/* Author Row */}
                            <div className="flex justify-between items-baseline border-b border-gray-100 pb-1.5">
                              <span className="text-[11px] font-semibold text-gray-500">
                                ✍️ AUTHOR
                              </span>
                              <span className="text-xs  font-semibold  text-gray-700 text-right max-w-[60%] break-words">
                                {user.author || "N/A"}
                              </span>
                            </div>

                            {/* Category Row */}
                            <div className="flex justify-between items-baseline border-b border-gray-100 pb-1.5">
                              <span className="text-[11px] font-semibold text-gray-500">
                                📂 CATEGORY
                              </span>
                              <span className="text-xs font-semibold text-gray-700 text-right capitalize max-w-[60%] break-words">
                                {user.category || "N/A"}
                              </span>
                            </div>

                            {/* Year Row */}
                            <div className="flex justify-between items-baseline pt-1">
                              <span className="text-[11px] font-semibold text-gray-500">
                                📅 YEAR
                              </span>
                              <span className="text-xs font-semibold text-gray-800 text-right">
                                {user.publishedYear || "N/A"}
                              </span>
                            </div>
                          </div>

                          {/* Buttons */}
                          <div className="flex gap-2 mt-4 pt-2 border-t border-gray-100">
                            <button
                              onClick={() => openEditModal(user)}
                              className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white text-xs font-semibold py-1.5 rounded-lg transition"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => openDeleteModal(user)}
                              className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-xs font-semibold py-1.5 rounded-lg transition"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Back Button */}
            <button
              onClick={() => navigate("/createbook")}
              className="fixed bottom-4 left-4 bg-white/90 backdrop-blur-sm text-purple-600 font-semibold py-1.5 px-3 rounded-lg shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm"
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
              Go to Createbook
            </button>
          </div>
        </div>

        {/* EDIT MODAL - editbooking put */}
        {editingBook && (
          <div className="fixed inset-0 flex bg-white/50  items-center justify-center  p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full">
              <div className="bg-gradient-to-r from-yellow-500 to-amber-500 px-4 py-3 rounded-t-xl">
                <h3 className="text-white font-semibold">Edit Book</h3>
                <p className="text-yellow-100 text-xs">Update book details</p>
              </div>

              <div className="p-4">
                {message && (
                  <div
                    className={`mb-3 p-2 rounded text-xs ${
                      message.type === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <div className="space-y-2">
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    placeholder="Title"
                    className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:border-yellow-500"
                  />
                  <input
                    type="text"
                    name="author"
                    value={editForm.author}
                    onChange={handleEditChange}
                    placeholder="Author"
                    className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:border-yellow-500"
                  />
                  <select
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                    className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:border-yellow-500"
                  >
                    <option value="">Category</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Thriller">Thriller</option>
                  </select>
                  <input
                    type="number"
                    name="publishedYear"
                    value={editForm.publishedYear}
                    onChange={handleEditChange}
                    placeholder="Year"
                    className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={saveEdit}
                    disabled={updating}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-1.5 rounded"
                  >
                    {updating ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={closeModals}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-sm font-semibold py-1.5 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DELETE MODAL - Compact */}
        {deletingBook && (
          <div className="fixed inset-0 flex bg-white/50 items-center justify-center  p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full">
              <div className="bg-gradient-to-r from-red-600 to-red-500 px-4 py-3 rounded-t-xl">
                <h3 className="text-white font-semibold">Confirm Delete</h3>
              </div>

              <div className="p-4 text-center">
                <div className="text-4xl mb-2">⚠️</div>
                <p className="text-sm text-gray-700 mb-1">
                  Delete{" "}
                  <strong className="text-red-600">
                    "{deletingBook.title}"
                  </strong>
                  ?
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  This cannot be undone!
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={confirmDelete}
                    disabled={deleting}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-1.5 rounded"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    onClick={closeModals}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-sm font-semibold py-1.5 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes zoomIn {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes flipIn {
            from {
              opacity: 0;
              transform: rotateY(90deg);
            }
            to {
              opacity: 1;
              transform: rotateY(0);
            }
          }
          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: scale(0.3);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
            }
          }
          .animate-slideInLeft {
            animation: slideInLeft 0.4s ease-out;
          }
          .animate-slideInRight {
            animation: slideInRight 0.4s ease-out;
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.4s ease-out;
          }
          .animate-zoomIn {
            animation: zoomIn 0.3s ease-out;
          }
          .animate-flipIn {
            animation: flipIn 0.5s ease-out;
          }
          .animate-bounceIn {
            animation: bounceIn 0.5s ease-out;
          }
        `}</style>
      </>
    );
}

export default Viewbooks;