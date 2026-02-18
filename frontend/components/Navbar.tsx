import React, { useState } from 'react';
import { Bike, Menu, X, Heart } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: 'home' | 'bikes' | 'contact' | 'login' | 'favorites' | 'reservations') => void;
  currentPage: string;
  user?: any;
  onLogout?: () => void;
  favoritesCount?: number;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, user, onLogout, favoritesCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: { label: string; id: 'home' | 'bikes' | 'contact' | 'reservations' }[] = [
    { label: 'Home', id: 'home' },
    { label: 'Bikes', id: 'bikes' },
    { label: 'Contact', id: 'contact' },
    { label: 'My Bookings', id: 'reservations' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <Bike className="h-8 w-8 text-green-600" />
            <span className="font-bold text-xl text-gray-900 tracking-tight">GreenBike</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`font-medium transition-colors ${currentPage === item.id ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
                  }`}
              >
                {item.label}
              </button>
            ))}
            {user && (
              <div
                onClick={() => onNavigate('favorites')}
                className="relative cursor-pointer group p-2 hover:bg-red-50 rounded-full transition-colors"
              >
                <Heart className={`h-6 w-6 ${favoritesCount > 0 ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">
                    {favoritesCount}
                  </span>
                )}
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
                    {user.nom?.[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.nom}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-gray-500 hover:text-red-600 text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className={`${currentPage === 'login' ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'
                  } text-white px-5 py-2 rounded-full font-medium transition-all shadow-sm hover:shadow-md`}
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${currentPage === item.id
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                  }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                      {user.nom?.[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user.nom}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onLogout?.();
                      setIsOpen(false);
                    }}
                    className="w-full bg-red-50 text-red-600 px-4 py-3 rounded-lg font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onNavigate('login');
                    setIsOpen(false);
                  }}
                  className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-medium"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;