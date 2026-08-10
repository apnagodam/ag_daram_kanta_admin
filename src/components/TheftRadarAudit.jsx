import React, { useState } from 'react';
import { overrideDiscrepancy } from '../services/api';

export default function TheftRadarAudit({ weighments, onRefresh }) {
  const [selectedAudit, setSelectedAudit] = useState(null);

  const flaggedList = weighments.filter((w) => w.isDiscrepancyFlagged);

  const handleApproveOverride = async (recordId) => {
    await overrideDiscrepancy(recordId);
    setSelectedAudit(null);
    onRefresh();
  };

  return (
    <div className="p-8 space-y-6">
      <div className="bg-red-900 text-white rounded-2xl p-6 shadow-xl border border-red-700 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-800 text-[#FFC107] font-bold text-xs rounded-full border border-red-600">
            <span className="w-2 h-2 rounded-full bg-[#FFC107] animate-ping" />
            Apna Godam Anti-Theft Protocol
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Theft Radar & Discrepancy Audits</h2>
          <p className="text-xs text-red-200">
            Automated cross-checking flags suspicious tare weight variations to prevent grain theft.
          </p>
        </div>

        <div className="bg-red-950 px-6 py-4 rounded-xl border border-red-800 text-center">
          <div className="text-2xl font-black text-[#FFC107]">{flaggedList.length}</div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-red-300">Flagged Audits Pending</div>
        </div>
      </div>

      {/* FLAGGED AUDIT CARDS */}
      {flaggedList.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center space-y-3">
          <span className="text-4xl">🛡️</span>
          <h3 className="text-lg font-bold text-gray-900">Zero Theft Mismatches Detected</h3>
          <p className="text-xs text-gray-500">All weighments comply with tare baseline metrics.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {flaggedList.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border-2 border-red-500 p-6 shadow-md relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-black text-amber-300 rounded font-mono font-bold text-xs">
                    {item.truckNumber}
                  </span>
                  <span className="text-xs font-bold text-gray-500 font-mono">#{item.slipNumber}</span>
                </div>
                <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-300">
                  CHORI ALERT
                </span>
              </div>

              <div className="bg-red-50 p-3.5 rounded-xl border border-red-200 text-xs text-red-800 font-medium">
                ⚠️ {item.discrepancyDetails || 'Tare weight varies significantly from expected baseline.'}
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center">
                <div className="bg-gray-50 p-2 rounded-lg border">
                  <div className="text-[10px] text-gray-500">Gross</div>
                  <div className="font-bold text-blue-600">{item.grossWeightKg} kg</div>
                </div>
                <div className="bg-red-50 p-2 rounded-lg border border-red-200">
                  <div className="text-[10px] text-red-500">Flagged Tare</div>
                  <div className="font-bold text-red-600">{item.tareWeightKg} kg</div>
                </div>
                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  <div className="text-[10px] text-emerald-600">Net Weight</div>
                  <div className="font-bold text-[#1B4326]">{item.netWeightKg} kg</div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t text-xs">
                <span className="text-gray-500 font-medium">{item.kantaName}</span>
                <button
                  onClick={() => setSelectedAudit(item)}
                  className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-sm"
                >
                  Review Photos & Approve Override →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* OVERRIDE MODAL */}
      {selectedAudit && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
                <span>🛡️</span> Supervisor Anti-Theft Review ({selectedAudit.truckNumber})
              </h3>
              <button onClick={() => setSelectedAudit(null)} className="text-gray-400 font-bold text-lg">✕</button>
            </div>

            <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-xs text-red-900 space-y-1">
              <div className="font-bold">DISCREPANCY INVESTIGATION:</div>
              <div>{selectedAudit.discrepancyDetails}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-xl p-3 bg-gray-50 text-center space-y-2">
                <div className="text-xs font-bold text-gray-700">Live Truck Photo (Stamp Verified)</div>
                <img
                  src={selectedAudit.truckPhotoUrl || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600'}
                  alt="Truck"
                  className="w-full h-40 object-cover rounded-lg border"
                />
              </div>
              <div className="border rounded-xl p-3 bg-gray-50 text-center space-y-2">
                <div className="text-xs font-bold text-gray-700">Live Kanta Parchi Photo</div>
                <img
                  src={selectedAudit.parchiPhotoUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'}
                  alt="Parchi"
                  className="w-full h-40 object-cover rounded-lg border"
                />
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setSelectedAudit(null)}
                className="px-4 py-2 border rounded-xl text-gray-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApproveOverride(selectedAudit.id)}
                className="px-5 py-2 bg-[#1B4326] text-[#FFC107] font-bold rounded-xl hover:bg-[#14351E] shadow-md"
              >
                ✓ Supervisor Clear Discrepancy & Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
