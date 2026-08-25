import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Expense, Campaign, AuthUser } from '../types';
import {
  ArrowDownRight,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Building,
  DollarSign,
  Download,
  Search,
  IndianRupee,
  FileText,
  AlertCircle
} from 'lucide-react';

interface ExpensesViewProps {
  user: AuthUser | null;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({ user }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // New Expense Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('COMMUNITY_SERVICE');
  const [description, setDescription] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [search, selectedCategory, selectedStatus]);

  const loadData = () => {
    setLoading(true);
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (selectedCategory) queryParams.append('category', selectedCategory);
    if (selectedStatus) queryParams.append('status', selectedStatus);

    Promise.all([api.getExpenses(queryParams.toString()), api.getCampaigns()])
      .then(([expRes, campRes]) => {
        if (expRes.success) setExpenses(expRes.data);
        if (campRes.success) setCampaigns(campRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleApprove = async (expenseId: string) => {
    try {
      const res = await api.approveExpense(expenseId, `Approved by ${user?.fullName} (${user?.role})`);
      if (res.success) {
        setActionMessage(res.message);
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Approval failed');
    }
  };

  const handlePayout = async (expenseId: string) => {
    if (!window.confirm('Are you sure you want to disburse and post this DEBIT to the ledger?')) return;
    try {
      const res = await api.payoutExpense(expenseId);
      if (res.success) {
        setActionMessage(res.message);
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Disbursement failed');
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !description || !vendorName) {
      alert('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createExpense({
        amount: Number(amount),
        category,
        description,
        vendorName,
        campaignId: campaignId || undefined,
        paymentMethod
      });

      if (res.success) {
        setActionMessage(res.message);
        setIsModalOpen(false);
        setAmount('');
        setDescription('');
        setVendorName('');
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit expense request');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    'COMMUNITY_SERVICE',
    'FESTIVAL',
    'EQUIPMENT',
    'FOOD',
    'PRINTING',
    'TRANSPORTATION',
    'DECORATIONS',
    'EMERGENCY_AID',
    'ADMINISTRATIVE'
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ArrowDownRight className="w-6 h-6 text-rose-400" />
            <h2 className="text-xl lg:text-2xl font-black text-white font-display">
              Expense Management & Multi-Tier Approvals
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Multi-signature authorization, threshold enforcement & strict ledger disbursements
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.open('http://localhost:5000/api/reports/export-csv/expenses', '_blank')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0B1B36] hover:bg-[#102447] text-slate-200 text-xs font-semibold rounded-xl border border-white/10"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export CSV</span>
          </button>

          {user?.role !== 'AUDITOR' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Expense Request</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Notification */}
      {actionMessage && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* Threshold Information Card */}
      <div className="p-4 bg-gradient-to-r from-[#0E2447] to-[#122E5C] border border-amber-500/20 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            ₹
          </div>
          <div>
            <div className="font-bold text-amber-300">Configured Multi-Tier Approval Rules:</div>
            <div className="text-slate-300 text-[11px]">
              <b>₹0–₹5,000</b>: Treasurer • <b>₹5,001–₹25,000</b>: Treasurer + Secretary • <b>Above ₹25,000</b>: Treasurer + Secretary + President
            </div>
          </div>
        </div>
        <div className="text-[10px] text-amber-200/70 font-mono">
          Thresholds managed dynamically in Admin Settings
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 bg-[#0B1B36] border border-white/10 rounded-2xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search vendor, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#061224] border border-white/10 focus:border-amber-400 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#061224] border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
          >
            <option value="">All Expense Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-[#061224] border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
          >
            <option value="">All Approval Statuses</option>
            <option value="SUBMITTED">SUBMITTED (Pending Review)</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW (Partial Sign-offs)</option>
            <option value="APPROVED">APPROVED (Ready for Payout)</option>
            <option value="PAID">PAID (Disbursed in Ledger)</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-[#0B1B36] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E2447] text-slate-300 uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="px-4 py-3.5 font-bold">Expense Details</th>
                <th className="px-4 py-3.5 font-bold">Vendor & Requester</th>
                <th className="px-4 py-3.5 font-bold">Amount</th>
                <th className="px-4 py-3.5 font-bold">Approval Chain & Sign-offs</th>
                <th className="px-4 py-3.5 font-bold">Status</th>
                <th className="px-4 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">Loading expense requests...</td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">No expenses found matching filters.</td>
                </tr>
              ) : (
                expenses.map((e) => {
                  const required = e.requiredRoles || ['TREASURER'];
                  const approved = e.approvedRoles || [];
                  const isFullyApproved = required.every((r) => approved.includes(r));
                  const userCanApprove =
                    user?.role === 'SUPER_ADMIN' ||
                    (required.includes(user?.role!) && !approved.includes(user?.role!));
                  const canPayout = (user?.role === 'SUPER_ADMIN' || user?.role === 'TREASURER') && e.approval_status === 'APPROVED';

                  return (
                    <tr key={e.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Expense Details */}
                      <td className="px-4 py-3.5 max-w-[240px]">
                        <div className="font-bold text-white leading-snug">{e.description}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-500/10 text-amber-300 rounded border border-amber-500/20 uppercase">
                            {e.category.replace(/_/g, ' ')}
                          </span>
                          {e.campaign_name && (
                            <span className="text-[10px] text-slate-400 truncate">{e.campaign_name}</span>
                          )}
                        </div>
                      </td>

                      {/* Vendor & Requester */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-200">{e.vendor_name}</div>
                        <div className="text-[10px] text-slate-400">
                          Req: {e.requested_by_name} • {e.date}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3.5">
                        <div className="font-mono font-extrabold text-sm text-rose-400">
                          ₹{Number(e.amount).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono">{e.payment_method}</div>
                      </td>

                      {/* Approval Chain Progress */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          <div className="text-[10px] text-slate-400 font-medium">
                            Required Tiers ({required.length}):
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {required.map((role) => {
                              const hasApproved = approved.includes(role);
                              return (
                                <span
                                  key={role}
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono ${
                                    hasApproved
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                                  }`}
                                >
                                  {hasApproved ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> : <Clock className="w-2.5 h-2.5" />}
                                  {role}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            e.approval_status === 'PAID'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                              : e.approval_status === 'APPROVED'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : e.approval_status === 'UNDER_REVIEW' || e.approval_status === 'SUBMITTED'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-red-500/20 text-red-300 border border-red-500/40'
                          }`}
                        >
                          {e.approval_status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Approve Button */}
                          {userCanApprove && e.approval_status !== 'PAID' && e.approval_status !== 'REJECTED' && user?.role !== 'AUDITOR' && (
                            <button
                              onClick={() => handleApprove(e.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg transition-all shadow-sm flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Sign Off ({user?.role})</span>
                            </button>
                          )}

                          {/* Payout / Disburse Button */}
                          {canPayout && user?.role !== 'AUDITOR' && (
                            <button
                              onClick={() => handlePayout(e.id)}
                              className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[10px] rounded-lg shadow-md flex items-center gap-1"
                            >
                              <DollarSign className="w-3 h-3" />
                              <span>Disburse & Post Debit</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit New Expense Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleCreateExpense} className="bg-[#0B1B36] border border-amber-500/30 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-amber-400" />
              Submit Community Expense Request
            </h3>
            <p className="text-xs text-slate-300">
              The appropriate multi-tier approval matrix will be assigned automatically based on amount.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">Expense Amount (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#061224] border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold font-mono outline-none"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  required
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Vendor / Payee Name *</label>
              <input
                type="text"
                placeholder="e.g. Sri Balaji Sounds & Lights, Gudivada"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Purpose / Description *</label>
              <textarea
                placeholder="Detailed reason, event stage setup, itemized breakdown..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl p-3 text-xs text-white outline-none h-20"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Associated Campaign (Optional)</label>
                <select
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
                  className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="">General Community Fund</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS)</option>
                  <option value="UPI">UPI / QR</option>
                  <option value="CASH">Cash</option>
                  <option value="CHEQUE">Cheque</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-[#16335F] text-slate-300 text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
              >
                {submitting ? 'Submitting...' : 'Submit for Approvals'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
