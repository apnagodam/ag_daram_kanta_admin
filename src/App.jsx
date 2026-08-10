import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './components/Login';
import DashboardOverview from './components/DashboardOverview';
import KantaRegistry from './components/KantaRegistry';
import TruckRegistry from './components/TruckRegistry';
import WeighmentSlipsMaster from './components/WeighmentSlipsMaster';
import RequestsManager from './components/RequestsManager';
import VehicleReports from './components/VehicleReports';
import TheftRadarAudit from './components/TheftRadarAudit';
import OperatorManagement from './components/OperatorManagement';
import SystemSettings from './components/SystemSettings';
import UserProfile from './components/UserProfile';
import { fetchAnalytics, fetchWeighbridges, fetchWeighments } from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [kantas, setKantas] = useState([]);
  const [weighments, setWeighments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check saved session on app mount
  useEffect(() => {
    const savedUser = localStorage.getItem('ag_admin_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('ag_admin_user');
      }
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, kantasRes, weighmentsRes] = await Promise.all([
        fetchAnalytics(),
        fetchWeighbridges(),
        fetchWeighments('all', ''),
      ]);

      setStats(analyticsRes || {});
      setKantas(kantasRes || []);
      setWeighments(weighmentsRes || []);
    } catch (err) {
      console.error('Data load error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
      const timer = setInterval(loadData, 10000); // Live polling every 10s
      return () => clearInterval(timer);
    }
  }, [currentUser]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('ag_admin_token');
      localStorage.removeItem('ag_admin_user');
      setCurrentUser(null);
    }
  };

  // IF NOT AUTHENTICATED: SHOW LOGIN SCREEN
  if (!currentUser) {
    return <Login onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans antialiased text-slate-900">
      {/* SIDEBAR NAVIGATION */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={currentUser.role || 'ADMIN'} />

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          onRefresh={loadData}
          user={currentUser}
          onLogout={handleLogout}
          onNavigate={setActiveTab}
        />

        <main className="flex-1 overflow-y-auto">
          {loading && weighments.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-md border border-slate-200">
                <span className="w-5 h-5 rounded-full border-2 border-[#1B4326] border-t-transparent animate-spin" />
                <span className="text-xs font-bold text-[#1B4326]">Loading Live Dharam Kanta Systems...</span>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardOverview
                  stats={stats}
                  weighments={weighments}
                  onNavigate={setActiveTab}
                />
              )}
              {activeTab === 'kantas' && (
                <KantaRegistry kantas={kantas} onRefresh={loadData} />
              )}
              {activeTab === 'trucks' && (
                <TruckRegistry weighments={weighments} kantas={kantas} />
              )}
              {activeTab === 'slips' && (
                <WeighmentSlipsMaster weighments={weighments} onRefresh={loadData} />
              )}
              {activeTab === 'requests' && (
                <RequestsManager />
              )}
              {activeTab === 'reports' && (
                <VehicleReports weighments={weighments} kantas={kantas} />
              )}
              {activeTab === 'theft-radar' && (
                <TheftRadarAudit weighments={weighments} onRefresh={loadData} />
              )}
              {activeTab === 'operators' && (
                <OperatorManagement />
              )}
              {activeTab === 'settings' && (
                <SystemSettings />
              )}
              {activeTab === 'profile' && (
                <UserProfile user={currentUser} onUpdateUser={(u) => setCurrentUser(u)} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
