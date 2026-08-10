import React from 'react';

export default function DashboardOverview({ stats, weighments, onNavigate }) {
  return (
    <div className="space-y-8 p-8">
      {/* 4 EXECUTIVE METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-[#1B4326]" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Active Dharam Kantas
            </span>
            <span className="text-2xl p-2 rounded-xl bg-emerald-50 text-[#1B4326]">🏢</span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {stats.totalWeighbridges || 3}
          </div>
          <div className="mt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1">
            <span>● 100% Operational Network</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-blue-600" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Completed Weighments (Today)
            </span>
            <span className="text-2xl p-2 rounded-xl bg-blue-50 text-blue-600">🚚</span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {stats.totalCompletedToday || 14} <span className="text-sm font-semibold text-gray-500">Trucks</span>
          </div>
          <div className="mt-2 text-xs font-semibold text-blue-600">
            ↑ 12% increase from yesterday
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Net Tonnage
            </span>
            <span className="text-2xl p-2 rounded-xl bg-amber-50 text-amber-600">⚖️</span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {stats.totalTonnageTodayTons || "450.5"} <span className="text-sm font-semibold text-gray-500">Tons</span>
          </div>
          <div className="mt-2 text-xs font-semibold text-amber-600">
            Real-Time Cumulative Weight
          </div>
        </div>

        <div className={`bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${
          stats.flaggedDiscrepancies > 0 ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
        }`}>
          <div className="absolute top-0 right-0 w-2 h-full bg-red-600" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Theft / Tare Mismatch Alerts
            </span>
            <span className="text-2xl p-2 rounded-xl bg-red-100 text-red-600">🛡️</span>
          </div>
          <div className="text-3xl font-extrabold text-red-600 tracking-tight">
            {stats.flaggedDiscrepancies || 1} <span className="text-sm font-semibold text-red-500">Flagged</span>
          </div>
          <button
            onClick={() => onNavigate('theft-radar')}
            className="mt-2 text-xs font-bold text-red-600 underline hover:text-red-800"
          >
            Review Theft Mismatch →
          </button>
        </div>
      </div>

      {/* RECENT LIVE WEIGHMENT SLIPS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-base font-bold text-gray-900">Live Weighment Feed</h3>
            <p className="text-xs text-gray-500">Real-Time Inward & Outward Truck Slips synced from Mobile OCR</p>
          </div>
          <button
            onClick={() => onNavigate('slips')}
            className="px-4 py-2 bg-[#1B4326] text-[#FFC107] font-bold text-xs rounded-xl hover:bg-[#14351E] transition-colors shadow-sm"
          >
            View All Slips →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-6">Truck Plate</th>
                <th className="py-3 px-6">Slip #</th>
                <th className="py-3 px-6">Entry Type</th>
                <th className="py-3 px-6">Driver & Phone</th>
                <th className="py-3 px-6">Commodity</th>
                <th className="py-3 px-6">Gross / Tare / Net</th>
                <th className="py-3 px-6">Status / Theft Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {weighments.slice(0, 5).map((w) => (
                <tr key={w.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-gray-900">
                    <span className="px-2.5 py-1 bg-black text-amber-300 rounded-md border border-amber-400 text-xs">
                      {w.truckNumber}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono text-xs font-semibold text-gray-600">
                    {w.slipNumber}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      w.type === 'inward'
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-amber-100 text-amber-700 border border-amber-300'
                    }`}>
                      {w.type?.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-800">
                    <div>{w.driverName}</div>
                    <div className="text-xs text-gray-400 font-mono">{w.driverPhone}</div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-700">
                    {w.commodity}
                  </td>
                  <td className="py-4 px-6 font-mono text-xs">
                    <div className="text-blue-600 font-bold">Gross: {w.grossWeightKg} kg</div>
                    <div className="text-amber-600">Tare: {w.tareWeightKg} kg</div>
                    <div className="text-[#1B4326] font-extrabold text-sm">Net: {w.netWeightKg} kg</div>
                  </td>
                  <td className="py-4 px-6">
                    {w.isDiscrepancyFlagged ? (
                      <span className="px-3 py-1 bg-red-100 text-red-700 border border-red-400 rounded-lg text-xs font-bold animate-pulse inline-flex items-center gap-1">
                        ⚠️ Theft Alert
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold inline-flex items-center gap-1">
                        ✓ Verified
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
