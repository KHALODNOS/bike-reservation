import React, { useEffect, useState } from 'react';
import { Bike } from '../types';
import BikeCard from './BikeCard';
import SkeletonCard from './SkeletonCard';
import ReservationModal from './ReservationModal';
import BikeDetailsModal from './BikeDetailsModal';

interface BikesProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onReserve: (bike: Bike) => void;
  onViewDetails: (bike: Bike) => void;
}

const Bikes: React.FC<BikesProps> = ({ favorites, onToggleFavorite, onReserve, onViewDetails }) => {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBikes = () => {
    setLoading(true); // Set loading to true before fetching
    fetch('http://localhost:4000/api/home')
      .then(res => res.json())
      .then(data => {
        setBikes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Fleet</h1>
        <p className="text-lg text-gray-600">Discover our wide range of eco-friendly bikes for every adventure.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : (
          bikes.map((bike) => (
            <BikeCard
              key={bike._id || bike.id}
              bike={bike}
              isFavorite={favorites.includes(bike._id || '')}
              onToggleFavorite={onToggleFavorite}
              onReserve={onReserve}
              onViewDetails={onViewDetails}
            />
          ))
        )}
      </div>

    </div>
  );
};

export default Bikes;
