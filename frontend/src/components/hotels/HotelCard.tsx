import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Wifi, Car, Coffee, Dumbbell } from 'lucide-react';
import type { HotelPriceResponseDto } from '../../types';

const HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
];

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi size={14} />,
  'Pool': <span>🏊</span>,
  'Parking': <Car size={14} />,
  'Breakfast': <Coffee size={14} />,
  'Gym': <Dumbbell size={14} />,
};

interface Props {
  hotel: HotelPriceResponseDto;
  index?: number;
  searchParams?: {
    startDate: string;
    endDate: string;
    roomsCount: number;
  };
}

const HotelCard: React.FC<Props> = ({ hotel, index = 0, searchParams }) => {
  const navigate = useNavigate();
  const image = hotel.photos?.[0] || HOTEL_IMAGES[index % HOTEL_IMAGES.length];
  const rating = (4.0 + Math.random() * 0.9).toFixed(1);
  const reviews = Math.floor(80 + Math.random() * 400);

  const handleClick = () => {
    const params = new URLSearchParams();
    if (searchParams?.startDate) params.set('startDate', searchParams.startDate);
    if (searchParams?.endDate) params.set('endDate', searchParams.endDate);
    if (searchParams?.roomsCount) params.set('roomsCount', String(searchParams.roomsCount));
    navigate(`/hotels/${hotel.id}?${params.toString()}`);
  };

  return (
    <div className="card card-hover cursor-pointer group overflow-hidden animate-fade-in" onClick={handleClick}>
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = HOTEL_IMAGES[0]; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {/* Price badge */}
        <div className="absolute top-3 right-3 glass text-slate-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
          from ₹{Math.round(hotel.price).toLocaleString('en-IN')}/night
        </div>
        {/* City */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-medium">
          <MapPin size={13} className="text-rose-300" />
          {hotel.city}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-rose-600 transition-colors line-clamp-1">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-1 ml-2 shrink-0">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold text-slate-700">{rating}</span>
            <span className="text-xs text-slate-400">({reviews})</span>
          </div>
        </div>

        {/* Amenities */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {hotel.amenities.slice(0, 4).map((a) => (
              <span key={a} className="amenity-tag text-xs">
                {amenityIcons[a] || null}
                {a}
              </span>
            ))}
            {hotel.amenities.length > 4 && (
              <span className="amenity-tag text-xs text-slate-400">+{hotel.amenities.length - 4}</span>
            )}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-400">Free cancellation</div>
          <button className="text-xs font-semibold brand-gradient-text hover:opacity-80 transition-opacity">
            View details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
