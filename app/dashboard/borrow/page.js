'use client'
import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  XCircle 
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BorrowPage = () => {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(null);
  const [studentEmail, setStudentEmail] = useState("");
  const [studentDetails, setStudentDetails] = useState(null);
  const [bookSearchTerm, setBookSearchTerm] = useState("");
  const [availableBooks, setAvailableBooks] = useState([]);
  const [borrowedBook, setBorrowedBook] = useState(null);

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleSearchStudent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backend_url}/api/v1/users/user/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: studentEmail }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("student", data)
        const borrowedBooks = data.borrow_records || [];
        const pendingReturns = borrowedBooks.filter(record => !record.returned_date).length;
        setStudentDetails({
          id: data.id,
          name: data.username,
          email: data.email,
          borrowedBooks,
          pendingReturns,
          eligible: data.is_active && pendingReturns < 3,
        });
        toast.success('Student details fetched successfully');
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.detail);
        toast.error(errorData.detail || 'Failed to fetch student details');
      }
    } catch (error) {
      toast.error('Error fetching student details');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backend_url}/api/v1/books/books/search?query=${bookSearchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableBooks(data);
        toast.success('Books fetched successfully');
      } else {
        toast.error('Failed to fetch books');
      }
    } catch (error) {
      toast.error('Error fetching books');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrowBook = async (bookId) => {
    if (window.confirm("Are you sure you want to borrow this book?")) {
      setLoading(true);
      try {
        const response = await fetch(`${backend_url}/api/v1/books/borrow/${studentDetails.id}/${bookId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const borrowedBook = await response.json();
          setStudentDetails({
            ...studentDetails,
            borrowedBooks: [...studentDetails.borrowedBooks, borrowedBook],
          });
          setBorrowedBook(borrowedBook);
          toast.success('Book borrowed successfully');
          // Show alert and reset the form and state for the next student
          alert('Book borrowed successfully. Click OK to proceed to the next student.');
          setStudentEmail("");
          setStudentDetails(null);
          setBookSearchTerm("");
          setAvailableBooks([]);
          setBorrowedBook(null);
        } else {
          const errorData = await response.json();
          toast.error(errorData.detail || 'Failed to borrow book');
        }
      } catch (error) {
        toast.error('Error borrowing book');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReturnBook = async (bookCopyId) => {
    if (window.confirm("Are you sure you want to return this book?")) {
      setLoading(true);
      try {
        const response = await fetch(`${backend_url}/api/v1/books/return/${studentDetails.id}/${bookCopyId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          setStudentDetails({
            ...studentDetails,
            borrowedBooks: studentDetails.borrowedBooks.filter(book => book.book_copy.id !== bookCopyId),
          });
          toast.success('Book returned successfully');
        } else {
          const errorData = await response.json();
          toast.error(errorData.detail || 'Failed to return book');
        }
      } catch (error) {
        toast.error('Error returning book');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNextStudent = () => {
    setStudentEmail("");
    setStudentDetails(null);
    setBookSearchTerm("");
    setAvailableBooks([]);
    setBorrowedBook(null);
  };

  return (
    <div className="container mx-auto p-4 bg-white min-h-screen">
      <ToastContainer />
      {!action && (
        <div className="flex justify-center items-center mb-8">
          <button
            onClick={() => setAction('borrow')}
            className="px-4 py-2 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 transition-all duration-200 flex items-center gap-2"
          >
            Borrow a Book
          </button>
          <button
            onClick={() => setAction('return')}
            className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 flex items-center gap-2"
          >
            Return a Book
          </button>
        </div>
      )}

      {action === 'borrow' && (
        <div className="mb-8">
          <div className="relative mb-8">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Enter student email..."
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <button
              onClick={handleSearchStudent}
              className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 ml-4"
            >
              Search
            </button>
          </div>

          {studentDetails && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Student Details</h2>
              <p className="text-gray-600">Name: {studentDetails.name}</p>
              <p className="text-gray-600">Email: {studentDetails.email}</p>
              <p className="text-gray-600">Books Borrowed: {studentDetails.borrowedBooks.length}</p>
              <p className="text-gray-600">Pending Returns: {studentDetails.pendingReturns}</p>
              <p className="text-gray-600">Eligibility: {studentDetails.eligible ? 'Eligible' : 'Not Eligible'}</p>
              {studentDetails.pendingReturns >= 3 && (
                <p className="text-red-600">Student has 3 or more borrowed but not returned books and cannot borrow more.</p>
              )}
            </div>
          )}

          {studentDetails && studentDetails.eligible && studentDetails.pendingReturns < 3 && (
            <div className="relative mb-8">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for a book..."
                value={bookSearchTerm}
                onChange={(e) => setBookSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <button
                onClick={handleSearchBooks}
                className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 ml-4"
              >
                Search
              </button>
            </div>
          )}

          {availableBooks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {availableBooks.map(book => (
                <div key={book.id} className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative pt-[140%]">
                    <img 
                      src={`https://drive.google.com/thumbnail?id=${book.image_url}&sz=w1000`} 
                      alt={book.title} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 line-clamp-1">{book.title}</h3>
                        <p className="text-sm text-gray-600">{book.author}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-2">ISBN: {book.isbn}</p>
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        onClick={() => handleBorrowBook(book.id)}
                        className="px-4 py-2 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 transition-all duration-200 flex items-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        Borrow
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {action === 'return' && (
        <div className="mb-8">
          <div className="relative mb-8">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Enter student email..."
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <button
              onClick={handleSearchStudent}
              className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 ml-4"
            >
              Search
            </button>
          </div>

          {studentDetails && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Student Details</h2>
              <p className="text-gray-600">Name: {studentDetails.name}</p>
              <p className="text-gray-600">Email: {studentDetails.email}</p>
              <p className="text-gray-600">Books Borrowed: {studentDetails.borrowedBooks.length}</p>
              <p className="text-gray-600">Pending Returns: {studentDetails.pendingReturns}</p>
              <p className="text-gray-600">Eligibility: {studentDetails.eligible ? 'Eligible' : 'Not Eligible'}</p>
            </div>
          )}

          {studentDetails && studentDetails.borrowedBooks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {studentDetails.borrowedBooks.filter(record => !record.returned_date).map(record => (
                <div key={record.book_copy.id} className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative pt-[140%]">
                    <img 
                      src={`https://drive.google.com/thumbnail?id=${record.book_copy.book.image_url}&sz=w1000`} 
                      alt={record.book_copy.book.title} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 line-clamp-1">{record.book_copy.book.title}</h3>
                        <p className="text-sm text-gray-600">{record.book_copy.book.author}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-2">ISBN: {record.book_copy.book.isbn}</p>
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        onClick={() => handleReturnBook(record.book_copy.id)}
                        className="px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-200 flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Return
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {borrowedBook && (
        <div className="mt-8">
          <button
            onClick={handleNextStudent}
            className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200"
          >
            Next Student
          </button>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-gray-900 text-lg font-medium bg-white px-6 py-4 rounded-lg shadow-lg">
            Processing, please wait...
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowPage;
