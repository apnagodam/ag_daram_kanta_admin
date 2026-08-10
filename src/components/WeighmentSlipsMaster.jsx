import React, { useState } from 'react';
import { Eye, Edit3, Trash2, Plus, Search, Filter, Camera, FileText, CheckCircle, AlertTriangle, X, Printer, Save } from 'lucide-react';
import { createWeighmentRecord, updateWeighmentRecord, deleteWeighmentRecord } from '../services/api';

export default function WeighmentSlipsMaster({ weighments, onRefresh }) {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSlip, setSelectedSlip] = useState(null); // Inspection Modal
  const [editingSlip, setEditingSlip] = useState(null); // Edit Modal
  const [isAdding, setIsAdding] = useState(false); // Add Modal
  const [loading, setLoading] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    truckNumber: '',
    slipNumber: '',
    type: 'inward',
    driverName: '',
    driverPhone: '',
    commodity: 'Wheat (Gehun)',
    grossWeightKg: 40000,
    tareWeightKg: 10000,
    kantaName: 'Ajmer Dharam Kanta (Main Mandi)',
    truckPhotoUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600',
    parchiPhotoUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
  });

  const filtered = weighments.filter((w) => {
    if (filterType !== 'all' && w.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const t = (w.truckNumber || '').toLowerCase();
      const d = (w.driverName || '').toLowerCase();
      const s = (w.slipNumber || '').toLowerCase();
      const c = (w.commodity || '').toLowerCase();
      const k = (w.kantaName || '').toLowerCase();
      return t.includes(q) || d.includes(q) || s.includes(q) || c.includes(q) || k.includes(q);
    }
    return true;
  });

  const handleOpenEdit = (slip) => {
    setEditingSlip(slip);
    setFormData({
      truckNumber: slip.truckNumber || '',
      slipNumber: slip.slipNumber || '',
      type: slip.type || 'inward',
      driverName: slip.driverName || '',
      driverPhone: slip.driverPhone || '',
      commodity: slip.commodity || '',
      grossWeightKg: slip.grossWeightKg || 0,
      tareWeightKg: slip.tareWeightKg || 0,
      kantaName: slip.kantaName || 'Ajmer Dharam Kanta',
      truckPhotoUrl: slip.truckPhotoUrl || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600',
      parchiPhotoUrl: slip.parchiPhotoUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    });
  };

  const handleOpenAdd = () => {
    setIsAdding(true);
    setFormData({
      truckNumber: 'RJ-14-GH-8899',
      slipNumber: `RST #${Math.floor(40000 + Math.random() * 9000)}`,
      type: 'inward',
      driverName: 'Devendra Singh',
      driverPhone: '9414012345',
      commodity: 'Mustard (Sarson)',
      grossWeightKg: 44000,
      tareWeightKg: 11000,
      kantaName: 'Ajmer Dharam Kanta (Main Mandi)',
      truckPhotoUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600',
      parchiPhotoUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingSlip) {
        await updateWeighmentRecord(editingSlip.id, formData);
        setEditingSlip(null);
      } else if (isAdding) {
        await createWeighmentRecord(formData);
        setIsAdding(false);
      }
      onRefresh();
    } catch (err) {
      alert('Error saving record: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, slipNo) => {
    if (window.confirm(`Are you sure you want to delete slip ${slipNo} from MongoDB?`)) {
      setLoading(true);
      try {
        await deleteWeighmentRecord(id);
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
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Weighment Slips Master & Vehicles</h2>
          <p className="text-xs font-medium text-slate-500">Live MongoDB Record of All Vehicle Entries, RST Slips & Parchi Photos</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* SEARCH BOX */}
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Truck #, Driver, Commodity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-sm"
            />
          </div>

          {/* TYPE FILTER SWITCH */}
          <div className="flex bg-slate-200 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${filterType === 'all' ? 'bg-[#1B4326] text-white shadow-sm' : 'text-slate-600'}`}
            >
              ALL
            </button>
            <button
              onClick={() => setFilterType('inward')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${filterType === 'inward' ? 'bg-[#1B4326] text-white shadow-sm' : 'text-slate-600'}`}
            >
              INWARD
            </button>
            <button
              onClick={() => setFilterType('outward')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${filterType === 'outward' ? 'bg-[#1B4326] text-white shadow-sm' : 'text-slate-600'}`}
            >
              OUTWARD
            </button>
          </div>

          {/* ADD RECORD BUTTON */}
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-gradient-to-r from-[#1B4326] to-emerald-700 text-white font-bold text-xs rounded-xl shadow-md hover:from-emerald-900 hover:to-emerald-800 transition-all flex items-center gap-1.5 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Slip</span>
          </button>
        </div>
      </div>

      {/* MASTER DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Vehicle Plate</th>
                <th className="py-4 px-6">Parchi / Truck Photo</th>
                <th className="py-4 px-6">RST Slip #</th>
                <th className="py-4 px-6">Driver & Contact</th>
                <th className="py-4 px-6">Commodity Material</th>
                <th className="py-4 px-6">Weight Breakdown (Kg)</th>
                <th className="py-4 px-6">Dharam Kanta</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50/80 transition-colors group">
                  {/* TRUCK PLATE */}
                  <td className="py-4 px-6 font-mono font-bold">
                    <span className="px-3 py-1.5 bg-slate-900 text-amber-300 rounded-lg border border-amber-400/50 text-xs shadow-sm inline-block">
                      {w.truckNumber}
                    </span>
                    {w.isDiscrepancyFlagged && (
                      <span className="block mt-1 text-[10px] font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        ⚠️ CHORI FLAG
                      </span>
                    )}
                  </td>

                  {/* THUMBNAILS */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5">
                      {w.parchiPhotoUrl ? (
                        <img
                          src={w.parchiPhotoUrl}
                          alt="Parchi"
                          onClick={() => setSelectedSlip(w)}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 cursor-pointer hover:opacity-80 hover:scale-105 transition-all shadow-sm"
                          title="Click to view full Parchi Photo"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}
                      {w.truckPhotoUrl ? (
                        <img
                          src={w.truckPhotoUrl}
                          alt="Truck"
                          onClick={() => setSelectedSlip(w)}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 cursor-pointer hover:opacity-80 hover:scale-105 transition-all shadow-sm"
                          title="Click to view full Truck Photo"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                          <Camera className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </td>

                  {/* SLIP NUMBER & TYPE */}
                  <td className="py-4 px-6 font-mono text-xs">
                    <div className="font-bold text-slate-800">{w.slipNumber}</div>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      w.type === 'inward' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {w.type?.toUpperCase()}
                    </span>
                  </td>

                  {/* DRIVER */}
                  <td className="py-4 px-6 font-medium text-slate-800">
                    <div className="font-bold text-xs">{w.driverName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{w.driverPhone}</div>
                  </td>

                  {/* COMMODITY */}
                  <td className="py-4 px-6 font-semibold text-slate-700 text-xs">
                    {w.commodity}
                  </td>

                  {/* WEIGHTS */}
                  <td className="py-4 px-6 font-mono text-xs">
                    <div className="text-blue-600">Gross: {w.grossWeightKg?.toLocaleString()} kg</div>
                    <div className="text-amber-600">Tare: {w.tareWeightKg?.toLocaleString()} kg</div>
                    <div className="text-[#1B4326] font-extrabold text-sm mt-0.5">
                      Net: {(w.netWeightKg || (w.grossWeightKg - w.tareWeightKg))?.toLocaleString()} kg
                    </div>
                  </td>

                  {/* KANTA */}
                  <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                    {w.kantaName}
                  </td>

                  {/* ACTIONS */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedSlip(w)}
                        className="p-2 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors border border-emerald-200"
                        title="View Full Photos & Slip Receipt"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(w)}
                        className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
                        title="Edit Vehicle & Slip in MongoDB"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(w.id, w.slipNumber)}
                        className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors border border-red-200"
                        title="Delete Slip from MongoDB"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECTION & PARCHI PHOTO MODAL */}
      {selectedSlip && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 animate-scale-up my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-900 text-amber-300 font-black flex items-center justify-center text-base shadow-sm">
                  AG
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Vehicle Inspection & Digital Slip</h3>
                  <p className="text-xs text-slate-500">{selectedSlip.kantaName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSlip(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SIDE-BY-SIDE PHOTOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <div className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>Digital Parchi Receipt Photo</span>
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video relative group">
                  <img
                    src={selectedSlip.parchiPhotoUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'}
                    alt="Parchi Slip"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-1 rounded backdrop-blur">
                    OCR VERIFIED
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>Truck / Vehicle Camera Photo</span>
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video relative group">
                  <img
                    src={selectedSlip.truckPhotoUrl || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600'}
                    alt="Truck Photo"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 left-2 bg-black text-amber-300 text-xs font-mono font-bold px-2 py-1 rounded border border-amber-400/40">
                    {selectedSlip.truckNumber}
                  </div>
                </div>
              </div>
            </div>

            {/* METADATA BREAKDOWN */}
            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">RST Slip Serial #:</span>
                <span className="font-bold text-emerald-800">{selectedSlip.slipNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Vehicle Number:</span>
                <span className="font-bold text-black bg-amber-200 px-2 rounded">{selectedSlip.truckNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Driver & Contact:</span>
                <span className="font-bold text-slate-800">{selectedSlip.driverName} ({selectedSlip.driverPhone})</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Commodity:</span>
                <span className="font-bold text-slate-800">{selectedSlip.commodity}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Gross Weight:</span>
                <span className="font-bold text-blue-600">{selectedSlip.grossWeightKg?.toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Tare Weight:</span>
                <span className="font-bold text-amber-600">{selectedSlip.tareWeightKg?.toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-black text-[#1B4326]">
                <span>CALCULATED NET WEIGHT:</span>
                <span>{(selectedSlip.netWeightKg || (selectedSlip.grossWeightKg - selectedSlip.tareWeightKg))?.toLocaleString()} KG</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedSlip(null)}
                className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => alert(`Printing Official Receipt for ${selectedSlip.slipNumber}...`)}
                className="px-6 py-2.5 bg-gradient-to-r from-[#1B4326] to-emerald-800 text-white font-bold text-xs rounded-xl hover:from-emerald-900 hover:to-emerald-900 transition-all flex items-center gap-2 shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / ADD MODAL */}
      {(editingSlip || isAdding) && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-lg font-extrabold text-slate-900">
                {editingSlip ? `Edit Slip ${editingSlip.slipNumber} in MongoDB` : 'Create New Weighment Slip'}
              </h3>
              <button
                onClick={() => { setEditingSlip(null); setIsAdding(false); }}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Truck Plate Number</label>
                  <input
                    type="text"
                    value={formData.truckNumber}
                    onChange={(e) => setFormData({ ...formData, truckNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono font-bold focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Slip RST Number</label>
                  <input
                    type="text"
                    value={formData.slipNumber}
                    onChange={(e) => setFormData({ ...formData, slipNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Driver Name</label>
                  <input
                    type="text"
                    value={formData.driverName}
                    onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Driver Phone</label>
                  <input
                    type="text"
                    value={formData.driverPhone}
                    onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Commodity / Material</label>
                <input
                  type="text"
                  value={formData.commodity}
                  onChange={(e) => setFormData({ ...formData, commodity: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Gross Weight (Kg)</label>
                  <input
                    type="number"
                    value={formData.grossWeightKg}
                    onChange={(e) => setFormData({ ...formData, grossWeightKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tare Weight (Kg)</label>
                  <input
                    type="number"
                    value={formData.tareWeightKg}
                    onChange={(e) => setFormData({ ...formData, tareWeightKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 font-mono flex justify-between items-center text-emerald-900">
                <span className="font-bold">Calculated Net Weight:</span>
                <span className="text-sm font-black">
                  {(formData.grossWeightKg - formData.tareWeightKg).toLocaleString()} KG
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setEditingSlip(null); setIsAdding(false); }}
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
                  <span>{loading ? 'Saving to MongoDB...' : 'Save Record'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
