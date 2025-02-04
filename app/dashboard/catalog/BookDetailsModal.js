import React from 'react';
import { X, BookOpen, User2, Bookmark, LibraryBig, Layout, CheckCircle2, Clock } from 'lucide-react';

const BookDetailsModal = ({ book, onClose, userRole }) => {
  const availableCopies = book.copies.filter(copy => copy.status === "available").length;
  const borrowedCopies = book.copies.filter(copy => copy.status === "borrowed").length;
  const reservedCopies = book.copies.filter(copy => copy.status === "reserved").length;

  const statusColor = availableCopies > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700';
  const statusText = availableCopies > 0 ? 'Available' : 'Unavailable';

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl w-[95%] max-w-4xl mx-auto shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="relative h-48 bg-gradient-to-r from-blue-600 to-blue-800 p-6 flex items-end">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-white z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                {statusText}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-1">
              {book.title}
            </h2>
            <p className="text-white/80 flex items-center gap-2">
              <User2 className="w-4 h-4" /> {book.author}
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Column - Image */}
            <div className="md:col-span-1">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                <img 
                  src={`https://drive.google.com/thumbnail?id=${book.image_url}&sz=w1000`} 
                  alt={book.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-gray-500 text-sm mb-1 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Available
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{availableCopies}</div>
                </div>
                {userRole === 'librarian' && (
                  <>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="text-gray-500 text-sm mb-1 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> Borrowed
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{borrowedCopies}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="text-gray-500 text-sm mb-1 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Reserved
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{reservedCopies}</div>
                    </div>
                  </>
                )}
              </div>

              {/* Book Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">ISBN</label>
                    <div className="text-gray-900">{book.isbn}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Genre</label>
                    <div className="text-gray-900">{book.genre}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Department</label>
                    <div className="text-gray-900">{book.department}</div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-900 mt-1 leading-relaxed">{book.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              Close
            </button>
            {availableCopies > 0 && userRole !== 'librarian' && (
              <button
                className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
              >
                <Bookmark className="w-4 h-4" />
                Reserve Book
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsModal;