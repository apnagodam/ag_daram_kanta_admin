import React from 'react';
import {
  LayoutDashboard,
  Building,
  Truck,
  FileText,
  Inbox,
  BarChart3,
  ShieldAlert,
  Users,
  Settings,
  UserCheck,
  Scale
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, userRole = 'ADMIN' }) {
  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, roles: ['ADMIN', 'SUPERVISOR', 'OPERATOR'] },
    { id: 'kantas', label: 'Dharam Kanta Registry', icon: Building, roles: ['ADMIN', 'SUPERVISOR', 'OPERATOR'] },
    { id: 'trucks', label: 'Truck & Vehicle Directory', icon: Truck, roles: ['ADMIN', 'SUPERVISOR', 'OPERATOR'] },
    { id: 'slips', label: 'Weighment Slips Master', icon: FileText, roles: ['ADMIN', 'SUPERVISOR', 'OPERATOR'] },
    { id: 'requests', label: 'Requests & Approvals', icon: Inbox, badge: '2', roles: ['ADMIN', 'SUPERVISOR'] },
    { id: 'reports', label: 'Vehicle Reports & Tonnage', icon: BarChart3, roles: ['ADMIN', 'SUPERVISOR'] },
    { id: 'theft-radar', label: 'Anti-Theft Radar & Audits', icon: ShieldAlert, alertBadge: '1', roles: ['ADMIN', 'SUPERVISOR'] },
    { id: 'operators', label: 'Operator Management', icon: Users, roles: ['ADMIN', 'SUPERVISOR'] },
    { id: 'settings', label: 'Kanta & System Settings', icon: Settings, roles: ['ADMIN'] },
    { id: 'profile', label: 'My Profile & Security', icon: UserCheck, roles: ['ADMIN', 'SUPERVISOR', 'OPERATOR'] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-72 bg-[#0F2817] text-white flex flex-col min-h-screen border-r border-[#1B4326] shadow-xl flex-shrink-0">
      {/* LOGO */}
      <div className="p-6 border-b border-[#1B4326] flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-400/20">
          <Scale className="w-6 h-6 text-slate-900" />
        </div>
        <div>
          <h1 className="text-base font-black tracking-tight text-white leading-tight">
            APNA GODAM
          </h1>
          <p className="text-[11px] font-extrabold text-amber-400 tracking-wider uppercase">
            AG. धर्म कांटा {userRole === 'OPERATOR' ? 'OPERATOR' : 'ADMIN'}
          </p>
        </div>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-extrabold text-emerald-400/60 uppercase tracking-widest px-3 py-2">
          {userRole === 'OPERATOR' ? 'Operator Workspace' : 'Main Navigation'}
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#1B4326] to-emerald-800 text-white shadow-md border border-emerald-500/30'
                  : 'text-emerald-100/70 hover:bg-[#153820] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-emerald-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.alertBadge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white animate-pulse">
                  {item.alertBadge} Alert
                </span>
              )}
              {item.badge && !item.alertBadge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-[#1B4326] bg-[#0A1F12] text-[11px] font-medium text-emerald-300/70">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white">MongoDB Atlas Connected</span>
        </div>
        <div className="text-[10px] text-emerald-400/60">Apna Godam Centralized Kanta System v3.0</div>
      </div>
    </aside>
  );
}
