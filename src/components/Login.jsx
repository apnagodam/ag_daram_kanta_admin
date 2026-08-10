import React, { useState } from 'react';
import { Lock, Phone, User, ShieldCheck, Scale, AlertCircle, ArrowRight } from 'lucide-react';
import { loginUser } from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [phone, setPhone] = useState('9812345678');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!phone) {
      setError('Please enter your mobile number or admin ID');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ phone, password });
      if (res.success && res.user) {
        localStorage.setItem('ag_admin_token', res.token || 'mock_token');
        localStorage.setItem('ag_admin_user', JSON.stringify(res.user));
        onLoginSuccess(res.user);
      } else {
        setError(res.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Failed to connect to authentication backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (rolePhone, rolePassword) => {
    setPhone(rolePhone);
    setPassword(rolePassword);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-4">
      {/* BACKGROUND DECORATION */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
        {/* BRAND LOGO HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1B4326] to-emerald-600 shadow-lg shadow-emerald-900/30 text-white mb-4">
            <Scale className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            APNA GODAM <span className="text-emerald-700 font-extrabold">ADMIN</span>
          </h1>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
            AG-Daram Kanta MongoDB Cloud System
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm font-medium animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Mobile Number / Admin ID
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10-digit phone or admin"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
              <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-600" />
              Remember Session
            </label>
            <a href="#help" onClick={(e) => { e.preventDefault(); setError('Contact system administrator for password reset.'); }} className="text-emerald-700 hover:text-emerald-800 font-bold">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#1B4326] to-emerald-700 hover:from-emerald-900 hover:to-emerald-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authenticating Admin...</span>
              </>
            ) : (
              <>
                <span>Secure Admin Login</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* DEMO ACCELERATOR BUTTONS */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Quick Fill Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('9812345678', 'admin123')}
              className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-emerald-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Super Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('9829010083', 'user123')}
              className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-slate-600" />
              <span>Operator</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
