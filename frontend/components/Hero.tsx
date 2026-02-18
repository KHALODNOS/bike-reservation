import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-white overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
         <svg className="h-full w-full text-gray-200" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" />
         </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
          Reserve your bike <span className="text-green-600">now</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          Discover the city on two wheels. Affordable, eco-friendly, and convenient bicycle rentals available in your area.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <button className="px-8 py-3.5 border border-transparent text-lg font-medium rounded-full shadow-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:-translate-y-0.5">
            Find Your Bike
          </button>
          <button className="px-8 py-3.5 border border-gray-300 text-lg font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-all">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;