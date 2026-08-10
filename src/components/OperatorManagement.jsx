import React, { useState, useEffect } from 'react';
import { User, Plus, Edit3, Trash2, Shield, Phone, Mail, CheckCircle2, XCircle, Search, Filter, Key, Lock, Save, RefreshCw } from 'lucide-react';
import { fetchOperators, createOperator, updateOperator, deleteOperator, fetchWeighbridges } from '../services/api';

export default function OperatorManagement() {
  const [operators, setOperators] = useState([]);
  const [kantas, setKantas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(null);
  const [newPass, setNewPass] = useState('123456');
  const [editingOp, setEditingOp] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'OPERATOR',
    status: 'ACTIVE',
    weighbridgeId: 'WB-101',
    password: '123456',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [opRes, wbRes] = await Promise.all([
        fetchOperators(),
        fetchWeighbridges(),
      ]);
      setOperators(opRes || []);
      setKantas(wbRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = operators.filter((op) => {
    if (roleFilter !== 'ALL' && op.role !== roleFilter) return false;
    if (statusFilter !== 'ALL' && op.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const n = (op.name || '').toLowerCase();
      const p = (op.phone || '').toLowerCase();
      const e = (op.email || '').toLowerCase();
      const id = (op.id || '').toLowerCase();
      return n.includes(q) || p.includes(q) || e.includes(q) || id.includes(q);
    }
    return true;
  });

  const activeCount = operators.filter(o => o.status === 'ACTIVE').length;
  const operatorCount = operators.filter(o => o.role === 'OPERATOR').length;
  const adminCount = operators.filter(o => o.role === 'ADMIN' || o.role === 'SUPERVISOR').length;

  const handleOpenAdd = () => {
    setEditingOp(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      role: 'OPERATOR',
      status: 'ACTIVE',
      weighbridgeId: kantas[0]?.id || 'WB-101',
      password: '123456',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (op) => {
    setEditingOp(op);
    setFormData({
      name: op.name || '',
      phone: op.phone || '',
      email: op.email || '',
      role: op.role || 'OPERATOR',
      status: op.status || 'ACTIVE',
      weighbridgeId: op.weighbridgeId || 'WB-101',
      password: op.password || '123456',
    });
    setShowModal(true);
  };

  const handleToggleStatus = async (op) => {
    const nextStatus = op.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateOperator(op.id, { ...op, status: nextStatus });
      loadData();
    } catch (err) {
      alert('Status update failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingOp) {
        await updateOperator(editingOp.id, formData);
      } else {
        await createOperator(formData);
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      alert('Save failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!showPasswordModal) return;
    try {
      await updateOperator(showPasswordModal.id, { password: newPass });
      alert(`Password for ${showPasswordModal.name} reset successfully to "${newPass}"`);
      setShowPasswordModal(null);
      loadData();
    } catch (err) {
      alert('Password reset failed');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete operator ${name} from MongoDB?`)) {
      setLoading(true);
      try {
        await deleteOperator(id);
        loadData();
      } catch (err) {
        alert('Delete failed: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Operator & Staff Management</h2>
          <p className="text-xs font-medium text-slate-500">Manage Kanta operators, supervisors, security PINs & MongoDB access roles</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-gradient-to-r from-[#1B4326] to-emerald-700 text-white font-bold text-xs rounded-xl hover:from-emerald-900 hover:to-emerald-800 shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Add New Operator</span>
        </button>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Total System Staff</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{operators.length} Registered</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg">
            👥
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-600 uppercase">Active Kanta Operators</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">{operatorCount} Operators</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-purple-600 uppercase">Supervisors & Admins</div>
            <div className="text-2xl font-black text-purple-800 mt-1">{adminCount} Admins</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-lg">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Name, Phone, ID, Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-3 text-xs font-bold w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Super Admin</option>
              <option value="SUPERVISOR">Supervisor</option>
              <option value="OPERATOR">Kanta Operator</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </div>
      </div>

      {/* OPERATORS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[350px]">
        {loading && operators.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-emerald-900">Loading MongoDB Operators...</span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Operator Staff</th>
                  <th className="py-4 px-6">Staff ID</th>
                  <th className="py-4 px-6">Mobile Contact</th>
                  <th className="py-4 px-6">Assigned Dharam Kanta</th>
                  <th className="py-4 px-6">System Role</th>
                  <th className="py-4 px-6">Account Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((op) => {
                  const assignedWb = kantas.find(k => k.id === op.weighbridgeId)?.kantaName || op.weighbridgeId || 'Ajmer Dharam Kanta';
                  return (
                    <tr key={op.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1B4326] to-emerald-800 text-amber-300 flex items-center justify-center font-black text-xs shadow-sm">
                          {op.name ? op.name.charAt(0).toUpperCase() : 'O'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{op.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{op.email || `${op.phone}@apnagodam.com`}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-emerald-800 font-bold">{op.id}</td>
                      <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-700">{op.phone}</td>
                      <td className="py-4 px-6 text-xs text-slate-700 font-medium">{assignedWb}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                          op.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800 border border-purple-300'
                            : op.role === 'SUPERVISOR'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-slate-100 text-slate-800 border border-slate-300'
                        }`}>
                          {op.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleStatus(op)}
                          className={`px-3 py-1 text-xs font-bold rounded-full border transition-all flex items-center gap-1 ${
                            op.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-800 border-red-300 hover:bg-red-100'
                          }`}
                          title="Click to toggle status"
                        >
                          <span className={`w-2 h-2 rounded-full ${op.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          <span>{op.status || 'ACTIVE'}</span>
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setShowPasswordModal(op)}
                            className="p-2 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors border border-amber-200"
                            title="Reset Security Password / PIN"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(op)}
                            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
                            title="Edit Operator Details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(op.id, op.name)}
                            className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors border border-red-200"
                            title="Delete Operator from MongoDB"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RESET PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Reset Password for {showPasswordModal.name}</h3>
              <button onClick={() => setShowPasswordModal(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">New Password / PIN</label>
                <input
                  type="text"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded-xl font-mono focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(null)}
                  className="px-4 py-2 border rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1B4326] text-white font-bold rounded-xl hover:bg-emerald-900"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">
                {editingOp ? `Edit Operator ${editingOp.name}` : 'Add New Operator'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Mobile Phone (Login Username)</label>
                <input
                  type="text"
                  required
                  placeholder="10-digit phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-xl font-mono focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Assigned Dharam Kanta</label>
                <select
                  value={formData.weighbridgeId}
                  onChange={(e) => setFormData({ ...formData, weighbridgeId: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-600"
                >
                  {kantas.map((k) => (
                    <option key={k.id} value={k.id}>{k.kantaName} ({k.location})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">System Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="OPERATOR">Kanta Operator</option>
                    <option value="SUPERVISOR">Supervisor</option>
                    <option value="ADMIN">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Initial Password / PIN</label>
                <input
                  type="text"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-xl font-mono focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#1B4326] text-white font-bold rounded-xl hover:bg-emerald-900 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving to MongoDB...' : 'Save Operator'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
