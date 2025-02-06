'use client';
import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiClock, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

export default function StudentDashboard() {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('lms_authToken');
            try {
                const response = await fetch(`${backend_url}/api/v1/overview/student/overview`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log("student",data)
                    setStats(data);
                } else {
                    setError('Failed to fetch statistics');
                }
            } catch (error) {
                setError('Error fetching statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [backend_url]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="bg-red-100 text-red-800 px-6 py-4 rounded-md shadow-md">
                    <p className="font-semibold">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">📖 Student Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Books Borrowed" value={stats.booksBorrowed} icon={<FiBookOpen className="text-blue-500" />} />
                <StatCard title="Books Reserved" value={stats.booksReserved} icon={<FiCheckCircle className="text-green-500" />} />
                <StatCard title="Overdue Books" value={stats.overdueBooks} icon={<FiAlertTriangle className="text-red-500" />} />
                <StatCard title="Pending Reservations" value={stats.pendingReservations} icon={<FiClock className="text-orange-500" />} />
            </div>
        </div>
    );
}

const StatCard = ({ title, value, icon }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
            <div className="text-4xl">{icon}</div>
            <div>
                <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
};
