import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Save } from 'lucide-react';
import { adminApi } from '../../api/admin';
import type { InventoryDto } from '../../types';
import Navbar from '../../components/layout/Navbar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from '../../components/ui/toastService';

const Inventory: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<InventoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [updateForm, setUpdateForm] = useState({ closed: false, surgeFactor: 1.0 });

  useEffect(() => {
    if (!roomId) return;
    adminApi.getRoomInventory(Number(roomId))
      .then(setInventory)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [roomId]);

  const toggleSelect = (date: string) => {
    setSelected(s => s.includes(date) ? s.filter(d => d !== date) : [...s, date]);
  };

  const handleUpdate = async () => {
    if (!roomId || selected.length === 0) return;
    setUpdating(true);
    const sortedDates = [...selected].sort();
    const startDate = sortedDates[0];
    const endDate = sortedDates[sortedDates.length - 1];
    try {
      await adminApi.updateInventory(Number(roomId), {
        startDate,
        endDate,
        closed: updateForm.closed,
        surgeFactor: updateForm.surgeFactor,
      });
      // Refresh
      const updated = await adminApi.getRoomInventory(Number(roomId));
      setInventory(updated);
      setSelected([]);
      toast.success('Inventory updated.');
    } catch {
      return;
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" dark text="Loading inventory..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container py-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="btn btn-ghost btn-icon text-slate-500">
                <ChevronLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-black text-slate-900">Room Inventory</h1>
                <p className="text-sm text-slate-500">Room ID #{roomId} · {inventory.length} days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Update Panel (shown when dates selected) */}
        {selected.length > 0 && (
          <div className="card p-5 mb-6 border-l-4 border-rose-500 animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="font-semibold text-slate-900">{selected.length} date{selected.length !== 1 ? 's' : ''} selected</p>
              <div className="flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm font-medium text-slate-700">Closed</span>
                  <button
                    onClick={() => setUpdateForm(f => ({ ...f, closed: !f.closed }))}
                    className={`w-10 h-6 rounded-full relative transition-colors ${updateForm.closed ? 'bg-red-500' : 'bg-slate-200'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${updateForm.closed ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </label>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-slate-700">Surge Factor</label>
                  <input
                    type="number"
                    min={1} max={5} step={0.1}
                    className="input-field w-20 py-1.5 text-sm"
                    value={updateForm.surgeFactor}
                    onChange={e => setUpdateForm(f => ({ ...f, surgeFactor: Number(e.target.value) }))}
                  />
                </div>
                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="btn btn-primary btn-sm gap-1.5"
                >
                  {updating ? <LoadingSpinner size="sm" /> : <><Save size={13} /> Apply</>}
                </button>
                <button onClick={() => setSelected([])} className="btn btn-ghost btn-sm">Clear</button>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Calendar */}
        {inventory.length === 0 ? (
          <div className="card p-12 text-center">
            <Calendar size={36} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500">No inventory records yet for this room.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {inventory.map(inv => {
              const isSelected = selected.includes(inv.date);
              const available = inv.totalCount - inv.bookedCount - inv.reservedCount;

              return (
                <div
                  key={inv.date}
                  onClick={() => toggleSelect(inv.date)}
                  className={`card p-3 cursor-pointer text-center text-sm transition-all ${
                    isSelected
                      ? 'border-2 border-rose-500 bg-rose-50'
                      : inv.closed
                      ? 'opacity-60 bg-slate-100'
                      : 'hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-500 mb-1">
                    {new Date(inv.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </p>
                  {inv.closed ? (
                    <span className="badge badge-danger text-xs">Closed</span>
                  ) : (
                    <p className="font-bold text-slate-900 text-xs">{available} avail</p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    ×{inv.surgeFactor?.toFixed(1)}
                  </p>
                  <p className="text-xs font-semibold brand-gradient-text mt-1">
                    ₹{Math.round(inv.price || 0).toLocaleString('en-IN')}
                  </p>
                  {isSelected && (
                    <div className="absolute top-1 right-1">
                      <div className="w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
