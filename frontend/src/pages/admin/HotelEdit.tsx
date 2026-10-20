import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Save, ChevronLeft, Plus, Trash2, Edit3, Zap, BarChart2, Calendar,
  Hotel, Bed, X
} from 'lucide-react';
import { adminApi } from '../../api/admin';
import type { HotelDto, RoomDto, BookingDto, HotelReportDto } from '../../types';
import Navbar from '../../components/layout/Navbar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import { toast } from '../../components/ui/toastService';

const TABS = ['Details', 'Rooms', 'Bookings', 'Reports'];

const HotelEdit: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const isNew = hotelId === 'new';

  const [activeTab, setActiveTab] = useState(0);
  const [hotel, setHotel] = useState<HotelDto>({
    name: '', city: '', photos: [], amenities: [], active: false,
    contactInfo: { address: '', phoneNumber: '', email: '', location: '' }
  });
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [report, setReport] = useState<HotelReportDto | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [activating, setActivating] = useState(false);
  const [roomModal, setRoomModal] = useState<'add' | 'edit' | null>(null);
  const [editingRoom, setEditingRoom] = useState<RoomDto | null>(null);
  const [roomForm, setRoomForm] = useState<RoomDto>({ type: '', basePrice: 0, totalCount: 1, amenities: [] });
  const [roomSaving, setRoomSaving] = useState(false);
  const [deletingRoom, setDeletingRoom] = useState<number | null>(null);
  const [amenityInput, setAmenityInput] = useState('');

  useEffect(() => {
    if (isNew) return;
    const id = Number(hotelId);
    setLoading(true);
    Promise.all([
      adminApi.getHotel(id),
      adminApi.getAllRooms(id),
      adminApi.getHotelBookings(id),
      adminApi.getHotelReport(id),
    ]).then(([h, r, b, rep]) => {
      setHotel(h);
      setRooms(r);
      setBookings(b);
      setReport(rep);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [hotelId, isNew]);

  const handleSaveHotel = async () => {
    setSaving(true);
    try {
      if (isNew) {
        const created = await adminApi.createHotel(hotel);
        navigate(`/admin/hotels/${created.id}`, { replace: true });
      } else {
        const updated = await adminApi.updateHotel(Number(hotelId), hotel);
        setHotel(updated);
        toast.success('Hotel updated successfully.');
      }
    } catch {
    return;
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async () => {
    setActivating(true);
    try {
      await adminApi.activateHotel(Number(hotelId));
      setHotel(h => ({ ...h, active: true }));
    } catch {
      return;
    } finally {
      setActivating(false);
    }
  };

  const openAddRoom = () => {
    setRoomForm({ type: '', basePrice: 0, totalCount: 1, amenities: [] });
    setEditingRoom(null);
    setRoomModal('add');
  };

  const openEditRoom = (room: RoomDto) => {
    setEditingRoom(room);
    setRoomForm({ type: room.type, basePrice: room.basePrice, totalCount: room.totalCount, amenities: room.amenities || [] });
    setRoomModal('edit');
  };

  const handleSaveRoom = async () => {
    if (!hotelId || isNew) return;
    setRoomSaving(true);
    try {
      if (roomModal === 'add') {
        const created = await adminApi.createRoom(Number(hotelId), roomForm);
        setRooms(r => [...r, created]);
      } else if (roomModal === 'edit' && editingRoom?.id) {
        const updated = await adminApi.updateRoom(Number(hotelId), editingRoom.id, roomForm);
        setRooms(r => r.map(x => x.id === editingRoom.id ? updated : x));
      }
      setRoomModal(null);
    } catch {
      return;
    } finally {
      setRoomSaving(false);
    }
  };

  const handleDeleteRoom = async (roomId: number) => {
    if (!confirm('Delete this room?')) return;
    setDeletingRoom(roomId);
    try {
      await adminApi.deleteRoom(Number(hotelId), roomId);
      setRooms(r => r.filter(x => x.id !== roomId));
    } catch {
      return;
    } finally {
      setDeletingRoom(null);
    }
  };

  const addAmenity = () => {
    if (!amenityInput.trim()) return;
    setHotel(h => ({ ...h, amenities: [...(h.amenities || []), amenityInput.trim()] }));
    setAmenityInput('');
  };

  const removeAmenity = (a: string) => {
    setHotel(h => ({ ...h, amenities: (h.amenities || []).filter(x => x !== a) }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" dark text="Loading hotel..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container py-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/admin')} className="btn btn-ghost btn-icon text-slate-500">
                <ChevronLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-black text-slate-900">
                  {isNew ? 'Add New Hotel' : hotel.name || 'Edit Hotel'}
                </h1>
                {!isNew && (
                  <p className="text-sm text-slate-500">{hotel.city}
                    <span className={`badge ml-2 ${hotel.active ? 'badge-success' : 'badge-warning'}`}>
                      {hotel.active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isNew && !hotel.active && (
                <button onClick={handleActivate} disabled={activating} className="btn btn-outline btn-sm gap-1.5 text-emerald-600 border-emerald-300">
                  {activating ? <LoadingSpinner size="sm" dark /> : <><Zap size={14} /> Activate</>}
                </button>
              )}
              <button onClick={handleSaveHotel} disabled={saving} className="btn btn-primary btn-sm gap-1.5">
                {saving ? <LoadingSpinner size="sm" /> : <><Save size={14} /> Save</>}
              </button>
            </div>
          </div>

          {/* Tabs (only for existing hotels) */}
          {!isNew && (
            <div className="flex gap-1 mt-5 overflow-x-auto">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`btn btn-sm shrink-0 ${activeTab === i ? 'btn-primary' : 'btn-ghost'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container py-8">
        {/* ─── Details Tab ──────────────────────────────────────────────── */}
        {(isNew || activeTab === 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            <div className="card p-6 space-y-5">
              <h2 className="font-bold text-slate-900 text-lg">Basic Information</h2>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Hotel Name *</label>
                <input
                  className="input-field"
                  placeholder="e.g. Grand Hyatt Mumbai"
                  value={hotel.name}
                  onChange={e => setHotel(h => ({ ...h, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">City *</label>
                <input
                  className="input-field"
                  placeholder="e.g. Mumbai"
                  value={hotel.city}
                  onChange={e => setHotel(h => ({ ...h, city: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Amenities</label>
                <div className="flex gap-2 mb-2">
                  <input
                    className="input-field flex-1"
                    placeholder="e.g. WiFi, Pool, Gym..."
                    value={amenityInput}
                    onChange={e => setAmenityInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  />
                  <button onClick={addAmenity} className="btn btn-outline btn-sm">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(hotel.amenities || []).map(a => (
                    <span key={a} className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-full px-3 py-1 text-xs font-medium">
                      {a}
                      <button onClick={() => removeAmenity(a)} className="hover:text-red-700"><X size={11} /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="card p-6 space-y-5">
              <h2 className="font-bold text-slate-900 text-lg">Contact Information</h2>
              {[
                { key: 'address', label: 'Address', placeholder: '123 Main St, Mumbai' },
                { key: 'phoneNumber', label: 'Phone Number', placeholder: '+91 98765 43210' },
                { key: 'email', label: 'Email', placeholder: 'hotel@example.com' },
                { key: 'location', label: 'Google Maps Link / Location', placeholder: 'https://maps.google.com/...' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">{field.label}</label>
                  <input
                    className="input-field"
                    placeholder={field.placeholder}
                    value={(hotel.contactInfo as any)?.[field.key] || ''}
                    onChange={e => setHotel(h => ({
                      ...h,
                      contactInfo: { ...h.contactInfo, [field.key]: e.target.value }
                    }))}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Rooms Tab ────────────────────────────────────────────────── */}
        {!isNew && activeTab === 1 && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Rooms ({rooms.length})</h2>
              <button onClick={openAddRoom} className="btn btn-primary btn-sm gap-1.5">
                <Plus size={14} /> Add Room
              </button>
            </div>
            {rooms.length === 0 ? (
              <div className="card p-12 text-center">
                <Bed size={36} className="text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500">No rooms yet. Add your first room type.</p>
                <button onClick={openAddRoom} className="btn btn-primary btn-sm mt-4">Add Room</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map(room => (
                  <div key={room.id} className="card p-5 group">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-slate-900">{room.type}</h3>
                        <p className="text-sm text-slate-500">{room.totalCount} room{room.totalCount !== 1 ? 's' : ''}</p>
                      </div>
                      <p className="text-xl font-black brand-gradient-text">
                        ₹{Number(room.basePrice || 0).toLocaleString('en-IN')}
                        <span className="text-xs text-slate-400 font-normal">/night</span>
                      </p>
                    </div>
                    {room.amenities && room.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {room.amenities.slice(0, 3).map(a => (
                          <span key={a} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{a}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => navigate(`/admin/inventory/${room.id}`)}
                        className="btn btn-ghost btn-sm gap-1 flex-1 text-slate-600"
                      >
                        <Calendar size={13} /> Inventory
                      </button>
                      <button onClick={() => openEditRoom(room)} className="btn btn-outline btn-sm">
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id!)}
                        disabled={deletingRoom === room.id}
                        className="btn btn-danger btn-sm"
                      >
                        {deletingRoom === room.id ? <LoadingSpinner size="sm" /> : <Trash2 size={13} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Bookings Tab ─────────────────────────────────────────────── */}
        {!isNew && activeTab === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-slate-900 mb-6">All Bookings ({bookings.length})</h2>
            {bookings.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-slate-500">No bookings for this hotel yet.</p>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Rooms</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id}>
                        <td className="font-semibold">#{b.id}</td>
                        <td>{b.checkInDate}</td>
                        <td>{b.checkOutDate}</td>
                        <td>{b.roomsCount}</td>
                        <td className="font-semibold">₹{Number(b.amount || 0).toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`badge ${
                            b.bookingStatus === 'CONFIRMED' ? 'badge-success' :
                            b.bookingStatus === 'PENDING' ? 'badge-warning' :
                            b.bookingStatus === 'CANCELLED' ? 'badge-danger' : 'badge-neutral'
                          }`}>
                            {b.bookingStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ─── Reports Tab ──────────────────────────────────────────────── */}
        {!isNew && activeTab === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Revenue Reports</h2>
            {report ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { label: 'Total Revenue', value: `₹${Number(report.totalRevenue || 0).toLocaleString('en-IN')}`, icon: BarChart2, color: 'bg-emerald-50 text-emerald-600' },
                  { label: 'Total Bookings', value: String(report.totalBookings || 0), icon: Calendar, color: 'bg-blue-50 text-blue-600' },
                  { label: 'Total Rooms', value: String(report.totalRooms || 0), icon: Hotel, color: 'bg-rose-50 text-rose-600' },
                ].map(stat => (
                  <div key={stat.label} className="card p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                        <stat.icon size={22} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                        <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <p className="text-slate-500">No report data available.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Room Modal */}
      <Modal
        isOpen={!!roomModal}
        onClose={() => setRoomModal(null)}
        title={roomModal === 'add' ? 'Add New Room' : 'Edit Room'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Room Type *</label>
            <input
              className="input-field"
              placeholder="e.g. Deluxe King, Standard Double..."
              value={roomForm.type}
              onChange={e => setRoomForm(r => ({ ...r, type: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Base Price (₹/night) *</label>
              <input
                type="number"
                min={0}
                className="input-field"
                placeholder="e.g. 3500"
                value={roomForm.basePrice}
                onChange={e => setRoomForm(r => ({ ...r, basePrice: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Total Rooms *</label>
              <input
                type="number"
                min={1}
                className="input-field"
                placeholder="e.g. 10"
                value={roomForm.totalCount}
                onChange={e => setRoomForm(r => ({ ...r, totalCount: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setRoomModal(null)} className="btn btn-ghost flex-1">Cancel</button>
            <button
              onClick={handleSaveRoom}
              disabled={roomSaving || !roomForm.type || !roomForm.basePrice}
              className="btn btn-primary flex-1"
            >
              {roomSaving ? <LoadingSpinner size="sm" /> : 'Save Room'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HotelEdit;
