import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Check, Users, CreditCard, Plus, ChevronLeft, Calendar, IndianRupee } from 'lucide-react';
import { bookingsApi } from '../api/bookings';
import { usersApi } from '../api/users';
import type { GuestDto } from '../types';
import Navbar from '../components/layout/Navbar';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';

const STEPS = ['Review', 'Add Guests', 'Payment'];

const BookingFlow: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hotelName = searchParams.get('hotelName') || 'Hotel';
  const roomType = searchParams.get('roomType') || 'Room';

  const [step, setStep] = useState(0);
  const [guests, setGuests] = useState<GuestDto[]>([]);
  const [selectedGuestIds, setSelectedGuestIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [guestLoading, setGuestLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [newGuest, setNewGuest] = useState<GuestDto>({ name: '', gender: 'MALE', dateOfBirth: '' });
  const [addGuestLoading, setAddGuestLoading] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    Promise.all([
      bookingsApi.getStatus(Number(bookingId)),
      usersApi.getGuests(),
    ])
      .then(([status, guestList]) => {
        setGuests(guestList);
        // If booking is already confirmed, skip to status
        if (status.bookingStatus === 'CONFIRMED') {
          navigate(`/booking/${bookingId}/status`, { replace: true });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handleAddGuestToList = async () => {
    if (!newGuest.name || !newGuest.dateOfBirth) return;
    setAddGuestLoading(true);
    try {
      const created = await usersApi.addGuest(newGuest);
      setGuests(g => [...g, created]);
      setShowAddGuest(false);
      setNewGuest({ name: '', gender: 'MALE', dateOfBirth: '' });
    } catch {
      return;
    } finally {
      setAddGuestLoading(false);
    }
  };

  const handleAddGuests = async () => {
    if (!bookingId) return;
    setGuestLoading(true);
    try {
      await bookingsApi.addGuests(Number(bookingId), selectedGuestIds);
      setStep(2);
    } catch {
      return;
    } finally {
      setGuestLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!bookingId) return;
    setPayLoading(true);
    try {
      const resp = await bookingsApi.initiatePayment(Number(bookingId));
      window.location.href = resp.sessionUrl;
    } catch {
      setPayLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!bookingId) return;
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingsApi.cancelBooking(Number(bookingId));
      navigate('/my-bookings');
    } catch {
      return;
    }
  };

  const toggleGuest = (id: number) => {
    setSelectedGuestIds(ids =>
      ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container py-20 flex items-center justify-center">
          <LoadingSpinner size="lg" dark text="Loading booking details..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="container py-10 max-w-3xl mx-auto">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-rose-600 text-sm font-medium mb-6 transition-colors">
          <ChevronLeft size={16} /> Back
        </button>

        {/* Progress Stepper */}
        <div className="flex items-center mb-10">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-1">
                <div className={`step-dot text-sm font-bold ${i <= step ? 'brand-gradient text-white shadow-md' : 'bg-slate-200 text-slate-400'}`}>
                  {i < step ? <Check size={16} /> : i + 1}
                </div>
                <span className={`text-xs font-semibold whitespace-nowrap ${i === step ? 'text-rose-600' : 'text-slate-400'}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`step-line mx-2 mb-4 ${i < step ? 'bg-rose-400' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Booking Summary Card */}
        <div className="card p-5 mb-6 border-l-4 border-rose-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-rose-500 font-bold uppercase tracking-wider mb-1">Booking #{bookingId}</p>
              <h2 className="text-xl font-black text-slate-900">{hotelName}</h2>
              <p className="text-slate-500 text-sm">{roomType}</p>
            </div>
            <span className="badge badge-warning">Pending</span>
          </div>
        </div>

        {/* ─── Step 0: Review ──────────────────────────────────────────── */}
        {step === 0 && (
          <div className="card p-6 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Review Your Booking</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <Calendar size={18} className="text-rose-500" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Stay Duration</p>
                  <p className="font-semibold text-slate-800">Check your selected dates</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <Users size={18} className="text-rose-500" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Guests</p>
                  <p className="font-semibold text-slate-800">You can add traveller details in the next step</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <IndianRupee size={18} className="text-rose-500" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Payment</p>
                  <p className="font-semibold text-slate-800">Secure payment via Stripe</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleCancel} className="btn btn-ghost btn-sm text-red-500 hover:bg-red-50">
                Cancel Booking
              </button>
              <button onClick={() => setStep(1)} className="btn btn-primary flex-1">
                Continue → Add Guests
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 1: Add Guests ──────────────────────────────────────── */}
        {step === 1 && (
          <div className="card p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Add Travellers</h2>
              <button
                onClick={() => setShowAddGuest(true)}
                className="btn btn-outline btn-sm gap-1.5"
              >
                <Plus size={14} /> New Guest
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-5">Select guests from your list (optional — you can skip this step).</p>

            {guests.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-xl mb-6">
                <Users size={32} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No guests in your list yet.</p>
                <button onClick={() => setShowAddGuest(true)} className="btn btn-outline btn-sm mt-4 gap-1">
                  <Plus size={14} /> Add First Guest
                </button>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {guests.map(guest => (
                  <label
                    key={guest.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedGuestIds.includes(guest.id!)
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedGuestIds.includes(guest.id!)}
                      onChange={() => toggleGuest(guest.id!)}
                      className="w-4 h-4 accent-rose-500"
                    />
                    <div className="w-10 h-10 brand-gradient rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {guest.name[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{guest.name}</p>
                      <p className="text-xs text-slate-500">{guest.gender} · DOB: {guest.dateOfBirth}</p>
                    </div>
                    {selectedGuestIds.includes(guest.id!) && (
                      <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                        <Check size={13} className="text-white" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="btn btn-ghost btn-sm">← Back</button>
              <button onClick={handleAddGuests} disabled={guestLoading} className="btn btn-primary flex-1">
                {guestLoading ? <LoadingSpinner size="sm" /> : 'Continue → Payment'}
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 2: Payment ─────────────────────────────────────────── */}
        {step === 2 && (
          <div className="card p-6 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Complete Payment</h2>

            <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-100 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard size={20} className="text-rose-500" />
                <h3 className="font-bold text-slate-900">Secure Checkout</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                You'll be redirected to <strong>Stripe's</strong> secure payment gateway.
                Your payment information is encrypted and never stored on our servers.
              </p>
              <div className="flex items-center gap-3 mt-4">
                {['Visa', 'Mastercard', 'UPI', 'Net Banking'].map(method => (
                  <span key={method} className="text-xs bg-white border border-slate-200 px-2 py-1 rounded font-medium text-slate-600">
                    {method}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3 mb-8 text-sm">
              <div className="flex items-center gap-3 text-slate-600">
                <Check size={16} className="text-emerald-500 shrink-0" />
                Free cancellation before check-in
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Check size={16} className="text-emerald-500 shrink-0" />
                Instant booking confirmation
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Check size={16} className="text-emerald-500 shrink-0" />
                SSL encrypted secure payment
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn btn-ghost btn-sm">← Back</button>
              <button onClick={handlePayment} disabled={payLoading} className="btn btn-primary flex-1 btn-lg">
                {payLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <><CreditCard size={18} /> Proceed to Payment</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Guest Modal */}
      <Modal isOpen={showAddGuest} onClose={() => setShowAddGuest(false)} title="Add New Guest">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
            <input
              className="input-field"
              placeholder="Guest's full name"
              value={newGuest.name}
              onChange={e => setNewGuest(g => ({ ...g, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender *</label>
            <select
              className="input-field"
              value={newGuest.gender}
              onChange={e => setNewGuest(g => ({ ...g, gender: e.target.value as any }))}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date of Birth *</label>
            <input
              type="date"
              className="input-field"
              value={newGuest.dateOfBirth}
              onChange={e => setNewGuest(g => ({ ...g, dateOfBirth: e.target.value }))}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowAddGuest(false)} className="btn btn-ghost flex-1">Cancel</button>
            <button
              onClick={handleAddGuestToList}
              disabled={addGuestLoading || !newGuest.name || !newGuest.dateOfBirth}
              className="btn btn-primary flex-1"
            >
              {addGuestLoading ? <LoadingSpinner size="sm" /> : 'Add Guest'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingFlow;
