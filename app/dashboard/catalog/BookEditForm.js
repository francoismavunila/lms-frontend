import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const BookEditForm = ({ book, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: book.title || "",
    author: book.author || "",
    isbn: book.isbn || "",
    genre: book.genre || "",
    department: book.department || "",
    description: book.description || "",
  });
  const [loading, setLoading] = useState(false);

  const departments = ["All", "Science", "Social Sciences", "Arts", "Engineering"];
  const genres = ["All", "Academic", "Fiction", "Reference", "Journal"];

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.patch(`${backend_url}/api/v1/books/book/${book.id}`, formData);
      onSubmit(response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-200 bg-white";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  const buttonClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-200";

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-[80%] max-w-3xl mx-auto shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Book
          </h2>
          <button
            onClick={onCancel}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className={inputClasses}
                required
                placeholder="Enter book title"
              />
            </div>
            <div>
              <label className={labelClasses}>Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                className={inputClasses}
                required
                placeholder="Enter author name"
              />
            </div>
            <div>
              <label className={labelClasses}>ISBN</label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                className={inputClasses}
                required
                placeholder="Enter ISBN"
              />
            </div>
            <div>
              <label className={labelClasses}>Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className={inputClasses}
              >
                <option value="">Select Department</option>
                {departments.filter(d => d !== "All").map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClasses}>Genre</label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({...formData, genre: e.target.value})}
                className={inputClasses}
              >
                <option value="">Select Genre</option>
                {genres.filter(g => g !== "All").map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelClasses}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className={`${inputClasses} h-24 resize-none`}
                placeholder="Enter book description"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className={`${buttonClasses} border border-gray-200 text-gray-700 hover:bg-gray-50`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${buttonClasses} bg-red-500 text-white hover:bg-red-600`}
            >
              Save Changes
            </button>
          </div>
        </form>
        {loading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-gray-900 text-lg font-medium bg-white px-6 py-4 rounded-lg shadow-lg">
              Updating data, please wait...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookEditForm;
