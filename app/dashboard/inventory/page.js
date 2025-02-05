"use client";

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Search, BookOpen, AlertTriangle, Archive } from "lucide-react";

export default function Inventory() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  // Keeping all the existing useEffect and function logic the same
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/books/books`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch books");
        }

        setBooks(data);
        console.log(data)
        setFilteredBooks(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/inventory/stats`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch stats");
        }

        setStats(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      }
    };

    fetchBooks();
    fetchStats();
  }, []);

  useEffect(() => {
    if (!selectedBook && !filterStatus) {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter((book) => {
        const matchesSearch = !searchTerm || book.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBook = !selectedBook || book.id === selectedBook.id;
        const matchesStatus = !filterStatus || book.copies.some((copy) => copy.status === filterStatus);
        return matchesSearch && matchesBook && matchesStatus;
      });
      setFilteredBooks(filtered);
    }
  }, [books, searchTerm, selectedBook, filterStatus]);

  const markAsDamagedOrLost = async (bookCopyId, status) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/inventory/inventory/${bookCopyId}/status/${status}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update book status");
      }

      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.copies.some(copy => copy.id === bookCopyId) ? { 
            ...book, 
            copies: book.copies.map(copy => copy.id === bookCopyId ? { ...copy, status } : copy)
          } : book
        )
      );

      toast.success(`Book marked as ${status}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg shadow-sm">
          <AlertTriangle className="w-6 h-6 mb-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Library Inventory Management</h2>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: "Total Book Types", value: stats.total_book_types, icon: BookOpen },
            { label: "Total Copies", value: stats.total_copies, icon: Archive },
            { label: "Available Copies", value: stats.total_available_copies, icon: BookOpen },
            { label: "Borrowed Copies", value: stats.total_borrowed_copies, icon: BookOpen },
            { label: "Damaged Copies", value: stats.total_damaged_copies, icon: AlertTriangle },
            { label: "Lost Copies", value: stats.total_lost_copies, icon: AlertTriangle }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
              <stat.icon className="w-6 h-6 text-secondary mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div> */}
            <select
              value={selectedBook?.id || ""}
              onChange={(e) => setSelectedBook(books.find(book => book.id === parseInt(e.target.value)) || null)}
              className="p-2 border text-black border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select a book</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>{book.title}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border text-black border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Filter by status</option>
              <option value="available">Available</option>
              <option value="borrowed">Borrowed</option>
              <option value="damaged">Damaged</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.map((book) => (
          <div key={book.id} className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">{book.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {book.copies.map((copy) => (
                <div key={copy.id} className="bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md">
                  <img
                    src={`https://drive.google.com/thumbnail?id=${book.image_url}&sz=w1000`}
                    alt={book.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-6">
                    <h4 className="text-xl font-semibold mb-4 text-gray-900">{book.title}</h4>
                    <div className="space-y-2 mb-6">
                      <p className="text-sm text-gray-600"><span className="font-medium">Author:</span> {book.author}</p>
                      <p className="text-sm text-gray-600"><span className="font-medium">Genre:</span> {book.genre}</p>
                      <p className="text-sm text-gray-600"><span className="font-medium">Department:</span> {book.department}</p>
                      <p className="text-sm">
                        <span className="font-medium">Status: </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${copy.status === 'available' ? 'bg-green-100 text-green-800' :
                          copy.status === 'borrowed' ? 'bg-blue-100 text-blue-800' :
                          copy.status === 'damaged' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                          {copy.status}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => markAsDamagedOrLost(copy.id, "damaged")}
                        className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Mark as Damaged
                      </button>
                      <button
                        onClick={() => markAsDamagedOrLost(copy.id, "lost")}
                        className="flex-1 bg-yellow-50 text-yellow-600 py-2 px-4 rounded-lg hover:bg-yellow-100 transition-colors"
                      >
                        Mark as Lost
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}