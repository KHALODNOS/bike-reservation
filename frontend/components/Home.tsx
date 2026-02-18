import React, { useState } from 'react';
import Hero from './Hero';
import Filters from './Filters';
import BikeCard from './BikeCard';
import SkeletonCard from './SkeletonCard';
import EmptyState from './EmptyState';
import ReservationModal from './ReservationModal';
import BikeDetailsModal from './BikeDetailsModal';
import { Bike } from '../types';

interface HomeProps {
  loading: boolean;
  filteredBikes: Bike[];
  selectedType: string;
  onTypeChange: (type: string) => void;
  onApply: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onReserve: (bike: Bike) => void;
  onViewDetails: (bike: Bike) => void;
  onBookingSuccess?: () => void;
}

const Home: React.FC<HomeProps> = ({
  loading,
  filteredBikes,
  selectedType,
  onTypeChange,
  onApply,
  favorites,
  onToggleFavorite,
  onBookingSuccess,
  onReserve,
  onViewDetails,
}) => {

  return (
    <>
      <Hero />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-20">
        <Filters
          selectedType={selectedType}
          onTypeChange={onTypeChange}
          onApply={onApply}
        />

        {!loading && (
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {filteredBikes.length > 0 ? 'Available Bikes' : ''}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredBikes.length} {filteredBikes.length === 1 ? 'result' : 'results'} found
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : filteredBikes.length > 0 ? (
            filteredBikes.map((bike) => (
              <BikeCard
                key={bike._id || bike.id}
                bike={bike}
                isFavorite={favorites.includes(bike._id || '')}
                onToggleFavorite={onToggleFavorite}
                onReserve={onReserve}
                onViewDetails={onViewDetails}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </main>

    </>
  );
};

export default Home;
