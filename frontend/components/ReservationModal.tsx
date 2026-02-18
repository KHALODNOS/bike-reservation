import React, { useState } from 'react';
import { X, CheckCircle, Calendar, AlertCircle } from 'lucide-react';
import { Bike } from '../types';

interface ReservationModalProps {
  bike: Bike;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess?: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ bike, isOpen, onClose, onBookingSuccess }) => {
  const [dates, setDates] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Please login to book a bike");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:4000/api/booking/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          bikeId: bike._id || bike.id,
          startDate: dates.startDate,
          endDate: dates.endDate
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Reservation failed");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      onBookingSuccess?.();
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setError("");
      }, 3000);
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDates(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="relative h-40 bg-green-600 flex items-center justify-center p-6 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-all"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="text-center relative z-10">
            <h2 className="text-3xl font-extrabold tracking-tight">Booking Confirmation</h2>
            <p className="text-green-100 mt-2 font-medium">{bike.nom}</p>
          </div>
        </div>

        <div className="p-8">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Reservation Confirmed!</h3>
              <p className="text-gray-500">Your bike is ready for pickup. Check "My Reservations" for details.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-sm">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    required
                    value={dates.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    required
                    value={dates.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Price per day</span>
                  <span className="font-bold text-gray-900">{bike.prix}DH</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-green-600 font-bold">Total Estimated</span>
                  <span className="font-extrabold text-green-600">{bike.prix}DH</span>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-4 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Booking...' : 'Confirm Now'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
