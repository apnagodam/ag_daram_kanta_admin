import React, { useState, useEffect } from 'react';
import { Inbox, CheckCircle, XCircle, Clock, AlertCircle, Building, ShieldCheck } from 'lucide-react';
import { fetchRequests } from '../services/api';

export default function RequestsManager() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests().then((data) => {
      setRequests(data);
      setLoading(false);
    });
  }, []);

  const handleApprove = (id) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED' } : r))
    );
  };

  const handleReject = (id) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'REJECTED' } : r))
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Requests & Approvals Inbox</h2>
        <p className="text-xs font-medium text-slate-500">
          Review Kanta registration requests, tare weight baseline overrides & scale calibration approvals
        </p>
      </div>

      {/* REQUESTS LIST */}
      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg border border-amber-200 flex-shrink-0">
                <Inbox className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-extrabold text-slate-400 font-mono">{req.id}</span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200">
                    {req.type}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{req.title}</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Dharam Kanta: <span className="font-bold text-slate-800">{req.kantaName}</span> • Applicant: <span className="font-bold text-slate-800">{req.applicant}</span> ({req.phone})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
              {req.status === 'PENDING' ? (
                <>
                  <button
                    onClick={() => handleReject(req.id)}
                    className="px-4 py-2 border border-red-200 text-red-700 hover:bg-red-50 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleApprove(req.id)}
                    className="px-5 py-2 bg-gradient-to-r from-[#1B4326] to-emerald-800 text-white font-bold text-xs rounded-xl hover:from-emerald-900 hover:to-emerald-900 transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <CheckCircle className="w-4 h-4 text-amber-300" />
                    <span>Approve Request</span>
                  </button>
                </>
              ) : (
                <span
                  className={`px-4 py-1.5 rounded-full font-bold text-xs border ${
                    req.status === 'APPROVED'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-red-50 text-red-800 border-red-300'
                  }`}
                >
                  ● {req.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
