import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Phone, Mail, Star, Wifi, Car, Coffee, Dumbbell,
  Check, ChevronLeft, Calendar, Users, ArrowRight, Share2, Heart
} from 'lucide-react';
import { hotelsApi } from '../api/hotels';
import { bookingsApi } from '../api/bookings';
import { useAuth } from '../contexts/AuthContext';
import type { HotelInfoDto, RoomPriceResponseDto } from '../types';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
  'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600&q=80',
];

const HOTEL_IMAGES_POOL = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
];

const amenityIconMap: Record<string, React.ReactNode> = {
  'WiFi': <Wifi size={16} />,
  'Parking': <Car size={16} />,
  'Breakfast': <Coffee size={16} />,
  'Gym': <Dumbbell size={16} />,
};

const HotelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const startDate = searchParams.get('startDate') || new Date().toISOString().split('T')[0];
  const endDate = searchParams.get('endDate') || new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const roomsCount = Number(searchParams.get('roomsCount') || 1);

  const [hotelInfo, setHotelInfo] = useState<HotelInfoDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingRoomId, setBookingRoomId] = useState<number | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [liked, setLiked] = useState(false);

  const nights = Math.max(1, Math.round(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000
  ));

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    hotelsApi.getInfo(Number(id), {
      startDate,
      endDate,
      roomsCount,
    })
      .then(setHotelInfo)
      .catch(() => setError('Could not load hotel details.'))
      .finally(() => setLoading(false));
  }, [id, startDate, endDate, roomsCount]);

  const handleBookRoom = async (room: RoomPriceResponseDto) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!hotelInfo?.hotel.id) return;
    setBookingRoomId(room.id);
    setBookingLoading(true);
    try {
      const booking = await bookingsApi.initBooking({
        hotelId: hotelInfo.hotel.id!,
        roomId: room.id,
        checkInDate: startDate,
        checkOutDate: endDate,
        roomsCount,
      });
      navigate(`/booking/${booking.id}?hotelName=${encodeURIComponent(hotelInfo.hotel.name)}&roomType=${encodeURIComponent(room.type)}`);
    } catch {
      return;
    } finally {
      setBookingLoading(false);
      setBookingRoomId(null);
    }
  };

  const hotel = hotelInfo?.hotel;
  const rooms = hotelInfo?.rooms || [];

  const hotelImages = hotel?.photos?.length
    ? hotel.photos
    : HOTEL_IMAGES_POOL;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container py-12">
          <div className="skeleton h-80 rounded-2xl mb-8" />
          <div className="skeleton h-8 w-1/2 mb-4" />
          <div className="skeleton h-4 w-1/3 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="skeleton h-64 rounded-2xl" />)}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container py-20 text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Hotel not found</h2>
          <p className="text-slate-500 mb-6">{error || 'This hotel does not exist.'}</p>
          <button onClick={() => navigate(-1)} className="btn btn-outline gap-2">
            <ChevronLeft size={16} /> Go back
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const rating = (4.2 + Math.random() * 0.7).toFixed(1);
  const reviews = Math.floor(120 + Math.random() * 500);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="container py-8">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-rose-600 transition-colors mb-6 text-sm font-medium">
          <ChevronLeft size={16} /> Back to results
        </button>

        {/* Photo Gallery */}
        <div className="photo-grid mb-8 overflow-hidden rounded-2xl">
          {hotelImages.slice(0, 3).map((src, i) => (
            <div key={i} className="overflow-hidden">
              <img
                src={src}
                alt={`${hotel.name} ${i + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                onError={(e) => { (e.target as HTMLImageElement).src = HOTEL_IMAGES_POOL[i % HOTEL_IMAGES_POOL.length]; }}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 mb-2">{hotel.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-slate-600 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={15} className="text-rose-500" /> {hotel.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="font-semibold text-slate-800">{rating}</span>
                      <span className="text-slate-400">({reviews} reviews)</span>
                    </span>
                    {hotel.active && (
                      <span className="badge badge-success">
                        <Check size={11} /> Verified
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn btn-ghost btn-icon border border-slate-200">
                    <Share2 size={16} />
                  </button>
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`btn btn-icon border ${liked ? 'bg-rose-50 border-rose-200' : 'border-slate-200'}`}
                  >
                    <Heart size={16} className={liked ? 'fill-rose-500 text-rose-500' : 'text-slate-500'} />
                  </button>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {hotel.amenities.map(a => (
                    <div key={a} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="text-rose-500">{amenityIconMap[a] || <Check size={16} />}</div>
                      <span className="text-sm font-medium text-slate-700">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info */}
            {hotel.contactInfo && (
              <div className="card p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Location & Contact</h2>
                <div className="space-y-3">
                  {hotel.contactInfo.address && (
                    <div className="flex items-start gap-3 text-sm text-slate-600">
                      <MapPin size={16} className="text-rose-500 mt-0.5 shrink-0" />
                      <span>{hotel.contactInfo.address}</span>
                    </div>
                  )}
                  {hotel.contactInfo.phoneNumber && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Phone size={16} className="text-rose-500 shrink-0" />
                      <span>{hotel.contactInfo.phoneNumber}</span>
                    </div>
                  )}
                  {hotel.contactInfo.email && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Mail size={16} className="text-rose-500 shrink-0" />
                      <span>{hotel.contactInfo.email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Trip Summary</h2>
              <div className="space-y-3 bg-slate-50 rounded-xl p-4 mb-5">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={15} className="text-rose-500" />
                  <div>
                    <p className="font-semibold text-slate-800">{startDate} → {endDate}</p>
                    <p className="text-slate-500">{nights} night{nights !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users size={15} className="text-rose-500" />
                  <span className="text-slate-700">{roomsCount} room{roomsCount !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-4">Select a room type below to book</p>
            </div>
          </div>
        </div>

        {/* ─── Rooms Section ──────────────────────────────────────────── */}
        <div className="mt-10">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Available Rooms</h2>
          {rooms.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-4xl mb-3">🛏️</div>
              <p className="text-slate-600 font-medium">No available rooms for selected dates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rooms.map((room, idx) => {
                const roomImg = room.photos?.[0] || ROOM_IMAGES[idx % ROOM_IMAGES.length];
                const totalPrice = room.price * nights * roomsCount;
                const isBooking = bookingLoading && bookingRoomId === room.id;

                return (
                  <div key={room.id} className="card overflow-hidden group">
                    {/* Room image */}
                    <div className="h-48 overflow-hidden">
                      <img
                        src={roomImg}
                        alt={room.type}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = ROOM_IMAGES[0]; }}
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{room.type}</h3>
                          <p className="text-slate-400 text-sm">Per room, per night</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black brand-gradient-text">
                            ₹{Math.round(room.price || 0).toLocaleString('en-IN')}
                          </p>
                          <p className="text-xs text-slate-500">per night</p>
                        </div>
                      </div>

                      {room.amenities && room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {room.amenities.slice(0, 4).map(a => (
                            <span key={a} className="amenity-tag text-xs">
                              {amenityIconMap[a] || <Check size={11} />}
                              {a}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div>
                          <p className="text-xs text-slate-500">Total for {nights}n × {roomsCount} room{roomsCount !== 1 ? 's' : ''}</p>
                          <p className="font-bold text-slate-900">₹{Math.round(totalPrice).toLocaleString('en-IN')}</p>
                        </div>
                        <button
                          onClick={() => handleBookRoom(room)}
                          disabled={bookingLoading}
                          className="btn btn-primary gap-2"
                        >
                          {isBooking ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <>Book Now <ArrowRight size={15} /></>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HotelDetail;
