import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, XCircle, CheckCircle, ChevronRight, ArrowRight } from 'lucide-react';
import { usersApi } from '../api/users';
import { bookingsApi } from '../api/bookings';
import type { BookingDto } from '../types';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&q=80',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80',
];

const statusConfig: Record<string, { label: string; badge: string; icon: React.ReactNode }> = {
  PENDING:     { label: 'Pending',     badge: 'badge-warning',  icon: <Clock size={14} /> },
  CONFIRMED:   { label: 'Confirmed',   badge: 'badge-success',  icon: <CheckCircle size={14} /> },
  CANCELLED:   { label: 'Cancelled',   badge: 'badge-danger',   icon: <XCircle size={14} /> },
  CHECKED_IN:  { label: 'Checked In',  badge: 'badge-info',     icon: <CheckCircle size={14} /> },
  CHECKED_OUT: { label: 'Checked Out', badge: 'badge-neutral',  icon: <CheckCircle size={14} /> },
};

const MyBookings: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    usersApi.getMyBookings()
      .then(setBookings)
      .catch(() => setError('Failed to load bookings.'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (bookingId: number) => {
    if (!confirm('Cancel this booking?')) return;
    setCancelling(bookingId);
    try {
      await bookingsApi.cancelBooking(bookingId);
      setBookings(bs => bs.map(b => b.id === bookingId ? { ...b, bookingStatus: 'CANCELLED' } : b));
    } catch {
      return;
    } finally {
      setCancelling(null);
    }
  };

  const FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'CHECKED_IN', 'CHECKED_OUT'];
  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.bookingStatus === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container py-20 flex items-center justify-center">
          <LoadingSpinner size="lg" dark text="Loading your bookings..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container py-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">My Trips</h1>
          <p className="text-slate-500">Your complete booking history</p>
        </div>
      </div>

      <div className="container py-8">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-sm whitespace-nowrap shrink-0 ${filter === f ? 'btn-primary' : 'btn-ghost border border-slate-200'}`}
            >
              {f === 'ALL' ? `All (${bookings.length})` : `${statusConfig[f]?.label || f} (${bookings.filter(b => b.bookingStatus === f).length})`}
            </button>
          ))}
        </div>

        {error && (
          <div className="card p-6 text-center text-red-600">
            <p>{error}</p>
          </div>
        )}

        {!error && filtered.length === 0 && (
          <div className="card p-16 text-center animate-fade-in">
            <div className="text-6xl mb-4">✈️</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No trips yet</h2>
            <p className="text-slate-500 mb-8">
              {filter === 'ALL'
                ? "You haven't made any bookings yet. Start exploring hotels!"
                : `No ${filter.toLowerCase()} bookings found.`}
            </p>
            {filter === 'ALL' && (
              <button onClick={() => navigate('/search')} className="btn btn-primary gap-2">
                Explore Hotels <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}

        {/* Booking Cards */}
        <div className="space-y-4">
          {filtered.map((booking, idx) => {
            const sc = statusConfig[booking.bookingStatus] || statusConfig.PENDING;
            const image = HOTEL_IMAGES[idx % HOTEL_IMAGES.length];
            const nights = Math.max(1, Math.round(
              (new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / 86400000
            ));
            const canCancel = ['PENDING', 'CONFIRMED'].includes(booking.bookingStatus);

            return (
              <div key={booking.id} className="card overflow-hidden animate-fade-in group">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-48 h-40 md:h-auto overflow-hidden shrink-0">
                    <img
                      src={image}
                      alt="Hotel"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="text-xs text-slate-400 font-medium mb-1">Booking #{booking.id}</p>
                        <p className="font-bold text-slate-900 text-lg">Room Booking</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-rose-400" />
                            {booking.checkInDate} → {booking.checkOutDate}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={13} className="text-rose-400" />
                            {nights} night{nights !== 1 ? 's' : ''}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-rose-400" />
                            {booking.roomsCount} room{booking.roomsCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <span className={`badge ${sc.badge} gap-1 shrink-0`}>
                        {sc.icon}
                        {sc.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-slate-100">
                      <div>
                        <p className="text-xs text-slate-400">Total Amount</p>
                        <p className="text-xl font-black text-slate-900">
                          ₹{Number(booking.amount || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {booking.bookingStatus === 'PENDING' && (
                          <button
                            onClick={() => navigate(`/booking/${booking.id}/status`)}
                            className="btn btn-outline btn-sm gap-1"
                          >
                            Check Status <ChevronRight size={14} />
                          </button>
                        )}
                        {canCancel && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            disabled={cancelling === booking.id}
                            className="btn btn-danger btn-sm"
                          >
                            {cancelling === booking.id ? <LoadingSpinner size="sm" /> : 'Cancel'}
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/booking/${booking.id}/status`)}
                          className="btn btn-ghost btn-sm gap-1"
                        >
                          Details <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyBookings;
