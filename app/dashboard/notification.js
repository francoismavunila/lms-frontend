'use client';
import React, { useState, useEffect } from 'react';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedNotification, setSelectedNotification] = useState(null); // Popup state
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    const user_id = localStorage.getItem('user_id'); // Get user ID from storage

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = localStorage.getItem('lms_authToken');
            try {
                const response = await fetch(`${backend_url}/api/v1/notifications/user`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    setNotifications(data);
                } else {
                    setError('Failed to fetch notifications');
                }
            } catch (error) {
                setError('Error fetching notifications');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [backend_url]);

    // Function to open popup and mark as read
    const openNotification = async (notification) => {
        setSelectedNotification(notification); // Show popup
        console.log(notification)
        // If unread, mark as read
        if (!notification.is_read) {
            const token = localStorage.getItem('lms_authToken');
            try {
                await fetch(`${backend_url}/api/v1/notifications/read/${notification.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                // Update UI to reflect read status
                setNotifications((prev) =>
                    prev.map((n) =>
                        n.id === notification.id ? { ...n, is_read: true } : n
                    )
                );
            } catch (error) {
                console.error("Error marking notification as read:", error);
            }
        }
    };

    // Close popup
    const closePopup = () => {
        setSelectedNotification(null);
    };



    if (loading) return <div className="text-center text-xl text-gray-600">Loading notifications...</div>;
    if (error) return <div className="text-center text-red-500 text-xl">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto p-1">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🔔 Notifications</h3>

            <div className="bg-white w-full rounded-lg p-1">
                {notifications.length === 0 ? (
                    <p className="text-gray-500 text-lg">No notifications yet.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {notifications.map((notification) => (
                            <li
                                key={notification.id}
                                className={`p-2 cursor-pointer transition duration-200 ease-in-out transform hover:scale-105 ${
                                    notification.is_read ? 'bg-gray-100 text-gray-600' : 'bg-white font-semibold text-black'
                                } flex items-center justify-between`}
                                onClick={() => openNotification(notification)}
                            >
                                <div className="flex-1">
                                    <p className="text-md mb-1">{notification.title}</p>
                                    <p className="text-gray-400 text-sm">{notification.message.substr(0, 30)}......</p>
                                    <p className="text-sm text-gray-500">{new Date(notification.create_at).toLocaleDateString()}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Popup Modal */}
            {selectedNotification && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                            onClick={closePopup}
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold text-black mb-2">{selectedNotification.title}</h2>
                        <p className="text-gray-600 mb-4">{selectedNotification.message}</p>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={closePopup}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
