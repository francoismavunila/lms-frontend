'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AllReservations from './allReservations';
import Reservations from './Reservations';

export default function ReservationsPage() {
    const [userRole, setUserRole] = useState(null);
    const router = useRouter();
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem('lms_authToken');
            if (!token) {
                router.push('/login');
                return;
            }
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
        };

        fetchUserRole();
    }, [router, backend_url]);

    if (userRole === 'admin' || userRole === 'librarian') {
        return <AllReservations />;
    }

    return <Reservations />;
}
