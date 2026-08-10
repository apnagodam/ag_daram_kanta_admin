import React, { useState } from 'react';
import { Settings, Save, Shield, Database, Bell, Sliders } from 'lucide-react';

export default function SystemSettings() {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    maxTareVarianceKg: 1500,
    minWeighingCapacityKg: 500,
    ocrConfidenceThreshold: 85,
    enableAutoChoriAlerts: true,
    mongoDbUri: 'mongodb+srv://kanta_admin:***@cluster0.humxj.mongodb.net/ag_daram_kanta',
    alertPhoneNotification: '9812345678',
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Kanta & System Threshold Settings</h2>
        <p className="text-xs font-medium text-slate-500">
          Configure anti-theft variance tolerances, OCR scan confidence & MongoDB sync parameters
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs rounded-2xl animate-fade-in">
          ✅ System threshold settings updated and synced to MongoDB successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-medium">
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-700" />
              <span>Anti-Theft Variance Settings</span>
            </h3>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Max Allowed Tare Weight Variance (Kg)
              </label>
              <input
                type="number"
                value={config.maxTareVarianceKg}
                onChange={(e) => setConfig({ ...config, maxTareVarianceKg: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 border rounded-xl font-mono focus:ring-2 focus:ring-emerald-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">If tare weight differs by more than this limit from baseline, Chori Alert is flagged.</p>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                OCR Photo Scan Confidence Threshold (%)
              </label>
              <input
                type="number"
                value={config.ocrConfidenceThreshold}
                onChange={(e) => setConfig({ ...config, ocrConfidenceThreshold: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 border rounded-xl font-mono focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="autoChori"
                checked={config.enableAutoChoriAlerts}
                onChange={(e) => setConfig({ ...config, enableAutoChoriAlerts: e.target.checked })}
                className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
              />
              <label htmlFor="autoChori" className="font-bold text-slate-800 cursor-pointer">
                Enable Automatic SMS & Push Alerts on Discrepancy
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-700" />
              <span>Database & Notification Webhooks</span>
            </h3>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Active MongoDB Atlas Cluster URI
              </label>
              <input
                type="text"
                readOnly
                value={config.mongoDbUri}
                className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-mono text-slate-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Supervisor Emergency Mobile Alert Number
              </label>
              <input
                type="text"
                value={config.alertPhoneNotification}
                onChange={(e) => setConfig({ ...config, alertPhoneNotification: e.target.value })}
                className="w-full px-3.5 py-2.5 border rounded-xl font-mono focus:ring-2 focus:ring-emerald-600"
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
            <span>Save System Thresholds</span>
          </button>
        </div>
      </form>
    </div>
  );
}
