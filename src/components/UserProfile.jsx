import React, { useState } from 'react';
import { User, Shield, Phone, Mail, Lock, Key, CheckCircle, Save, Smartphone, ShieldCheck, Clock } from 'lucide-react';

export default function UserProfile({ user, onUpdateUser }) {
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Admin Master',
    phone: user?.phone || '9812345678',
    email: user?.email || 'admin@apnagodam.com',
    role: user?.role || 'ADMIN',
    currentPassword: '••••••••',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...user,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
    };
    localStorage.setItem('ag_admin_user', JSON.stringify(updated));
    if (onUpdateUser) onUpdateUser(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin Profile & Security</h2>
        <p className="text-xs font-medium text-slate-500">
          Manage your executive credentials, contact details, and security access permissions
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs rounded-2xl animate-fade-in flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>Admin Profile updated successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AVATAR & QUICK STATS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#1B4326] to-emerald-700 text-amber-300 font-black text-4xl flex items-center justify-center shadow-xl shadow-emerald-900/20 mb-4">
            {formData.name ? formData.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <h3 className="text-lg font-black text-slate-900">{formData.name}</h3>
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mt-0.5 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 inline text-emerald-600" />
            <span>{formData.role}</span>
          </p>
          <p className="text-xs text-slate-500 font-mono mt-2">{formData.email}</p>

          <div className="w-full border-t border-slate-100 mt-6 pt-4 space-y-3 text-xs font-mono text-left">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Mobile Phone:</span>
              <span className="font-bold text-slate-800">{formData.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Access Permission:</span>
              <span className="font-bold text-emerald-800">Super Administrator</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Database Access:</span>
              <span className="font-bold text-slate-800">MongoDB Atlas Live</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Active Session:</span>
              <span className="font-bold text-emerald-600">Authenticated</span>
            </div>
          </div>
        </div>

        {/* EDIT PROFILE & PASSWORD FORM */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6 text-xs font-medium">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-700" />
                <span>Personal & Contact Information</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mobile Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl font-mono focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-700" />
                <span>Security & Password Credentials</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-[#1B4326] hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
