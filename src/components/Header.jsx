import React from 'react';
import { LogOut, RefreshCw, Shield, Database } from 'lucide-react';

export default function Header({ activeTab, onRefresh, user, onLogout }) {
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { main: 'System Overview & Analytics', sub: 'Live Real-Time Monitoring of All Dharam Kantas' };
      case 'kantas':
        return { main: 'Dharam Kanta Master Registry', sub: 'Manage, Calibrate & Register All Weighbridges' };
      case 'trucks':
        return { main: 'Truck & Vehicle Directory', sub: 'Complete History & Weighment Logs per Vehicle Plate' };
      case 'slips':
        return { main: 'Weighment Slips Master & Vehicles', sub: 'All Vehicle Data, RST Slips, Photo Verification & Receipt Printing' };
      case 'requests':
        return { main: 'Requests & Approvals Inbox', sub: 'Onboarding Requests, Tare Baseline Approvals & Recalibrations' };
      case 'reports':
        return { main: 'Vehicle Reports & Tonnage Analytics', sub: 'Filter, Aggregate & Export Net Tonnage Reports to CSV' };
      case 'theft-radar':
        return { main: 'Anti-Theft Radar & Discrepancy Audits', sub: 'Tare Weight Discrepancies & Supervisor Anti-Theft Clearances' };
      case 'operators':
        return { main: 'Operator & Staff Management', sub: 'Manage Kanta Operators, System Roles & Access Status' };
      case 'settings':
        return { main: 'Kanta & System Threshold Settings', sub: 'Configure Variance Tolerances, OCR Confidence & MongoDB Sync' };
      default:
        return { main: 'Apna Godam Admin', sub: 'AG-Daram Kanta Portal' };
    }
  };

  const { main, sub } = getTitle();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">{main}</h1>
        <p className="text-xs font-semibold text-slate-500">{sub}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* LIVE MONGO BADGE */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Database className="w-3.5 h-3.5" />
          <span>MongoDB Atlas Connected</span>
        </div>

        {/* REFRESH BUTTON */}
        <button
          onClick={onRefresh}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors border border-slate-200"
          title="Sync Latest Data"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Refresh Data</span>
        </button>

        {/* LOGGED IN USER PROFILE */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-emerald-900 text-white flex items-center justify-center font-black text-sm shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-black text-slate-900 leading-tight">
              {user?.name || 'Super Admin'}
            </div>
            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3 h-3 inline" />
              <span>{user?.role || 'ADMIN'}</span>
            </div>
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={onLogout}
          className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-red-200 ml-1"
          title="Logout Admin Session"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
