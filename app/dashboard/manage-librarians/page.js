'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, UserPlus } from 'lucide-react';

export default function ManageLibrarians() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddingLibrarian, setIsAddingLibrarian] = useState(false);
    const [newLibrarian, setNewLibrarian] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const router = useRouter();
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('lms_authToken');
            try {
                const response = await fetch(`${backend_url}/api/v1/users/users`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data.filter(user => user.role === 'librarian'));
                } else {
                    setError('Failed to fetch users');
                }
            } catch (error) {
                setError('Error fetching users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [backend_url]);

    const handleAddLibrarian = async (e) => {
        e.preventDefault();
        if (newLibrarian.password !== newLibrarian.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const token = localStorage.getItem('lms_authToken');
        try {
            const response = await fetch(`${backend_url}/api/v1/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username: newLibrarian.username,
                    email: newLibrarian.email,
                    password: newLibrarian.password,
                    role: 'librarian'
                })
            });
            if (response.ok) {
                const addedLibrarian = await response.json();
                setUsers([...users, addedLibrarian]);
                setIsAddingLibrarian(false);
                setNewLibrarian({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                });
            } else {
                setError('Failed to add librarian');
            }
        } catch (error) {
            setError('Error adding librarian');
        }
    };

    if (loading) {
        return <div className="text-center text-gray-600">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4 bg-white min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Manage Librarians</h1>
            <button
                onClick={() => setIsAddingLibrarian(true)}
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-black rounded-lg hover:bg-black/60 transition-all duration-300 shadow-sm mb-8"
            >
                <Plus className="w-4 h-4" />
                Add Librarian
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {users.map(user => (
                    <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <img 
                                src={user.avatar || '/profile.png'}
                                alt={user.username}
                                className="w-16 h-16 rounded-full bg-gray-200"
                            />
                            <div>
                                <h3 className="font-semibold text-gray-800">{user.username}</h3>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">Role: {user.role}</p>
                    </div>
                ))}
            </div>

            {isAddingLibrarian && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                            onClick={() => setIsAddingLibrarian(false)}
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold text-black mb-4">Add Librarian</h2>
                        <form onSubmit={handleAddLibrarian}>
                            <div className="mb-4">
                                <label className="block text-black mb-2">Username</label>
                                <input
                                    type="text"
                                    value={newLibrarian.username}
                                    onChange={(e) => setNewLibrarian({ ...newLibrarian, username: e.target.value })}
                                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-black mb-2">Email</label>
                                <input
                                    type="email"
                                    value={newLibrarian.email}
                                    onChange={(e) => setNewLibrarian({ ...newLibrarian, email: e.target.value })}
                                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-black mb-2">Password</label>
                                <input
                                    type="password"
                                    value={newLibrarian.password}
                                    onChange={(e) => setNewLibrarian({ ...newLibrarian, password: e.target.value })}
                                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-black mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    value={newLibrarian.confirmPassword}
                                    onChange={(e) => setNewLibrarian({ ...newLibrarian, confirmPassword: e.target.value })}
                                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
                            >
                                Add Librarian
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
