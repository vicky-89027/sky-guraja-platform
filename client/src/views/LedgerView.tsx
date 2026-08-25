import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { LedgerEntry, FinancialSummary, AuthUser } from '../types';
import {
  BookOpenCheck,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  PlusCircle,
  FileSpreadsheet,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface LedgerViewProps {
  user: AuthUser | null;
}

export const LedgerView: React.FC<LedgerViewProps> = ({ user }) => {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [entryTypeFilter, setEntryTypeFilter] = useState('');
  const [isAdjModalOpen, setIsAdjModalOpen] = useState(false);

  // Adjustment Modal State
  const [origEntityId, setOrigEntityId] = useState('');
  const [entityType, setEntityType] = useState<'CONTRIBUTION' | 'EXPENSE'>('CONTRIBUTION');
  const [adjType, setAdjType] = useState<'ADJUSTMENT_CREDIT' | 'ADJUSTMENT_DEBIT'>('ADJUSTMENT_CREDIT');
  const [adjAmount, setAdjAmount] = useState('');
  const [adjReason, setAdjReason] = useState('');
  const [submittingAdj, setSubmittingAdj] = useState(false);

  useEffect(() => {
    loadLedger();
  }, [entryTypeFilter]);

  const loadLedger = () => {
    setLoading(true);
    const query = entryTypeFilter ? `entryType=${entryTypeFilter}` : '';
    api.getLedgerEntries(query)
      .then((res) => {
        if (res.success) {
          setEntries(res.data.entries);
          setSummary(res.data.summary);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handlePostAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origEntityId || !adjAmount || !adjReason) {
      alert('Please fill all adjustment fields');
      return;
    }

    setSubmittingAdj(true);
    try {
      const res = await api.postAdjustment({
        originalEntityId: origEntityId,
        entityType,
        adjustmentType: adjType,
        amount: Number(adjAmount),
        reason: adjReason
      });

      if (res.success) {
        alert('Ledger adjustment posted successfully!');
        setIsAdjModalOpen(false);
        setOrigEntityId('');
        setAdjAmount('');
        setAdjReason('');
        loadLedger();
      }
    } catch (err: any) {
      alert(err.message || 'Adjustment failed');
    } finally {
      setSubmittingAdj(false);
    }
  };

  const canPostAdjustment = user?.role === 'SUPER_ADMIN' || user?.role === 'TREASURER';

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpenCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl lg:text-2xl font-black text-white font-display">
              Double-Entry Financial Ledger
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Immutable financial journal • Every verified Rupee traceable from source to disbursement
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.open('http://localhost:5000/api/reports/export-csv/ledger', '_blank')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0B1B36] hover:bg-[#102447] text-slate-200 text-xs font-semibold rounded-xl border border-white/10"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export Statement CSV</span>
          </button>

          {canPostAdjustment && user?.role !== 'AUDITOR' && (
            <button
              onClick={() => setIsAdjModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500/20 to-amber-600/30 hover:bg-amber-500/30 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/40 transition-all"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Post Adjustment Entry</span>
            </button>
          )}
        </div>
      </div>

      {/* Strict Invariant Formula Banner */}
      <div className="p-4 bg-gradient-to-r from-[#061224] via-[#0B1B36] to-[#061224] border border-amber-500/30 rounded-2xl shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>DOUBLE-ENTRY LEDGER BALANCE FORMULA</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
            ACID Matched
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2.5 bg-[#061224] rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase block">Opening Balance</span>
            <span className="font-mono font-bold text-white text-sm">₹0</span>
          </div>
          <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <span className="text-[10px] text-emerald-300 uppercase block">+ Verified Credits</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              ₹{Number(summary?.totalVerifiedContributions || 0).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="p-2.5 bg-rose-500/10 rounded-xl border border-rose-500/20">
            <span className="text-[10px] text-rose-300 uppercase block">- Verified Debits</span>
            <span className="font-mono font-bold text-rose-400 text-sm">
              ₹{Number(summary?.totalPaidExpenses || 0).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <span className="text-[10px] text-purple-300 uppercase block">- Refunds</span>
            <span className="font-mono font-bold text-purple-400 text-sm">
              ₹{Number(summary?.totalApprovedRefunds || 0).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="p-2.5 bg-amber-500/15 rounded-xl border-2 border-amber-400 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-amber-300 uppercase font-bold block">= Available Balance</span>
            <span className="font-mono font-black text-amber-300 text-base">
              ₹{Number(summary?.currentAvailableBalance || 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['', 'CREDIT', 'DEBIT', 'ADJUSTMENT_CREDIT', 'ADJUSTMENT_DEBIT'].map((type) => (
          <button
            key={type}
            onClick={() => setEntryTypeFilter(type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              entryTypeFilter === type
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-[#0B1B36] text-slate-300 hover:bg-[#102447] border border-white/10'
            }`}
          >
            {type === '' ? 'All Ledger Entries' : type.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Immutable Ledger Journal Table */}
      <div className="bg-[#0B1B36] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E2447] text-slate-300 uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="px-4 py-3.5 font-bold">Txn Reference</th>
                <th className="px-4 py-3.5 font-bold">Entry Type</th>
                <th className="px-4 py-3.5 font-bold">Amount</th>
                <th className="px-4 py-3.5 font-bold">Balance After Txn</th>
                <th className="px-4 py-3.5 font-bold">Category / Campaign</th>
                <th className="px-4 py-3.5 font-bold">Description / Purpose</th>
                <th className="px-4 py-3.5 font-bold">Auditable Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">Loading ledger records...</td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">No ledger records found.</td>
                </tr>
              ) : (
                entries.map((entry) => {
                  const isCredit = entry.entry_type === 'CREDIT' || entry.entry_type === 'ADJUSTMENT_CREDIT';
                  return (
                    <tr key={entry.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Ref */}
                      <td className="px-4 py-3.5 font-mono text-amber-300 font-bold">
                        {entry.transaction_ref}
                      </td>

                      {/* Entry Type */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                            isCredit
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {isCredit ? <ArrowUpRight className="w-3 h-3 text-emerald-400" /> : <ArrowDownRight className="w-3 h-3 text-rose-400" />}
                          {entry.entry_type.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3.5">
                        <span className={`font-mono font-extrabold text-sm ${isCredit ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isCredit ? '+' : '-'}₹{Number(entry.amount).toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Balance After */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-white bg-slate-900/60 px-2 py-1 rounded border border-white/10">
                          ₹{Number(entry.balance_after).toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Category & Campaign */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-200">{entry.category}</div>
                        {entry.campaign_name && (
                          <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{entry.campaign_name}</div>
                        )}
                      </td>

                      {/* Description */}
                      <td className="px-4 py-3.5 max-w-[280px]">
                        <div className="text-slate-300 leading-snug">{entry.description}</div>
                      </td>

                      {/* Timestamp & Actor */}
                      <td className="px-4 py-3.5 text-slate-400 font-mono text-[10px]">
                        <div>{entry.created_at}</div>
                        {entry.actor_name && <div className="text-slate-500">By: {entry.actor_name}</div>}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Controlled Adjustment Modal (Rule 2: Corrections require an adjustment/reversal record) */}
      {isAdjModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handlePostAdjustment} className="bg-[#0B1B36] border border-amber-500/40 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-400" />
              Post Controlled Ledger Adjustment
            </h3>
            <p className="text-xs text-slate-300">
              Rule 1 & 2: Verified transactions are immutable. Corrections must be posted as dedicated adjustment entries with audit reasoning.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Adjustment Type *</label>
              <select
                value={adjType}
                onChange={(e) => setAdjType(e.target.value as any)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="ADJUSTMENT_CREDIT">ADJUSTMENT CREDIT (+ Funds)</option>
                <option value="ADJUSTMENT_DEBIT">ADJUSTMENT DEBIT (- Funds / Correction)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Original Entity ID / Ref *</label>
              <input
                type="text"
                placeholder="e.g. con-01 or exp-02"
                value={origEntityId}
                onChange={(e) => setOrigEntityId(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-300 mb-1">Adjustment Amount (₹) *</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={adjAmount}
                onChange={(e) => setAdjAmount(e.target.value)}
                className="w-full bg-[#061224] border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold font-mono outline-none"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Auditable Justification Reason *</label>
              <textarea
                placeholder="Explain the mathematical or banking discrepancy justification..."
                value={adjReason}
                onChange={(e) => setAdjReason(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl p-3 text-xs text-white outline-none h-20"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdjModalOpen(false)}
                className="px-4 py-2 bg-[#16335F] text-slate-300 text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingAdj}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
              >
                {submittingAdj ? 'Posting...' : 'Post Adjustment to Ledger'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
