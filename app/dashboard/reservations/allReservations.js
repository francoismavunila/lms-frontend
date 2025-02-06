'use client'
import React, { useState, useEffect } from 'react';

export default function AllReservations() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReservations = async () => {
            const token = localStorage.getItem('lms_authToken');
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reservations/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const pendingReservations = data.filter(reservation => reservation.status === 'pending');
                    setReservations(pendingReservations);
                } else {
                    setError('Failed to fetch reservations');
                }
            } catch (error) {
                setError('Error fetching reservations');
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    if (loading) {
        return <div className="text-center text-gray-600">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">All Reservations</h2>
            <p className="text-3xl text-gray-600 mb-4">Total Reservations: <span className='text-secondary font-bold'>{reservations.length}</span></p>

            <div className="overflow-x-auto">
                <table className="w-full text-black border-collapse border border-gray-300 rounded-lg">
                    <thead className="bg-secondary text-white">
                        <tr>
                            {/* <th className="text-left px-4 py-2">ID</th> */}
                            <th className="text-left px-4 py-2">User Name</th>
                            <th className="text-left px-4 py-2">Book Title</th>
                            <th className="text-left px-4 py-2">Status</th>
                            <th className="text-left px-4 py-2">Reserved At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map(reservation => (
                            <tr key={reservation.id} className="border-b border-gray-300 hover:bg-gray-100">
                                {/* <td className="px-4 py-2">{reservation.id}</td> */}
                                <td className="px-4 py-2">{reservation.user.username}</td>
                                <td className="px-4 py-2">{reservation.book.title}</td>
                                <td className="px-4 py-2 capitalize">{reservation.status}</td>
                                <td className="px-4 py-2">{new Date(reservation.reserved_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
