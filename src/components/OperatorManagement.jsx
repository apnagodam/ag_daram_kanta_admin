import React, { useState, useEffect } from 'react';
import { User, Plus, Edit3, Trash2, Shield, Phone, Mail, CheckCircle2, X, Save, Search, Filter } from 'lucide-react';
import { fetchOperators, createOperator, updateOperator, deleteOperator } from '../services/api';

export default function OperatorManagement() {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingOp, setEditingOp] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'OPERATOR',
    status: 'ACTIVE',
    weighbridgeId: 'WB-101',
  });

  const loadOperators = async () => {
    setLoading(true);
    try {
      const res = await fetchOperators();
      setOperators(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOperators();
  }, []);

  const filtered = operators.filter((op) => {
    if (roleFilter !== 'ALL' && op.role !== roleFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const n = (op.name || '').toLowerCase();
      const p = (op.phone || '').toLowerCase();
      const e = (op.email || '').toLowerCase();
      return n.includes(q) || p.includes(q) || e.includes(q);
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingOp(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      role: 'OPERATOR',
      status: 'ACTIVE',
      weighbridgeId: 'WB-101',
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
    });
    setShowModal(true);
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
      loadOperators();
    } catch (err) {
      alert('Save failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete operator ${name}?`)) {
      setLoading(true);
      try {
        await deleteOperator(id);
        loadOperators();
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
          <p className="text-xs font-medium text-slate-500">Manage weighbridge operators, access permissions & admin roles in MongoDB</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-gradient-to-r from-[#1B4326] to-emerald-700 text-white font-bold text-xs rounded-xl hover:from-emerald-900 hover:to-emerald-800 shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Add New Operator</span>
        </button>
      </div>

      {/* SEARCH AND ROLE FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Name, Phone, Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="text-slate-500">Filter Role:</span>
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
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[300px]">
        {loading && operators.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-emerald-900">Loading Operators...</span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Operator Name</th>
                  <th className="py-4 px-6">User ID</th>
                  <th className="py-4 px-6">Mobile Contact</th>
                  <th className="py-4 px-6">Email / Login</th>
                  <th className="py-4 px-6">System Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((op) => (
                  <tr key={op.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#1B4326] flex items-center justify-center font-bold text-xs">
                        {op.name ? op.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span>{op.name}</span>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-emerald-800 font-bold">{op.id}</td>
                    <td className="py-4 px-6 font-mono text-xs">{op.phone}</td>
                    <td className="py-4 px-6 text-xs text-slate-600">{op.email || 'N/A'}</td>
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
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                        op.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-red-50 text-red-800 border-red-300'
                      }`}>
                        ● {op.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(op)}
                          className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
                          title="Edit Operator"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(op.id, op.name)}
                          className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors border border-red-200"
                          title="Delete Operator"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">
                {editingOp ? `Edit Operator ${editingOp.name}` : 'Add New Operator'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
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
                <label className="block text-slate-700 font-bold mb-1">Mobile Phone</label>
                <input
                  type="text"
                  required
                  placeholder="10-digit phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-xl font-mono focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="operator@apnagodam.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-600"
                />
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
                  <span>{loading ? 'Saving...' : 'Save Operator'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
