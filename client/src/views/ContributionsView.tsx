import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Contribution, Campaign, AuthUser } from '../types';
import {
  Coins,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Receipt,
  PlusCircle,
  Download,
  Calendar,
  IndianRupee,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface ContributionsViewProps {
  user: AuthUser | null;
  onOpenQuickCollect: () => void;
  onOpenReceipt: (receiptNo: string) => void;
}

export const ContributionsView: React.FC<ContributionsViewProps> = ({
  user,
  onOpenQuickCollect,
  onOpenReceipt
}) => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [search, selectedCampaign, selectedStatus, selectedPaymentMethod]);

  const loadData = () => {
    setLoading(true);
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (selectedCampaign) queryParams.append('campaignId', selectedCampaign);
    if (selectedStatus) queryParams.append('status', selectedStatus);
    if (selectedPaymentMethod) queryParams.append('paymentMethod', selectedPaymentMethod);

    Promise.all([
      api.getContributions(queryParams.toString()),
      api.getCampaigns()
    ])
      .then(([contribRes, campRes]) => {
        if (contribRes.success) setContributions(contribRes.data);
        if (campRes.success) setCampaigns(campRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleVerify = async (id: string) => {
    setVerifyingId(id);
    try {
      const res = await api.verifyContribution(id);
      if (res.success) {
        setActionMessage(res.message);
        loadData();
        if (res.receipt?.receiptNumber) {
          onOpenReceipt(res.receipt.receiptNumber);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Verification failed');
    } finally {
      setVerifyingId(null);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingId) return;
    try {
      const res = await api.rejectContribution(rejectingId, rejectReason);
      if (res.success) {
        setActionMessage('Contribution rejected');
        setRejectingId(null);
        setRejectReason('');
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Rejection failed');
    }
  };

  const handleExportCSV = () => {
    window.open('http://localhost:5000/api/reports/export-csv/contributions', '_blank');
  };

  const totalAmount = contributions.reduce((sum, c) => sum + Number(c.amount || 0), 0);
  const verifiedAmount = contributions
    .filter((c) => c.status === 'VERIFIED')
    .reduce((sum, c) => sum + Number(c.amount || 0), 0);
  const pendingAmount = contributions
    .filter((c) => c.status === 'SUBMITTED' || c.status === 'PENDING')
    .reduce((sum, c) => sum + Number(c.amount || 0), 0);

  const canVerify = user?.role === 'SUPER_ADMIN' || user?.role === 'TREASURER' || user?.role === 'PRESIDENT';

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl lg:text-2xl font-black text-white font-display">
              Fund Collection Module
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Immutable tracking, field collections, verification workflow & digital receipts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0B1B36] hover:bg-[#102447] text-slate-200 text-xs font-semibold rounded-xl border border-white/10 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export CSV</span>
          </button>

          {user?.role !== 'AUDITOR' && (
            <button
              onClick={onOpenQuickCollect}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record New Collection</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* Summary Stat Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-xl bg-[#0B1B36] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Total In View</span>
            <div className="text-lg font-black text-white font-mono">₹{totalAmount.toLocaleString('en-IN')}</div>
          </div>
          <span className="text-xs text-slate-400 font-mono">{contributions.length} Records</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1B36] border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-emerald-300 uppercase font-bold">Verified in Ledger</span>
            <div className="text-lg font-black text-emerald-400 font-mono">₹{verifiedAmount.toLocaleString('en-IN')}</div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-400/50" />
        </div>

        <div className="p-4 rounded-xl bg-[#0B1B36] border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-300 uppercase font-bold">Pending Verification</span>
            <div className="text-lg font-black text-amber-400 font-mono">₹{pendingAmount.toLocaleString('en-IN')}</div>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold font-mono">
            Action Req.
          </span>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 bg-[#0B1B36] border border-white/10 rounded-2xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search donor, phone, receipt #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#061224] border border-white/10 focus:border-amber-400 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white outline-none"
            />
          </div>

          {/* Campaign Filter */}
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="w-full bg-[#061224] border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
          >
            <option value="">All Campaigns</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-[#061224] border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
          >
            <option value="">All Statuses</option>
            <option value="VERIFIED">VERIFIED (In Ledger)</option>
            <option value="SUBMITTED">SUBMITTED (Pending)</option>
            <option value="REJECTED">REJECTED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>

          {/* Payment Method */}
          <select
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            className="w-full bg-[#061224] border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
          >
            <option value="">All Payment Modes</option>
            <option value="UPI">UPI / QR</option>
            <option value="CASH">Cash</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
          </select>
        </div>
      </div>

      {/* Contributions Data Table */}
      <div className="bg-[#0B1B36] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E2447] text-slate-300 uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="px-4 py-3.5 font-bold">Receipt / ID</th>
                <th className="px-4 py-3.5 font-bold">Donor Information</th>
                <th className="px-4 py-3.5 font-bold">Campaign</th>
                <th className="px-4 py-3.5 font-bold">Amount</th>
                <th className="px-4 py-3.5 font-bold">Payment Details</th>
                <th className="px-4 py-3.5 font-bold">Collector</th>
                <th className="px-4 py-3.5 font-bold">Status</th>
                <th className="px-4 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    Loading contributions data...
                  </td>
                </tr>
              ) : contributions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    No contributions match your filters.
                  </td>
                </tr>
              ) : (
                contributions.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Receipt / ID */}
                    <td className="px-4 py-3">
                      {c.receipt_number ? (
                        <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {c.receipt_number}
                        </span>
                      ) : (
                        <span className="font-mono text-slate-500">{c.id}</span>
                      )}
                    </td>

                    {/* Donor Info */}
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{c.donor_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{c.phone}</div>
                    </td>

                    {/* Campaign */}
                    <td className="px-4 py-3 max-w-[180px]">
                      <div className="truncate font-medium text-slate-200">{c.campaign_name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{c.purpose}</div>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3">
                      <div className="font-mono font-extrabold text-sm text-emerald-400">
                        ₹{Number(c.amount).toLocaleString('en-IN')}
                      </div>
                    </td>

                    {/* Payment Details */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-200">{c.payment_method}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {c.reference_no || 'N/A'} • {c.date}
                      </div>
                    </td>

                    {/* Collector */}
                    <td className="px-4 py-3 text-slate-300">
                      {c.collector_name || 'Direct Office'}
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          c.status === 'VERIFIED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : c.status === 'SUBMITTED'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-red-500/20 text-red-300 border border-red-500/40'
                        }`}
                      >
                        {c.status === 'VERIFIED' && <CheckCircle2 className="w-3 h-3" />}
                        {c.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {c.receipt_number && (
                          <button
                            onClick={() => onOpenReceipt(c.receipt_number!)}
                            className="p-1.5 bg-[#16335F] hover:bg-[#1E437C] text-amber-300 rounded-lg transition-all"
                            title="View / Print Digital Receipt"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {c.status !== 'VERIFIED' && canVerify && user?.role !== 'AUDITOR' && (
                          <>
                            <button
                              onClick={() => handleVerify(c.id)}
                              disabled={verifyingId === c.id}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg transition-all shadow-sm flex items-center gap-1 disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verify</span>
                            </button>

                            <button
                              onClick={() => setRejectingId(c.id)}
                              className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg"
                              title="Reject Contribution"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleReject} className="bg-[#0B1B36] border border-red-500/30 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Reject Contribution
            </h3>
            <p className="text-xs text-slate-300">
              Please enter the reason for rejecting this contribution. This will be recorded in the audit trail.
            </p>
            <textarea
              placeholder="e.g. Duplicate reference number / uncredited transaction"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-[#061224] border border-white/15 focus:border-red-400 rounded-xl p-3 text-xs text-white outline-none h-24"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectingId(null)}
                className="px-3 py-1.5 bg-[#16335F] text-slate-300 text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl"
              >
                Confirm Rejection
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
