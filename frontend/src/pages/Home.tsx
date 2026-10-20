import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Search, MapPin, Calendar, Users } from 'lucide-react';

const Home: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Roamify</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-rose-600 transition"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Find Your Perfect Stay</h1>
          <p className="text-xl mb-8 opacity-90">Discover amazing hotels and experiences around the world</p>
          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Where are you going?"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-900"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-900"
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  placeholder="Guests"
                  min="1"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-900"
                />
              </div>
              <button className="bg-gradient-to-r from-rose-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-orange-600 transition flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose Roamify?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Wide Selection</h3>
            <p className="text-gray-600">Choose from thousands of hotels and accommodations worldwide</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Booking</h3>
            <p className="text-gray-600">Book your stay in just a few clicks with our simple process</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted Reviews</h3>
            <p className="text-gray-600">Read authentic reviews from real travelers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
