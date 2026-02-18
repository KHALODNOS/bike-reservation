import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Bikes from './components/Bikes';
import Contact from './components/Contact';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Bookings from './components/Bookings';
import { Bike } from './types';
import { Heart } from 'lucide-react';
import BikeCard from './components/BikeCard';
import AdminDashboard from './components/admin/AdminDashboard';
import ReservationModal from './components/ReservationModal';
import BikeDetailsModal from './components/BikeDetailsModal';

type Page = 'home' | 'bikes' | 'contact' | 'login' | 'register' | 'favorites' | 'reservations' | 'admin';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [loading, setLoading] = useState(true);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Initialize user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/home');
      if (!response.ok) throw new Error('Failed to fetch bikes');
      const data = await response.json();
      setBikes(data);
    } catch (error) {
      console.error("Error fetching bikes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bikes
  useEffect(() => {
    fetchBikes();
  }, []);

  // Fetch favorites when user is logged in
  useEffect(() => {
    if (user) {
      fetch('http://localhost:4000/api/favorite/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const ids = data.map((fav: any) => typeof fav === 'string' ? fav : fav._id);
            setFavorites(ids);
          }
        })
        .catch(err => console.error("Error fetching favorites:", err));
    } else {
      setFavorites([]);
    }
  }, [user]);

  const toggleFavorite = async (bikeId: string) => {
    if (!user) {
      setCurrentPage('login');
      return;
    }

    const isFav = favorites.includes(bikeId);
    const endpoint = isFav ? 'remove' : 'add';

    try {
      const res = await fetch(`http://localhost:4000/api/favorite/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ productId: bikeId })
      });

      if (res.ok) {
        setFavorites(prev =>
          isFav ? prev.filter(id => id !== bikeId) : [...prev, bikeId]
        );
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    if (userData.role === 'admin') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('home');
    }
  };

  const handleReserveClick = (bike: Bike) => {
    setSelectedBike(bike);
    setIsDetailsOpen(false);
    setIsModalOpen(true);
  };

  const handleDetailsClick = (bike: Bike) => {
    setSelectedBike(bike);
    setIsDetailsOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('home');
  };

  const filteredBikes = useMemo(() => {
    return bikes.filter(bike => {
      const bikeTypeNormalized = bike.type.toLowerCase();
      const selectedTypeNormalized = selectedType.toLowerCase();
      return selectedType === 'All' || bikeTypeNormalized === selectedTypeNormalized;
    });
  }, [bikes, selectedType]);

  const handleApplyFilters = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 400);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            loading={loading}
            filteredBikes={filteredBikes}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            onApply={handleApplyFilters}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onBookingSuccess={fetchBikes}
            onReserve={handleReserveClick}
            onViewDetails={handleDetailsClick}
          />
        );
      case 'bikes':
        return (
          <Bikes
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onReserve={handleReserveClick}
            onViewDetails={handleDetailsClick}
          />
        );
      case 'favorites':
        const favoriteBikes = bikes.filter(b => favorites.includes(b._id || ''));
        return (
          <div className="max-w-7xl mx-auto px-4 py-20 min-h-[60vh]">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-red-50 rounded-full mb-4">
                <Heart className="h-8 w-8 text-red-500 fill-current" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Favorites</h1>
              <p className="text-gray-500">Bikes you've saved for later.</p>
            </div>

            {favoriteBikes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {favoriteBikes.map((bike) => (
                  <BikeCard
                    key={bike._id || bike.id}
                    bike={bike}
                    isFavorite={true}
                    onToggleFavorite={toggleFavorite}
                    onReserve={handleReserveClick}
                    onViewDetails={handleDetailsClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200">
                <p className="text-gray-400 text-lg mb-6">No favorites found. Go find your perfect ride!</p>
                <button
                  onClick={() => setCurrentPage('bikes')}
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all"
                >
                  Explore Bikes
                </button>
              </div>
            )}
          </div>
        );
      case 'contact':
        return <Contact />;
      case 'login':
        return (
          <LoginPage
            onBack={() => setCurrentPage('home')}
            onRegister={() => setCurrentPage('register')}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case 'register':
        return (
          <RegisterPage
            onBack={() => setCurrentPage('home')}
            onLogin={() => setCurrentPage('login')}
          />
        );
      case 'reservations':
        return <Bookings onCancelSuccess={fetchBikes} />;
      case 'admin':
        return <AdminDashboard onLogout={handleLogout} />;
      default:
        return <Home
          loading={loading}
          filteredBikes={filteredBikes}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          onApply={handleApplyFilters}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      {currentPage !== 'admin' && (
        <Navbar
          onNavigate={setCurrentPage}
          currentPage={currentPage}
          user={user}
          onLogout={handleLogout}
          favoritesCount={favorites.length}
        />
      )}

      <div className="flex-grow">
        {renderPage()}
      </div>

      {selectedBike && (
        <ReservationModal
          bike={selectedBike}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onBookingSuccess={fetchBikes}
        />
      )}

      {selectedBike && (
        <BikeDetailsModal
          bike={selectedBike}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          onReserve={handleReserveClick}
        />
      )}

      {currentPage !== 'admin' && (
        <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} GreenBike Inc. All rights reserved.
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;