import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, PlusCircle, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { adminApi } from '../../api/admin';
import type { HotelDto } from '../../types';
import Navbar from '../../components/layout/Navbar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<HotelDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAllHotels()
      .then(setHotels)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeHotels = hotels.filter(h => h.active);
  const totalHotels = hotels.length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <div className="brand-gradient py-10">
        <div className="container">
          <h1 className="text-3xl font-black text-white mb-1">Admin Dashboard</h1>
          <p className="text-white/75">Manage your hotels, rooms and inventory</p>
        </div>
      </div>

      <div className="container py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" dark />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {[
                {
                  label: 'Total Hotels',
                  value: totalHotels,
                  icon: Hotel,
                  color: 'bg-rose-50 text-rose-600',
                  trend: '+2 this month',
                },
                {
                  label: 'Active Hotels',
                  value: activeHotels.length,
                  icon: CheckCircle,
                  color: 'bg-emerald-50 text-emerald-600',
                  trend: `${totalHotels - activeHotels.length} inactive`,
                },
                {
                  label: 'Inactive Hotels',
                  value: totalHotels - activeHotels.length,
                  icon: XCircle,
                  color: 'bg-amber-50 text-amber-600',
                  trend: 'Needs activation',
                },
              ].map(stat => (
                <div key={stat.label} className="card p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                      <stat.icon size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                      <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{stat.trend}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hotels List */}
            <div className="card">
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">My Hotels</h2>
                <button
                  onClick={() => navigate('/admin/hotels/new')}
                  className="btn btn-primary btn-sm gap-1.5"
                >
                  <PlusCircle size={15} /> Add Hotel
                </button>
              </div>

              {hotels.length === 0 ? (
                <div className="p-12 text-center">
                  <Hotel size={40} className="text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">No hotels yet. Add your first hotel!</p>
                  <button onClick={() => navigate('/admin/hotels/new')} className="btn btn-primary btn-sm mt-4">
                    Add Hotel
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {hotels.map((hotel) => (
                    <div key={hotel.id} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 brand-gradient rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                          {hotel.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{hotel.name}</p>
                          <p className="text-sm text-slate-500">{hotel.city}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`badge ${hotel.active ? 'badge-success' : 'badge-warning'}`}>
                          {hotel.active ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => navigate(`/admin/hotels/${hotel.id}`)}
                          className="btn btn-ghost btn-sm gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Manage <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
