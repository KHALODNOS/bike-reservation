import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Bike } from '../types';

interface Booking {
    _id: string;
    bike: Bike;
    startDate: string;
    endDate: string;
    status: 'pending' | 'confirmed' | 'cancelled';
}

interface BookingsProps {
    onCancelSuccess?: () => void;
}

const Bookings: React.FC<BookingsProps> = ({ onCancelSuccess }) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/booking/myBooking', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (id: string) => {
        if (!window.confirm("Are you sure you want to cancel this reservation?")) return;

        try {
            const response = await fetch(`http://localhost:4000/api/booking/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                fetchBookings();
                onCancelSuccess?.();
            }
        } catch (error) {
            console.error("Error cancelling booking:", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'text-green-600 bg-green-50 border-green-200';
            case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-blue-600 bg-blue-50 border-blue-200';
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-20 min-h-[70vh]">
            <div className="mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reservations</h1>
                <p className="text-gray-500 text-lg">Manage your upcoming and past bike rentals.</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
            ) : bookings.length > 0 ? (
                <div className="space-y-6">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
                            <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                <img
                                    src={booking.bike.images?.[0] || 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800'}
                                    alt={booking.bike.nom}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{booking.bike.nom}</h3>
                                        <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)} uppercase tracking-wider`}>
                                            {booking.status === 'confirmed' && <CheckCircle className="w-3 h-3 mr-1" />}
                                            {booking.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                                            {booking.status}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-green-600">{booking.bike.prix}DH</span>
                                        <p className="text-xs text-gray-400">Total Price</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-green-600" />
                                        <span>From: <strong>{new Date(booking.startDate).toLocaleDateString()}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-green-600" />
                                        <span>Until: <strong>{new Date(booking.endDate).toLocaleDateString()}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-green-600" />
                                        <span>Duration: 24h</span>
                                    </div>
                                </div>
                            </div>

                            {booking.status !== 'cancelled' && (
                                <button
                                    onClick={() => handleCancel(booking._id)}
                                    className="w-full md:w-auto px-6 py-3 text-red-600 hover:bg-red-50 font-semibold rounded-xl transition-all border border-transparent hover:border-red-100 flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Cancel
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar className="w-10 h-10 text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No active reservations</h2>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">You haven't rented any bikes yet. Start your journey today!</p>
                    <a href="/" className="inline-flex px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-green-100">
                        Find a Bike
                    </a>
                </div>
            )}
        </div>
    );
};

export default Bookings;
