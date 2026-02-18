import React from 'react';
import { MapPin, Bike } from 'lucide-react';
import { TYPES } from '../services/mockData';
import { BikeCategory } from '../types';

interface FiltersProps {
  selectedCity: string;
  selectedType: BikeCategory | string;
  onTypeChange: (type: BikeCategory | string) => void;
  onApply: () => void;
}

const Filters: React.FC<FiltersProps> = ({

  selectedType,

  onTypeChange,
  onApply
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between mb-8 sticky top-20 z-40">

      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1">
        {/* Type Filter */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Bike className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="block w-full pl-10 pr-10 py-3 text-base border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-lg bg-gray-50 hover:bg-white transition-colors appearance-none cursor-pointer"
          >
            {TYPES.map((type) => (
              <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Apply Button (mostly visual since React state updates instantly, but good for UX feel) */}
      <button
        onClick={onApply}
        className="w-full md:w-auto px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 shadow-md transition-all active:scale-95 whitespace-nowrap"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default Filters;