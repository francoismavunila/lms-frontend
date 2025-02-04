'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Filter,
  X,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import BookForm from './BookForm';
import BookEditForm from './BookEditForm';

const departments = ["All", "Science", "Social Sciences", "Arts", "Engineering"];
const genres = ["All", "Academic", "Fiction", "Reference", "Journal"];
const categories = ["All", "Psychology", "Mathematics", "Physics", "Literature"];

export default function BookCatalog() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Keeping all the original useEffect and handler functions...
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${backend_url}/api/v1/books/books`);
        if (response.ok) {
          const data = await response.json();
          setBooks(data);
        } else {
          console.error('Failed to fetch books');
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('lms_authToken');
      if (!token) {
        router.push('/login');
        return;
      }
      if (token) {
        try {
          const response = await fetch(`${backend_url}/api/v1/users/user`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUserRole(userData.role);
          } else {
            console.error('Failed to fetch user role');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    };

    fetchUserRole();
  }, []);

  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);
    
    const matchesDepartment = selectedDepartment === "All" || book.department === selectedDepartment;
    const matchesGenre = selectedGenre === "All" || book.genre === selectedGenre;
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;

    return matchesSearch && matchesDepartment && matchesGenre && matchesCategory;
  });

  const handleAddBook = (newBook) => {
    setBooks([...books, { ...newBook, id: books.length + 1 }]);
    setIsAddingBook(false);
  };

  const handleEditBook = (updatedBook) => {
    setBooks(books.map(book => 
      book.id === updatedBook.id ? updatedBook : book
    ));
    setEditingBook(null);
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const response = await fetch(`${backend_url}/api/v1/books/delete/${bookId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setBooks(books.filter(book => book.id !== bookId));
        } else {
          console.error('Failed to delete book');
        }
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          Book Catalog
        </h1>
        {userRole === 'librarian' && (
          <button
            onClick={() => setIsAddingBook(true)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-black rounded-lg hover:bg-black/60 transition-all duration-300 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Book
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
        
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="bg-white border border-gray-200 text-gray-800 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        >
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept} Department</option>
          ))}
        </select>
        
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="bg-white border border-gray-200 text-gray-800 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        >
          {genres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border border-gray-200 text-gray-800 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map(book => (
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
                {userRole === 'librarian' && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => setEditingBook(book)}
                      className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="p-1 hover:bg-red-50 rounded text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-500 mb-2">ISBN: {book.isbn}</p>
              <div className="flex flex-wrap gap-1">
                {[book.department, book.genre, book.category].map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add/Edit Book Modal */}
      {isAddingBook && (
        <BookForm
          onSubmit={handleAddBook}
          onCancel={() => setIsAddingBook(false)}
        />
      )}
      {editingBook && (
        <BookEditForm
          book={editingBook}
          onSubmit={handleEditBook}
          onCancel={() => setEditingBook(null)}
        />
      )}
    </div>
  );
}