import React from 'react';
import { Bike } from '../types';
import { Zap, Mountain, MapPin, Heart } from 'lucide-react';

interface BikeCardProps {
  bike: Bike;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onReserve: (bike: Bike) => void;
  onViewDetails: (bike: Bike) => void;
}

const BikeCard: React.FC<BikeCardProps> = ({ bike, isFavorite, onToggleFavorite, onReserve, onViewDetails }) => {
  // Helper to get icon based on type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Electric': return <Zap className="w-3 h-3 mr-1" />;
      case 'VTT': return <Mountain className="w-3 h-3 mr-1" />;

      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'electric': return 'bg-yellow-100 text-yellow-700';
      case 'vtt': return 'bg-stone-100 text-stone-700';

      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const API_URL = 'http://localhost:4000';
  const imageUrl = bike.images && bike.images.length > 0
    ? `${API_URL}/uploads/${bike.images[0]}`
    : 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={bike.nom}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getTypeColor(bike.type as string)}`}>
            {getTypeIcon(bike.type as string)}
            {bike.type}
          </span>
          {bike.available === false && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 shadow-sm animate-pulse">
              Already Booked
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(bike._id || '');
          }}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-300 ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'}`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{bike.nom}</h3>
        </div>



        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase font-semibold">Price</span>
            <div className="flex items-baseline">
              <span className="text-xl font-bold text-green-600">${bike.prix}</span>
              <span className="text-gray-500 text-sm ml-1">/ day</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onViewDetails(bike)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-lg transition-all border border-gray-200 shadow-sm"
            >
              Details
            </button>
            <button
              onClick={() => bike.available !== false && onReserve(bike)}
              disabled={bike.available === false}
              className={`px-5 py-2 text-sm font-black rounded-lg transition-all duration-300 shadow-sm uppercase tracking-tighter ${bike.available === false
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none'
                : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
            >
              {bike.available === false ? 'Booked' : 'Reserve'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeCard;