import React, { useState } from 'react';
import { Truck, Search, Filter, Calendar, FileText, AlertTriangle, Eye, ArrowUpRight } from 'lucide-react';

export default function TruckRegistry({ weighments, kantas }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKanta, setSelectedKanta] = useState('ALL');
  const [selectedTruck, setSelectedTruck] = useState(null);

  // Group weighments by truck number
  const trucksMap = {};
  weighments.forEach((w) => {
    const truckNo = w.truckNumber || 'UNKNOWN';
    if (!trucksMap[truckNo]) {
      trucksMap[truckNo] = {
        truckNumber: truckNo,
        driverName: w.driverName || 'Driver',
        driverPhone: w.driverPhone || 'N/A',
        totalTrips: 0,
        lastCommodity: w.commodity,
        lastKanta: w.kantaName,
        lastTimestamp: w.timestamp,
        hasFlag: false,
        records: [],
      };
    }
    trucksMap[truckNo].totalTrips += 1;
    trucksMap[truckNo].records.push(w);
    if (w.isDiscrepancyFlagged) trucksMap[truckNo].hasFlag = true;
  });

  const truckList = Object.values(trucksMap).filter((t) => {
    if (selectedKanta !== 'ALL' && t.lastKanta !== selectedKanta) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.truckNumber.toLowerCase().includes(q) ||
        t.driverName.toLowerCase().includes(q) ||
        t.driverPhone.toLowerCase().includes(q) ||
        (t.lastCommodity || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Truck & Vehicle Directory</h2>
          <p className="text-xs font-medium text-slate-500">
            Comprehensive history of all vehicles weighed across all Dharam Kantas
          </p>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter Truck #, Driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-sm"
            />
          </div>

          <select
            value={selectedKanta}
            onChange={(e) => setSelectedKanta(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="ALL">All Dharam Kantas</option>
            {kantas.map((k) => (
              <option key={k.id} value={k.kantaName}>{k.kantaName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TRUCKS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {truckList.map((truck) => (
          <div
            key={truck.truckNumber}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="px-3 py-1.5 bg-slate-900 text-amber-300 rounded-xl border border-amber-400/50 font-mono font-bold text-xs shadow-sm">
                  {truck.truckNumber}
                </span>
                {truck.hasFlag ? (
                  <span className="px-2.5 py-1 bg-red-100 text-red-800 font-extrabold text-[10px] rounded-full border border-red-300 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-600" />
                    <span>FLAGGED</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold text-[10px] rounded-full border border-emerald-300">
                    CLEAR
                  </span>
                )}
              </div>

              <div className="space-y-1 mb-4">
                <h3 className="text-sm font-extrabold text-slate-900">{truck.driverName}</h3>
                <p className="text-xs text-slate-500 font-mono">📞 {truck.driverPhone}</p>
              </div>

              <div className="space-y-2 py-3 border-t border-b border-slate-100 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Total Trips Recorded:</span>
                  <span className="font-bold text-emerald-800">{truck.totalTrips} Trip(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Last Commodity:</span>
                  <span className="font-bold text-slate-800">{truck.lastCommodity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Last Kanta Visited:</span>
                  <span className="font-semibold text-slate-700">{truck.lastKanta}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedTruck(truck)}
              className="mt-4 w-full py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>View Full Trip History</span>
            </button>
          </div>
        ))}
      </div>

      {/* TRUCK HISTORY MODAL */}
      {selectedTruck && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Vehicle Trip History</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedTruck.truckNumber} • Driver: {selectedTruck.driverName}</p>
              </div>
              <button onClick={() => setSelectedTruck(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {selectedTruck.records.map((r) => (
                <div key={r.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs font-mono">
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{r.slipNumber} • {r.commodity}</div>
                    <div className="text-slate-500 text-[11px] font-sans">{r.kantaName}</div>
                    <div className="text-slate-400 text-[10px]">{new Date(r.timestamp).toLocaleString()}</div>
                  </div>
                  <div className="text-right font-bold">
                    <div className="text-blue-600">Gross: {r.grossWeightKg} kg</div>
                    <div className="text-amber-600">Tare: {r.tareWeightKg} kg</div>
                    <div className="text-emerald-800 font-extrabold">Net: {r.netWeightKg} kg</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedTruck(null)} className="px-5 py-2 border rounded-xl font-bold text-slate-600">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
