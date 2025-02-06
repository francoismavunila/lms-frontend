'use client';

import React, { useState, useEffect } from 'react';

export default function BorrowHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem('lms_authToken');
            try {
                const response = await fetch(`${backend_url}/api/v1/books/borrow-history`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setHistory(data);
                } else {
                    setError('Failed to fetch borrow history');
                }
            } catch (error) {
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [backend_url]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">📚 Borrow History</h1>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
                <table className="w-full text-black border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-3 text-left">📖 Book Title</th>
                            <th className="border border-gray-300 p-3 text-left">📅 Borrow Date</th>
                            <th className="border border-gray-300 p-3 text-left">⏳ Due Date</th>
                            <th className="border border-gray-300 p-3 text-left">✅ Returned Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center p-4 text-gray-500">
                                    No borrowed books found.
                                </td>
                            </tr>
                        ) : (
                            history.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 p-3">{item.bookTitle}</td>
                                    <td className="border border-gray-300 p-3">{new Date(item.borrowDate).toLocaleDateString()}</td>
                                    <td className="border border-gray-300 p-3">{new Date(item.dueDate).toLocaleDateString()}</td>
                                    <td className="border border-gray-300 p-3">
                                        {item.returnedDate ? new Date(item.returnedDate).toLocaleDateString() : '📌 Not Returned'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
