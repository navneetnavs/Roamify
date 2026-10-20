import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Home, Bookmark, RefreshCw } from 'lucide-react';
import { bookingsApi } from '../api/bookings';
import Navbar from '../components/layout/Navbar';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const BookingStatusPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStatus = async () => {
    if (!bookingId) return;
    setLoading(true);
    try {
      const resp = await bookingsApi.getStatus(Number(bookingId));
      setStatus(resp.bookingStatus);
    } catch {
      setError('Could not fetch booking status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Auto-refresh every 5s for pending
    const interval = setInterval(() => {
      if (status === 'PENDING' || status === null) fetchStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, [bookingId]);

  if (loading && !status) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" dark text="Checking booking status..." />
        </div>
      </div>
    );
  }

  const statusMap: Record<string, { icon: React.ReactNode; title: string; subtitle: string; bg: string; border: string; badge: string }> = {
    CONFIRMED: {
      icon: <CheckCircle size={64} className="text-emerald-500" />,
      title: 'Booking Confirmed! 🎉',
      subtitle: 'Your booking has been confirmed and payment received.',
      bg: 'from-emerald-50 to-teal-50',
      border: 'border-emerald-200',
      badge: 'badge-success',
    },
    PENDING: {
      icon: <Clock size={64} className="text-amber-500" />,
      title: 'Booking Pending ⏳',
      subtitle: 'Your booking is being processed. This usually takes a few seconds.',
      bg: 'from-amber-50 to-yellow-50',
      border: 'border-amber-200',
      badge: 'badge-warning',
    },
    PAYMENTS_PENDING: {
      icon: <Clock size={64} className="text-amber-500" />,
      title: 'Payment in Progress ⏳',
      subtitle: 'Complete your payment on the Stripe page. Your booking will be confirmed shortly.',
      bg: 'from-amber-50 to-yellow-50',
      border: 'border-amber-200',
      badge: 'badge-warning',
    },
    RESERVED: {
      icon: <Clock size={64} className="text-blue-500" />,
      title: 'Booking Reserved',
      subtitle: 'Your booking is reserved. Complete guest details and payment within 10 minutes.',
      bg: 'from-blue-50 to-sky-50',
      border: 'border-blue-200',
      badge: 'badge-info',
    },
    GUESTS_ADDED: {
      icon: <Clock size={64} className="text-blue-500" />,
      title: 'Guests Added',
      subtitle: 'Guests saved. Proceed to payment to confirm your booking.',
      bg: 'from-blue-50 to-sky-50',
      border: 'border-blue-200',
      badge: 'badge-info',
    },
    CANCELLED: {
      icon: <XCircle size={64} className="text-red-500" />,
      title: 'Booking Cancelled',
      subtitle: 'This booking has been cancelled. No charges were made.',
      bg: 'from-red-50 to-rose-50',
      border: 'border-red-200',
      badge: 'badge-danger',
    },
    CHECKED_IN: {
      icon: <CheckCircle size={64} className="text-blue-500" />,
      title: 'Checked In ✓',
      subtitle: 'You are currently checked in. Enjoy your stay!',
      bg: 'from-blue-50 to-sky-50',
      border: 'border-blue-200',
      badge: 'badge-info',
    },
    CHECKED_OUT: {
      icon: <CheckCircle size={64} className="text-slate-500" />,
      title: 'Checked Out',
      subtitle: 'Thank you for staying with us. We hope to see you again!',
      bg: 'from-slate-50 to-gray-50',
      border: 'border-slate-200',
      badge: 'badge-neutral',
    },
  };

  const c = statusMap[status ?? 'PENDING'] || statusMap['PENDING'];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container py-16">
        <div className="max-w-lg mx-auto">
          <div className={`card p-10 text-center border-2 ${c.border} bg-gradient-to-br ${c.bg} animate-fade-in`}>
            <div className="flex justify-center mb-6">{c.icon}</div>
            <h1 className="text-3xl font-black text-slate-900 mb-3">{c.title}</h1>
            <p className="text-slate-600 leading-relaxed mb-6">{c.subtitle}</p>

            <div className="bg-white/70 rounded-xl p-4 mb-8 text-sm">
              <p className="text-slate-500 font-medium">Booking ID</p>
              <p className="font-black text-slate-900 text-xl">#{bookingId}</p>
              <p className="text-slate-500 mt-2">Status: <span className={`badge ${c.badge} ml-1`}>{status}</span></p>
            </div>

            {error && (
              <div className="text-red-600 text-sm mb-4">{error}</div>
            )}

            <div className="flex flex-col gap-3">
              {status === 'PENDING' && (
                <button
                  onClick={fetchStatus}
                  disabled={loading}
                  className="btn btn-outline gap-2 w-full"
                >
                  <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                  Refresh Status
                </button>
              )}
              <Link to="/my-bookings" className="btn btn-primary w-full gap-2">
                <Bookmark size={16} /> View My Bookings
              </Link>
              <Link to="/" className="btn btn-ghost w-full gap-2">
                <Home size={16} /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingStatusPage;
