"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyBooks() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("lms_authToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/user/book/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch user profile");
        }

        setUser(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  }

  if (!user) {
    return null;
  }

  const upcomingDueBooks = user.borrow_records.filter((record) => {
    const dueDate = new Date(record.due_date);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });

  return (
    <div className="bg-white text-black min-h-screen p-6 md:p-12">
      <ToastContainer />
      <h2 className="text-4xl font-bold mb-6 text-center text-black/60">My Borrowed Books</h2>

      {upcomingDueBooks.length > 0 && (
        <div className="mb-6 p-4 bg-orange-100 border-l-4 border-orange-500 text-orange-800 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg">Upcoming Due Dates</h3>
          <ul className="list-disc pl-5 mt-2">
            {upcomingDueBooks.map((record) => (
              <li key={record.id}>
                <strong>{record.book_copy.book.title}</strong> - Due on {" "}
                <span className="text-red-600">{new Date(record.due_date).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {user.borrow_records.map((record) => (
          <div
            key={record.id}
            className="bg-white text-black rounded-5xl shadow-lg p-5 hover:scale-105 transition-transform duration-300"
          >
            <img
              src={`https://drive.google.com/thumbnail?id=${record.book_copy.book.image_url}&sz=w1000`}
              alt={record.book_copy.book.title}
              className="h-48 w-full object-cover rounded-lg mb-4"
            />
            <h3 className="text-2xl font-semibold mb-2 text-secondary">{record.book_copy.book.title}</h3>
            <p className="text-gray-800 mb-1"><strong>Author:</strong> {record.book_copy.book.author}</p>
            <p className="text-gray-800 mb-1"><strong>Genre:</strong> {record.book_copy.book.genre}</p>
            <p className="text-gray-800 mb-1"><strong>Department:</strong> {record.book_copy.book.department}</p>
            <p className="text-gray-800 mb-1"><strong>Borrow Date:</strong> {new Date(record.borrow_date).toLocaleDateString()}</p>
            <p className="text-gray-800 mb-1"><strong>Due Date:</strong> {new Date(record.due_date).toLocaleDateString()}</p>
            <p
              className={`text-lg font-bold py-1 px-2 rounded mt-3 inline-block ${
                record.returned_date ? "bg-green-500 text-black" : "bg-primary text-white"
              }`}
            >
              {record.returned_date ? "Returned" : "Not Returned"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
