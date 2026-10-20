import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Search as SearchIcon, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { hotelsApi } from '../api/hotels';
import type { HotelPriceResponseDto } from '../types';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HotelCard from '../components/hotels/HotelCard';


const SearchPage: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [form, setForm] = useState({
    city: params.get('city') || '',
    startDate: params.get('startDate') || today,
    endDate: params.get('endDate') || tomorrow,
    roomsCount: Number(params.get('roomsCount') || 1),
  });

  const [hotels, setHotels] = useState<HotelPriceResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (currentPage = 0) => {
    setLoading(true);
    setError('');
    try {
      const result = await hotelsApi.search({
        city: form.city,
        startDate: form.startDate,
        endDate: form.endDate,
        roomsCount: form.roomsCount,
        page: currentPage,
        size: 9,
      });
      setHotels(result.content || []);
      setTotalPages(result.totalPages || 0);
      setTotalResults(result.totalElements || 0);
      setPage(currentPage);
      setSearched(true);
    } catch (err: any) {
      // If 404 / empty, show no results
      setHotels([]);
      setTotalPages(0);
      setTotalResults(0);
      setSearched(true);
      if (err?.response?.status !== 404) {
        setError('Failed to fetch hotels. Make sure the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  }, [form]);

  // Auto-search on mount if params exist
  useEffect(() => {
    if (params.get('city') || params.get('startDate')) {
      doSearch(0);
    }
  }, []); // eslint-disable-line

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams({
      city: form.city,
      startDate: form.startDate,
      endDate: form.endDate,
      roomsCount: String(form.roomsCount),
    });
    doSearch(0);
  };

  const searchParams = {
    startDate: form.startDate,
    endDate: form.endDate,
    roomsCount: form.roomsCount,
  };

  const nights = form.startDate && form.endDate
    ? Math.max(1, Math.round((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000))
    : 1;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Search Bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container py-4">
          <form onSubmit={handleSearch}>
            <div className="flex flex-wrap items-end gap-3">
              {/* City */}
              <div className="flex-1 min-w-48">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  <MapPin size={11} className="inline mr-1" />Destination
                </label>
                <input
                  className="input-field"
                  placeholder="City"
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                />
              </div>
              {/* Check-in */}
              <div className="flex-1 min-w-36">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  <Calendar size={11} className="inline mr-1" />Check-in
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={form.startDate}
                  min={today}
                  onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                />
              </div>
              {/* Check-out */}
              <div className="flex-1 min-w-36">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  <Calendar size={11} className="inline mr-1" />Check-out
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={form.endDate}
                  min={form.startDate || today}
                  onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                />
              </div>
              {/* Rooms */}
              <div className="min-w-24">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  <Users size={11} className="inline mr-1" />Rooms
                </label>
                <input
                  type="number"
                  min={1} max={10}
                  className="input-field"
                  value={form.roomsCount}
                  onChange={e => setForm(f => ({ ...f, roomsCount: Number(e.target.value) }))}
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary gap-2 h-11">
                {loading ? (
                  <div className="spinner" style={{ width: 16, height: 16 }} />
                ) : (
                  <SearchIcon size={16} />
                )}
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container py-8">
        {/* Results Header */}
        {searched && !loading && (
          <div className="flex items-center justify-between mb-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                {hotels.length === 0
                  ? 'No hotels found'
                  : `${totalResults} hotel${totalResults !== 1 ? 's' : ''} found`}
              </h1>
              {form.city && (
                <p className="text-slate-500 text-sm mt-1">
                  in <span className="font-semibold text-slate-700">{form.city}</span>
                  {' · '}{nights} night{nights !== 1 ? 's' : ''}
                  {' · '}{form.roomsCount} room{form.roomsCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <button className="btn btn-ghost btn-sm gap-2 border border-slate-200">
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="skeleton h-52" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-4 w-1/2" />
                  <div className="flex gap-2">
                    <div className="skeleton h-7 w-16" />
                    <div className="skeleton h-7 w-16" />
                    <div className="skeleton h-7 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <p className="text-slate-600 font-medium">{error}</p>
            <button onClick={() => doSearch(0)} className="btn btn-outline btn-sm mt-4">Try again</button>
          </div>
        )}

        {/* Empty state */}
        {searched && !loading && !error && hotels.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏨</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No hotels found</h2>
            <p className="text-slate-500 mb-6">Try adjusting your search — different dates or city.</p>
            <button onClick={() => navigate('/')} className="btn btn-outline">← Back to Home</button>
          </div>
        )}

        {/* Hotel Grid */}
        {!loading && hotels.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel, i) => (
                <HotelCard key={hotel.id} hotel={hotel} index={i} searchParams={searchParams} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => doSearch(page - 1)}
                  disabled={page === 0}
                  className="btn btn-ghost btn-icon border border-slate-200"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => doSearch(i)}
                    className={`btn btn-sm ${i === page ? 'btn-primary' : 'btn-ghost border border-slate-200'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => doSearch(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="btn btn-ghost btn-icon border border-slate-200"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}

        {/* Initial (not searched) state */}
        {!searched && !loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Find your perfect stay</h2>
            <p className="text-slate-500">Enter a city and dates above to search hotels.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchPage;
