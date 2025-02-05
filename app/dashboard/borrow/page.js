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
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <ToastContainer />
      {!action && (
        <div className="flex justify-center items-center gap-6 mb-12">
          <button
            onClick={() => setAction('borrow')}
            className="px-6 py-3 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-red-200"
          >
            <BookOpen className="w-5 h-5" />
            Borrow a Book
          </button>
          <button
            onClick={() => setAction('return')}
            className="px-6 py-3 rounded-xl font-medium bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-orange-200"
          >
            <XCircle className="w-5 h-5" />
            Return a Book
          </button>
        </div>
      )}

      {action === 'borrow' && (
        <div className="mb-12">
          <div className="relative mb-10 max-w-2xl mx-auto">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Enter student email..."
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 shadow-sm"
            />
            <button
              onClick={handleSearchStudent}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
            >
              Search
            </button>
          </div>

          {studentDetails && (
            <div className="mb-10 bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <p className="text-gray-700"><span className="font-medium">Name:</span> {studentDetails.name}</p>
                <p className="text-gray-700"><span className="font-medium">Email:</span> {studentDetails.email}</p>
                <p className="text-gray-700"><span className="font-medium">Books Borrowed:</span> {studentDetails.borrowedBooks.length}</p>
                <p className="text-gray-700"><span className="font-medium">Pending Returns:</span> {studentDetails.pendingReturns}</p>
                <p className="text-gray-700"><span className="font-medium">Eligibility:</span> 
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm ${studentDetails.eligible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {studentDetails.eligible ? 'Eligible' : 'Not Eligible'}
                  </span>
                </p>
              </div>
              {studentDetails.pendingReturns >= 3 && (
                <p className="mt-4 text-red-600 bg-red-50 p-4 rounded-lg">Student has 3 or more borrowed but not returned books and cannot borrow more.</p>
              )}
            </div>
          )}

          {studentDetails && studentDetails.eligible && studentDetails.pendingReturns < 3 && (
            <div className="relative mb-10 max-w-2xl mx-auto">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for a book..."
                value={bookSearchTerm}
                onChange={(e) => setBookSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 shadow-sm"
              />
              <button
                onClick={handleSearchBooks}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
              >
                Search
              </button>
            </div>
          )}

          {availableBooks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {availableBooks.map(book => (
                <div key={book.id} className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="relative pt-[140%]">
                    <img 
                      src={`https://drive.google.com/thumbnail?id=${book.image_url}&sz=w1000`} 
                      alt={book.title} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </div>

                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{book.title}</h3>
                      <p className="text-gray-600">{book.author}</p>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-4">ISBN: {book.isbn}</p>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleBorrowBook(book.id)}
                        className="px-6 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-red-200"
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
        <div className="mb-12">
          <div className="relative mb-10 max-w-2xl mx-auto">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Enter student email..."
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 shadow-sm"
            />
            <button
              onClick={handleSearchStudent}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-lg font-medium bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300"
            >
              Search
            </button>
          </div>

          {studentDetails && (
            <div className="mb-10 bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <p className="text-gray-700"><span className="font-medium">Name:</span> {studentDetails.name}</p>
                <p className="text-gray-700"><span className="font-medium">Email:</span> {studentDetails.email}</p>
                <p className="text-gray-700"><span className="font-medium">Books Borrowed:</span> {studentDetails.borrowedBooks.length}</p>
                <p className="text-gray-700"><span className="font-medium">Pending Returns:</span> {studentDetails.pendingReturns}</p>
                <p className="text-gray-700"><span className="font-medium">Eligibility:</span> 
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm ${studentDetails.eligible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {studentDetails.eligible ? 'Eligible' : 'Not Eligible'}
                  </span>
                </p>
              </div>
            </div>
          )}

          {studentDetails && studentDetails.borrowedBooks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {studentDetails.borrowedBooks.filter(record => !record.returned_date).map(record => (
                <div key={record.book_copy.id} className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="relative pt-[140%]">
                    <img 
                      src={`https://drive.google.com/thumbnail?id=${record.book_copy.book.image_url}&sz=w1000`} 
                      alt={record.book_copy.book.title} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </div>

                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{record.book_copy.book.title}</h3>
                      <p className="text-gray-600">{record.book_copy.book.author}</p>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-4">ISBN: {record.book_copy.book.isbn}</p>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleReturnBook(record.book_copy.id)}
                        className="px-6 py-2 rounded-lg font-medium bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-orange-200"
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
        <div className="mt-12 flex justify-center">
          <button
            onClick={handleNextStudent}
            className="px-6 py-3 rounded-xl font-medium bg-black text-white hover:bg-gray-900 transition-all duration-300 shadow-lg"
          >
            Next Student
          </button>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-gray-900 text-lg font-medium bg-white px-8 py-6 rounded-xl shadow-xl">
            Processing, please wait...
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowPage;