import React, { useState } from 'react';
import { X, Zap, Mountain, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Bike } from '../types';

interface BikeDetailsModalProps {
    bike: Bike;
    isOpen: boolean;
    onClose: () => void;
    onReserve: (bike: Bike) => void;
}

const BikeDetailsModal: React.FC<BikeDetailsModalProps> = ({ bike, isOpen, onClose, onReserve }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!isOpen) return null;

    const API_URL = 'http://localhost:4000';
    const images = bike.images && bike.images.length > 0
        ? bike.images.map(img => `${API_URL}/uploads/${img}`)
        : ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800'];

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Electric': return <Zap className="w-5 h-5 mr-2" />;
            case 'VTT': return <Mountain className="w-5 h-5 mr-2" />;
            default: return null;
        }
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-500 flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh]">

                {/* Left: Image Gallery */}
                <div className="relative w-full md:w-3/5 h-[40vh] md:h-auto bg-gray-100 group">
                    <img
                        src={images[currentImageIndex]}
                        alt={bike.nom}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/80 text-white hover:text-gray-900 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/80 text-white hover:text-gray-900 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Image Dots */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/40'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Right: Info */}
                <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-between bg-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-4 py-1.5 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-100">
                                    GreenBike Certified
                                </span>
                                {bike.available === false && (
                                    <span className="px-4 py-1.5 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-100">
                                        Booked Now
                                    </span>
                                )}
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 leading-tight">{bike.nom}</h2>
                            <div className="flex items-center mt-3 text-gray-500 font-bold italic">
                                {getTypeIcon(bike.type as string)}
                                {bike.type} Premium Edition
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 py-8 border-y border-gray-50">
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Size / Taille</p>
                                <p className="text-xl font-black text-gray-900">{(bike as any).taille || 'Moyenne'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Status</p>
                                <div className={`flex items-center gap-2 font-black ${bike.available !== false ? 'text-green-600' : 'text-red-500'}`}>
                                    {bike.available !== false ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                    {bike.available !== false ? 'Available' : 'Booked'}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest italic">Description</h4>
                            <p className="text-gray-500 text-sm leading-relaxed font-medium capitalize">
                                High-performance {bike.type.toLowerCase()} bike designed for comfort and durability.
                                Perfect for exploring the city or rugged terrains. Features premium components
                                and aerodynamic styling.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col gap-4">
                        <div className="flex items-baseline justify-between mb-4">
                            <span className="text-gray-400 font-bold uppercase text-xs">Total Rental Price</span>
                            <div className="text-right">
                                <span className="text-4xl font-black text-green-600">${bike.prix}</span>
                                <span className="text-gray-400 text-sm font-bold"> / day</span>
                            </div>
                        </div>

                        <button
                            onClick={() => { if (bike.available !== false) onReserve(bike); }}
                            disabled={bike.available === false}
                            className={`w-full py-5 rounded-[1.25rem] text-lg font-black uppercase tracking-tighter transition-all shadow-xl active:scale-95 ${bike.available === false
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none'
                                    : 'bg-green-600 text-white hover:bg-green-700 shadow-green-200'
                                }`}
                        >
                            {bike.available === false ? 'Already Reserved' : 'Reserve This Bike Now'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BikeDetailsModal;
