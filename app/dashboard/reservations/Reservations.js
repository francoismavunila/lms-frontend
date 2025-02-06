'use client'
import React, { useState, useEffect } from 'react';

export default function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReservations = async () => {
            const token = localStorage.getItem('lms_authToken');
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reservations/reservations`, {
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

    const handleCancelReservation = async (reservationId) => {
        const token = localStorage.getItem('lms_authToken');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reservations/reservations/${reservationId}/cancel`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (response.ok) {
                setReservations(reservations.filter(reservation => reservation.id !== reservationId));
            } else {
                console.error('Failed to cancel reservation');
            }
        } catch (error) {
            console.error('Error canceling reservation:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container mx-auto p-4 bg-white min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Pending Reservations</h1>
            {reservations.length === 0 ? (
                <p>No pending reservations.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {reservations.map(reservation => (
                        <div key={reservation.id} className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                            <div className="relative pt-[100%]">
                                <img 
                                    src={`https://drive.google.com/thumbnail?id=${reservation.book.image_url}&sz=w1000`} 
                                    alt={reservation.book.title} 
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                            </div>

                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 line-clamp-1">{reservation.book.title}</h3>
                                        <p className="text-sm text-gray-600">{reservation.book.author}</p>
                                    </div>
                                </div>
                                
                                <p className="text-sm text-gray-500 mb-2">Status: {reservation.status}</p>
                                <p className="text-sm text-gray-500 mb-2">Reserved on: {new Date(reservation.reserved_at).toLocaleDateString()}</p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {[reservation.book.department, reservation.book.genre].map((tag, index) => (
                                        <span 
                                            key={index} 
                                            className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleCancelReservation(reservation.id)}
                                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
                                >
                                    Cancel Reservation
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
