import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Check, Edit3, Plus, Trash2, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usersApi } from '../api/users';
import type { UserDto, GuestDto, ProfileUpdateRequest } from '../types';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';

const Profile: React.FC = () => {
  const { user: authUser, refreshUser } = useAuth();
  const [profile, setProfile] = useState<UserDto | null>(null);
  const [guests, setGuests] = useState<GuestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'guests'>('profile');

  // Profile edit state
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileUpdateRequest>({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Guest state
  const [guestModal, setGuestModal] = useState<'add' | 'edit' | null>(null);
  const [editingGuest, setEditingGuest] = useState<GuestDto | null>(null);
  const [guestForm, setGuestForm] = useState<GuestDto>({ name: '', gender: 'MALE', dateOfBirth: '' });
  const [guestSaving, setGuestSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([usersApi.getProfile(), usersApi.getGuests()])
      .then(([p, g]) => {
        setProfile(p);
        setGuests(g);
        setProfileForm({ name: p.name, dateOfBirth: p.dateOfBirth, gender: p.gender });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await usersApi.updateProfile(profileForm);
      await refreshUser();
      const updated = await usersApi.getProfile();
      setProfile(updated);
      setEditMode(false);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch {
      return;
    } finally {
      setSavingProfile(false);
    }
  };

  const openAddGuest = () => {
    setGuestForm({ name: '', gender: 'MALE', dateOfBirth: '' });
    setGuestModal('add');
  };

  const openEditGuest = (g: GuestDto) => {
    setEditingGuest(g);
    setGuestForm({ name: g.name, gender: g.gender, dateOfBirth: g.dateOfBirth });
    setGuestModal('edit');
  };

  const handleSaveGuest = async () => {
    setGuestSaving(true);
    try {
      if (guestModal === 'add') {
        const created = await usersApi.addGuest(guestForm);
        setGuests(g => [...g, created]);
      } else if (guestModal === 'edit' && editingGuest?.id) {
        await usersApi.updateGuest(editingGuest.id, guestForm);
        setGuests(g => g.map(x => x.id === editingGuest.id ? { ...x, ...guestForm } : x));
      }
      setGuestModal(null);
    } catch {
      return;
    } finally {
      setGuestSaving(false);
    }
  };

  const handleDeleteGuest = async (id: number) => {
    if (!confirm('Remove this guest?')) return;
    setDeletingId(id);
    try {
      await usersApi.deleteGuest(id);
      setGuests(g => g.filter(x => x.id !== id));
    } catch {
      return;
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container py-20 flex items-center justify-center">
          <LoadingSpinner size="lg" dark text="Loading profile..." />
        </div>
      </div>
    );
  }

  const displayName = profile?.name || authUser?.name || 'User';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className="brand-gradient">
        <div className="container py-12">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="w-20 h-20 bg-white/25 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl border-2 border-white/30">
              {initials}
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">{displayName}</h1>
              <p className="text-white/75 mt-1">{profile?.email || authUser?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-4xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`btn gap-2 ${activeTab === 'profile' ? 'btn-primary' : 'btn-ghost border border-slate-200'}`}
          >
            <User size={15} /> Profile
          </button>
          <button
            onClick={() => setActiveTab('guests')}
            className={`btn gap-2 ${activeTab === 'guests' ? 'btn-primary' : 'btn-ghost border border-slate-200'}`}
          >
            <Users size={15} /> My Guests ({guests.length})
          </button>
        </div>

        {/* ─── Profile Tab ─────────────────────────────────────────────── */}
        {activeTab === 'profile' && (
          <div className="card p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
              {!editMode ? (
                <button onClick={() => setEditMode(true)} className="btn btn-outline btn-sm gap-1.5">
                  <Edit3 size={14} /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setEditMode(false)} className="btn btn-ghost btn-sm">Cancel</button>
                  <button onClick={handleSaveProfile} disabled={savingProfile} className="btn btn-primary btn-sm gap-1.5">
                    {savingProfile ? <LoadingSpinner size="sm" /> : <><Check size={14} /> Save</>}
                  </button>
                </div>
              )}
            </div>

            {profileSuccess && (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-6 animate-fade-in">
                <Check size={16} className="text-emerald-600" />
                <p className="text-sm text-emerald-700 font-medium">Profile updated successfully!</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider text-xs">
                  <User size={12} className="inline mr-1.5" />Full Name
                </label>
                {editMode ? (
                  <input
                    className="input-field"
                    value={profileForm.name || ''}
                    onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                  />
                ) : (
                  <p className="text-slate-900 font-semibold">{profile?.name || '—'}</p>
                )}
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider text-xs">
                  <Mail size={12} className="inline mr-1.5" />Email Address
                </label>
                <p className="text-slate-900 font-semibold">{profile?.email || authUser?.email || '—'}</p>
                <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider text-xs">
                  Gender
                </label>
                {editMode ? (
                  <select
                    className="input-field"
                    value={profileForm.gender || ''}
                    onChange={e => setProfileForm(f => ({ ...f, gender: e.target.value as any }))}
                  >
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                ) : (
                  <p className="text-slate-900 font-semibold">{profile?.gender || '—'}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider text-xs">
                  <Calendar size={12} className="inline mr-1.5" />Date of Birth
                </label>
                {editMode ? (
                  <input
                    type="date"
                    className="input-field"
                    value={profileForm.dateOfBirth || ''}
                    onChange={e => setProfileForm(f => ({ ...f, dateOfBirth: e.target.value }))}
                  />
                ) : (
                  <p className="text-slate-900 font-semibold">{profile?.dateOfBirth || '—'}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── Guests Tab ──────────────────────────────────────────────── */}
        {activeTab === 'guests' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Saved Guests</h2>
                <p className="text-slate-500 text-sm mt-1">Add travellers for faster booking</p>
              </div>
              <button onClick={openAddGuest} className="btn btn-primary gap-1.5">
                <Plus size={15} /> Add Guest
              </button>
            </div>

            {guests.length === 0 ? (
              <div className="card p-16 text-center">
                <Users size={40} className="text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">No guests yet</h3>
                <p className="text-slate-500 text-sm mb-6">Add family members or frequent travel companions for quicker booking.</p>
                <button onClick={openAddGuest} className="btn btn-primary gap-1.5">
                  <Plus size={15} /> Add First Guest
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guests.map(guest => (
                  <div key={guest.id} className="card p-5 flex items-center gap-4 group">
                    <div className="w-12 h-12 brand-gradient rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {guest.name[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">{guest.name}</p>
                      <p className="text-sm text-slate-500">{guest.gender} · {guest.dateOfBirth}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditGuest(guest)}
                        className="btn btn-ghost btn-icon text-slate-500 hover:text-rose-600"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteGuest(guest.id!)}
                        disabled={deletingId === guest.id}
                        className="btn btn-ghost btn-icon text-slate-500 hover:text-red-600"
                      >
                        {deletingId === guest.id ? <LoadingSpinner size="sm" dark /> : <Trash2 size={15} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Guest Modal */}
      <Modal
        isOpen={!!guestModal}
        onClose={() => setGuestModal(null)}
        title={guestModal === 'add' ? 'Add New Guest' : 'Edit Guest'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
            <input
              className="input-field"
              placeholder="Guest's full name"
              value={guestForm.name}
              onChange={e => setGuestForm(g => ({ ...g, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender *</label>
            <select
              className="input-field"
              value={guestForm.gender}
              onChange={e => setGuestForm(g => ({ ...g, gender: e.target.value as any }))}
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
              value={guestForm.dateOfBirth}
              onChange={e => setGuestForm(g => ({ ...g, dateOfBirth: e.target.value }))}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setGuestModal(null)} className="btn btn-ghost flex-1">Cancel</button>
            <button
              onClick={handleSaveGuest}
              disabled={guestSaving || !guestForm.name || !guestForm.dateOfBirth}
              className="btn btn-primary flex-1"
            >
              {guestSaving ? <LoadingSpinner size="sm" /> : 'Save Guest'}
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default Profile;
