import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Search, Star, Shield, Zap, Globe, ArrowRight, ChevronRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const DESTINATIONS = [
  { city: 'Mumbai', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', hotels: '240+' },
  { city: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80', hotels: '380+' },
  { city: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80', hotels: '160+' },
  { city: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145ed31f1a?w=400&q=80', hotels: '190+' },
  { city: 'Bangalore', image: 'https://images.unsplash.com/photo-1596178060810-72f53ce9a65c?w=400&q=80', hotels: '310+' },
  { city: 'Chennai', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&q=80', hotels: '200+' },
];

const FEATURES = [
  { icon: Shield, title: 'Verified Properties', desc: 'Every listing is verified by our quality team for your peace of mind.', color: 'bg-blue-50 text-blue-600' },
  { icon: Zap, title: 'Instant Booking', desc: 'Book your perfect stay in seconds with our seamless checkout process.', color: 'bg-amber-50 text-amber-600' },
  { icon: Globe, title: 'Best Price Guarantee', desc: 'We match or beat any price you find elsewhere. Guaranteed.', color: 'bg-emerald-50 text-emerald-600' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Business Traveller', text: 'Roamify made my last-minute trip to Goa completely stress-free. Booked in under 2 minutes!', rating: 5, avatar: 'PS' },
  { name: 'Arjun Mehta', role: 'Family Traveller', text: 'Amazing selection of hotels in Jaipur. The whole booking process was smooth and transparent.', rating: 5, avatar: 'AM' },
  { name: 'Sneha Patel', role: 'Solo Explorer', text: 'Best platform for finding boutique hotels. Love the detailed amenity info and real photos!', rating: 5, avatar: 'SP' },
];

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({
    city: '',
    startDate: '',
    endDate: '',
    roomsCount: 1,
  });

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams({
      city: searchForm.city || '',
      startDate: searchForm.startDate || today,
      endDate: searchForm.endDate || tomorrow,
      roomsCount: String(searchForm.roomsCount),
    });
    navigate(`/search?${p.toString()}`);
  };

  const handleDestinationClick = (city: string) => {
    const p = new URLSearchParams({ city, startDate: today, endDate: tomorrow, roomsCount: '1' });
    navigate(`/search?${p.toString()}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero-bg min-h-[88vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1455587734955-081b22074882?w=1600&q=80"
            alt="Luxury hotel"
            className="w-full h-full object-cover opacity-25"
          />
        </div>

        <div className="container relative z-10 py-20">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span className="text-white/90 text-sm font-medium">Trusted by 2M+ travellers worldwide</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight animate-slide-up">
              Find Your Perfect{' '}
              <span className="brand-gradient-text">Stay</span>
            </h1>
            <p className="text-lg md:text-xl text-white/75 mb-12 animate-slide-up max-w-xl mx-auto">
              Discover handpicked hotels with the best prices. Book instantly, travel confidently.
            </p>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="animate-slide-up">
              <div className="search-box max-w-3xl mx-auto">
                <div className="search-box-destination flex-1 min-w-0">
                  <div className="flex items-center gap-2 px-4">
                    <MapPin size={16} className="text-rose-500 shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Destination</div>
                      <input
                        className="search-field p-0 text-sm"
                        placeholder="Where are you going?"
                        value={searchForm.city}
                        onChange={e => setSearchForm(s => ({ ...s, city: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="search-divider" />

                <div className="search-box-check-in flex-1 min-w-0">
                  <div className="flex items-center gap-2 px-4">
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Check-in</div>
                      <input
                        type="date"
                        className="search-field p-0 text-sm"
                        value={searchForm.startDate}
                        min={today}
                        onChange={e => setSearchForm(s => ({ ...s, startDate: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="search-divider" />

                <div className="search-box-check-out flex-1 min-w-0">
                  <div className="flex items-center gap-2 px-4">
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Check-out</div>
                      <input
                        type="date"
                        className="search-field p-0 text-sm"
                        value={searchForm.endDate}
                        min={searchForm.startDate || today}
                        onChange={e => setSearchForm(s => ({ ...s, endDate: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="search-divider" />

                <div className="search-box-rooms flex-1 min-w-0">
                  <div className="flex items-center gap-2 px-4">
                    <Users size={16} className="text-rose-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Rooms</div>
                      <input
                        type="number"
                        min={1} max={10}
                        className="search-field p-0 text-sm"
                        value={searchForm.roomsCount}
                        onChange={e => setSearchForm(s => ({ ...s, roomsCount: Number(e.target.value) }))}
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg shrink-0 gap-2">
                  <Search size={18} />
                  <span>Search</span>
                </button>
              </div>
            </form>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-12 animate-fade-in">
              {[['10K+', 'Hotels'], ['2M+', 'Travellers'], ['50+', 'Cities'], ['4.9★', 'Rating']].map(([val, label]) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-black text-white">{val}</div>
                  <div className="text-xs text-white/60 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Popular Destinations ─────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Popular Destinations</h2>
              <p className="text-slate-500 mt-2">Explore India's most loved travel spots</p>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="btn btn-outline btn-sm gap-1"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {DESTINATIONS.map((dest) => (
              <div
                key={dest.city}
                className="relative h-48 rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => handleDestinationClick(dest.city)}
              >
                <img
                  src={dest.image}
                  alt={dest.city}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white font-bold text-lg">{dest.city}</h3>
                  <p className="text-white/75 text-sm">{dest.hotels} hotels</p>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5">
                    <ChevronRight size={14} className="text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why Roamify ──────────────────────────────────────────────────── */}
      <section className="section bg-slate-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900">Why Choose Roamify?</h2>
            <p className="text-slate-500 mt-3 max-w-lg mx-auto">We've made hotel booking as smooth as possible so you can focus on what matters — enjoying your trip.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-8 text-center group hover:scale-102 transition-transform">
                <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                  <f.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900">How It Works</h2>
            <p className="text-slate-500 mt-3">Book your dream stay in 3 easy steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { step: '01', title: 'Search', desc: 'Enter your destination, dates, and number of rooms to find the best options.', icon: Search },
              { step: '02', title: 'Choose', desc: 'Browse hotel listings, compare prices, amenities, and select your perfect room.', icon: Star },
              { step: '03', title: 'Book & Go', desc: 'Complete payment securely via Stripe and receive your instant booking confirmation.', icon: Zap },
            ].map((item, i) => (
              <div key={item.step} className="flex flex-col items-center text-center relative">
                <div className="w-16 h-16 brand-gradient rounded-2xl flex items-center justify-center mb-5 shadow-lg">
                  <item.icon size={24} className="text-white" />
                </div>
                <div className="text-xs font-bold text-rose-500 mb-2 tracking-wider">STEP {item.step}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 right-0 w-1/2 h-0.5 bg-gradient-to-r from-rose-200 to-orange-200 translate-x-full" />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button onClick={() => navigate('/signup')} className="btn btn-primary btn-lg">
              Start Exploring <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────────────────── */}
      <section className="section bg-slate-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900">What Travellers Say</h2>
            <p className="text-slate-500 mt-3">Real reviews from real guests</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 brand-gradient rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-slate-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 brand-gradient">
        <div className="container text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to Roam?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">
            Join millions of happy travellers. Sign up for free and start exploring.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/signup')} className="btn w-full sm:w-auto bg-white text-rose-600 hover:bg-white/90 btn-lg">
              Create Free Account
            </button>
            <button onClick={() => navigate('/search')} className="btn w-full sm:w-auto bg-white/15 text-white border border-white/30 hover:bg-white/25 btn-lg">
              Browse Hotels
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
