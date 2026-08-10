import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Building, MapPin, Shield, Phone, Scale, User, CheckCircle2, AlertCircle, X, Save } from 'lucide-react';
import { createWeighbridge, updateWeighbridge, deleteWeighbridge } from '../services/api';

export default function KantaRegistry({ kantas, onRefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [editingKanta, setEditingKanta] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    kantaName: '',
    location: '',
    ownerPan: '',
    userName: '',
    capacity: '60,000 Kg',
    phone: '',
    status: 'ACTIVE',
  });

  const handleOpenAdd = () => {
    setEditingKanta(null);
    setFormData({
      kantaName: '',
      location: 'Rajasthan, India',
      ownerPan: 'ABCDE1234F',
      userName: 'Kanta Operator',
      capacity: '60,000 Kg',
      phone: '9829000000',
      status: 'ACTIVE',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (kanta) => {
    setEditingKanta(kanta);
    setFormData({
      kantaName: kanta.kantaName || '',
      location: kanta.location || '',
      ownerPan: kanta.ownerPan || '',
      userName: kanta.userName || '',
      capacity: kanta.capacity || '60,000 Kg',
      phone: kanta.phone || '',
      status: kanta.status || 'ACTIVE',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.kantaName || !formData.location) return;

    setLoading(true);
    try {
      if (editingKanta) {
        await updateWeighbridge(editingKanta.id, formData);
      } else {
        await createWeighbridge(formData);
      }
      setShowModal(false);
      onRefresh();
    } catch (err) {
      alert('Failed to save weighbridge: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name} from MongoDB?`)) {
      setLoading(true);
      try {
        await deleteWeighbridge(id);
        onRefresh();
      } catch (err) {
        alert('Delete failed: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Dharam Kanta Master Registry</h2>
          <p className="text-xs font-medium text-slate-500">Manage all registered weighbridges & scale capacities in MongoDB</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-gradient-to-r from-[#1B4326] to-emerald-700 text-white font-bold text-xs rounded-xl hover:from-emerald-900 hover:to-emerald-800 shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Register New Dharam Kanta</span>
        </button>
      </div>

      {/* KANTA CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kantas.map((k) => (
          <div
            key={k.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#1B4326] flex items-center justify-center font-bold text-xl border border-emerald-200 shadow-sm">
                  <Building className="w-6 h-6" />
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                  k.status === 'ACTIVE'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}>
                  ● {k.status || 'ACTIVE'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1 group-hover:text-emerald-800 transition-colors">
                {k.kantaName}
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{k.location}</span>
              </p>

              <div className="space-y-2 py-3 border-t border-b border-slate-100 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Weighbridge ID:</span>
                  <span className="font-bold text-[#1B4326]">{k.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Scale Capacity:</span>
                  <span className="font-bold text-slate-800">{k.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Operator:</span>
                  <span className="font-semibold text-slate-800">{k.userName || 'Assigned Operator'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Owner PAN:</span>
                  <span className="font-bold text-slate-700">{k.ownerPan || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between text-xs text-slate-600 font-medium">
              <span className="font-mono flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {k.phone || '9800000000'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(k)}
                  className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
                  title="Edit Dharam Kanta"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(k.id, k.kantaName)}
                  className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors border border-red-200"
                  title="Delete Dharam Kanta"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">
                {editingKanta ? `Edit ${editingKanta.kantaName}` : 'Register New Dharam Kanta'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Dharam Kanta / Weighbridge Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jaipur Mandi Weighbridge"
                  value={formData.kantaName}
                  onChange={(e) => setFormData({ ...formData, kantaName: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Location / District</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jaipur, Rajasthan"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Scale Capacity</label>
                  <input
                    type="text"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl font-mono focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Operator Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="10-digit mobile"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl font-mono focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Owner PAN</label>
                  <input
                    type="text"
                    placeholder="ABCDE1234F"
                    value={formData.ownerPan}
                    onChange={(e) => setFormData({ ...formData, ownerPan: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl font-mono focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#1B4326] text-white font-bold rounded-xl hover:bg-emerald-900 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving to MongoDB...' : 'Save Weighbridge'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
