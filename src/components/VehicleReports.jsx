import React, { useState } from 'react';
import { BarChart3, Download, Printer, Filter, Calendar, Scale, Truck, FileText } from 'lucide-react';

export default function VehicleReports({ weighments, kantas }) {
  const [selectedKanta, setSelectedKanta] = useState('ALL');
  const [selectedCommodity, setSelectedCommodity] = useState('ALL');
  const [selectedDateFilter, setSelectedDateFilter] = useState('ALL');

  // Filtered dataset
  const filtered = weighments.filter((w) => {
    if (selectedKanta !== 'ALL' && w.kantaName !== selectedKanta) return false;
    if (selectedCommodity !== 'ALL' && w.commodity !== selectedCommodity) return false;
    return true;
  });

  // Aggregations
  let totalGrossKg = 0;
  let totalTareKg = 0;
  let totalNetKg = 0;

  filtered.forEach((w) => {
    totalGrossKg += Number(w.grossWeightKg || 0);
    totalTareKg += Number(w.tareWeightKg || 0);
    totalNetKg += Number(w.netWeightKg || (w.grossWeightKg - w.tareWeightKg) || 0);
  });

  const totalNetTons = (totalNetKg / 1000).toFixed(2);

  // Extract unique commodities
  const commodities = Array.from(new Set(weighments.map((w) => w.commodity).filter(Boolean)));

  const exportCSV = () => {
    const headers = ['Slip Number', 'Truck Number', 'Type', 'Driver', 'Phone', 'Commodity', 'Gross Weight (Kg)', 'Tare Weight (Kg)', 'Net Weight (Kg)', 'Dharam Kanta', 'Timestamp'];
    const rows = filtered.map(w => [
      w.slipNumber,
      w.truckNumber,
      w.type,
      w.driverName,
      w.driverPhone,
      w.commodity,
      w.grossWeightKg,
      w.tareWeightKg,
      w.netWeightKg || (w.grossWeightKg - w.tareWeightKg),
      `"${w.kantaName}"`,
      new Date(w.timestamp).toLocaleString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Vehicle_Weighment_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Vehicle Reports & Tonnage Analytics</h2>
          <p className="text-xs font-medium text-slate-500">
            Generate, filter & export detailed tonnage summary reports across all Dharam Kantas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          <button
            onClick={exportCSV}
            className="px-5 py-2 bg-gradient-to-r from-[#1B4326] to-emerald-800 text-white font-bold text-xs rounded-xl hover:from-emerald-900 hover:to-emerald-900 transition-all flex items-center gap-1.5 shadow-md"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR ON REPORT PAGE */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-700" />
          <span>Filter Report:</span>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block uppercase">Dharam Kanta</label>
          <select
            value={selectedKanta}
            onChange={(e) => setSelectedKanta(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="ALL">All Weighbridges</option>
            {kantas.map((k) => (
              <option key={k.id} value={k.kantaName}>{k.kantaName}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block uppercase">Commodity Material</label>
          <select
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="ALL">All Commodities</option>
            {commodities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block uppercase">Time Range</label>
          <select
            value={selectedDateFilter}
            onChange={(e) => setSelectedDateFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="ALL">All Time</option>
            <option value="TODAY">Today</option>
            <option value="THIS_WEEK">This Week</option>
          </select>
        </div>
      </div>

      {/* SUMMARY KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase">Vehicles Weighed</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{filtered.length} Trucks</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-blue-600 uppercase">Total Gross Weight</div>
          <div className="text-2xl font-black text-blue-700 mt-1">{(totalGrossKg / 1000).toFixed(1)} Tons</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-amber-600 uppercase">Total Tare Weight</div>
          <div className="text-2xl font-black text-amber-700 mt-1">{(totalTareKg / 1000).toFixed(1)} Tons</div>
        </div>

        <div className="bg-emerald-900 text-white p-5 rounded-2xl border border-emerald-950 shadow-md">
          <div className="text-xs font-extrabold text-amber-400 uppercase">NET TONNAGE DISPATCHED</div>
          <div className="text-3xl font-black mt-1 text-white">{totalNetTons} TONS</div>
        </div>
      </div>

      {/* DETAILED REPORT TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">RST Slip</th>
                <th className="py-4 px-6">Vehicle Plate</th>
                <th className="py-4 px-6">Driver & Phone</th>
                <th className="py-4 px-6">Commodity</th>
                <th className="py-4 px-6">Gross (Kg)</th>
                <th className="py-4 px-6">Tare (Kg)</th>
                <th className="py-4 px-6">Net (Kg)</th>
                <th className="py-4 px-6">Dharam Kanta</th>
                <th className="py-4 px-6">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-mono">
              {filtered.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-6 font-bold text-emerald-800">{w.slipNumber}</td>
                  <td className="py-3 px-6 font-bold text-slate-900">{w.truckNumber}</td>
                  <td className="py-3 px-6 font-sans font-medium text-slate-700">{w.driverName} ({w.driverPhone})</td>
                  <td className="py-3 px-6 font-sans font-semibold text-slate-800">{w.commodity}</td>
                  <td className="py-3 px-6 text-blue-600 font-bold">{w.grossWeightKg?.toLocaleString()}</td>
                  <td className="py-3 px-6 text-amber-600 font-bold">{w.tareWeightKg?.toLocaleString()}</td>
                  <td className="py-3 px-6 text-[#1B4326] font-black text-sm">
                    {(w.netWeightKg || (w.grossWeightKg - w.tareWeightKg))?.toLocaleString()} KG
                  </td>
                  <td className="py-3 px-6 font-sans text-slate-600">{w.kantaName}</td>
                  <td className="py-3 px-6 text-slate-400">{new Date(w.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
