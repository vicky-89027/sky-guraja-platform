import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Search,
  Coins,
  TrendingUp,
  Wallet,
  FileText,
  Eye,
  Lock,
  ArrowRight
} from 'lucide-react';
import {
  getRealContributionsList,
  getRealStats,
  getRealReceiptsList,
  verifyReceiptByToken,
  RealContribution,
  RealReceipt
} from '../services/receiptService';

interface TransparencyPageProps {
  onVerifyReceipt: (receiptNumber: string) => void;
  onOpenReceiptModal: (receipt: RealReceipt) => void;
}

export const TransparencyPage: React.FC<TransparencyPageProps> = ({
  onVerifyReceipt,
  onOpenReceiptModal
}) => {
  const [receiptInput, setReceiptInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMethod, setFilterMethod] = useState<'ALL' | 'UPI' | 'CASH'>('ALL');
  const [contributions, setContributions] = useState<RealContribution[]>([]);
  const [stats, setStats] = useState(getRealStats());

  useEffect(() => {
    setContributions(getRealContributionsList());
    setStats(getRealStats());
  }, []);

  const handleSearchReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptInput.trim()) return;
    const res = verifyReceiptByToken(receiptInput.trim());
    setVerifyResult(res);
  };

  const handleViewReceipt = (c: RealContribution) => {
    const receipts = getRealReceiptsList();
    const found = receipts.find((r) => r.contributionId === c.id || r.receiptNumber === c.receiptNumber);
    if (found) {
      onOpenReceiptModal(found);
    } else {
      onVerifyReceipt(c.receiptNumber || c.id);
    }
  };

  const filteredContributions = contributions.filter((c) => {
    const matchesMethod = filterMethod === 'ALL' || c.paymentMethod === filterMethod;
    const matchesSearch =
      !searchQuery.trim() ||
      c.contributorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.receiptNumber && c.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.campaignTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMethod && matchesSearch;
  });

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-900">
      {/* Dark Header Banner */}
      <div className="bg-gradient-to-b from-[#050E1C] via-[#08152B] to-[#040C18] text-white py-14 px-4 text-center border-b border-amber-500/20">
        <div className="max-w-4xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
            IMMUTABLE PUBLIC LEDGER
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
            FINANCIAL TRANSPARENCY
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            "Every rupee collected and spent is public, verifiable, and mathematically auditable in our ledger."
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12 space-y-10">
        {/* 3 Macro KPI Cards in Row (Real Database Data) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-md text-center space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              TOTAL FUNDS COLLECTED
            </span>
            <div className="text-3xl font-black text-emerald-600 font-mono">
              {stats.totalCollectedFormatted}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium block">
              100% Verifiable Receipts Issued ({stats.totalContributions} Contributions)
            </span>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-md text-center space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              TOTAL FUNDS UTILIZED
            </span>
            <div className="text-3xl font-black text-rose-600 font-mono">
              {stats.totalUtilizedFormatted}
            </div>
            <span className="text-[11px] text-rose-700 font-medium block">
              Audited Community Seva Projects
            </span>
          </div>

          <div className="p-6 bg-white rounded-2xl border-2 border-[#D4A244] shadow-md text-center space-y-1">
            <span className="text-xs font-bold text-[#D4A244] uppercase tracking-wider">
              TOTAL UNIQUE CONTRIBUTORS
            </span>
            <div className="text-3xl font-black text-amber-600 font-mono">
              {stats.donorsCount}
            </div>
            <span className="text-[11px] text-amber-700 font-medium block">
              UPI ({stats.upiContributionsCount}) • Cash Records ({stats.cashContributionsCount})
            </span>
          </div>
        </div>

        {/* Digital Receipt Verification Tool */}
        <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D4A244] flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Official Digital Receipt Lookup
              </h3>
              <p className="text-xs text-slate-500">
                Enter any official receipt number or scan token issued by Sri Krishna Yadav Youth Guraja:
              </p>
            </div>
          </div>

          <form onSubmit={handleSearchReceipt} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={receiptInput}
              onChange={(e) => setReceiptInput(e.target.value)}
              placeholder="e.g. SKYG/26-27/000001 or SKYG-VERIFY-..."
              className="flex-1 bg-slate-50 border border-slate-300 focus:border-[#D4A244] rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono outline-none"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#D4A244] hover:bg-[#C49132] text-slate-950 font-bold text-xs rounded-xl shadow transition-all"
            >
              Verify Cryptographic Receipt
            </button>
          </form>

          {verifyResult && (
            <div className={`p-4 rounded-xl border text-xs space-y-2 ${
              verifyResult.valid
                ? 'bg-emerald-50 border-emerald-200 text-slate-700'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              <div className="flex items-center gap-2 font-bold">
                {verifyResult.valid ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-800">AUTHENTIC & VERIFIED DIGITAL RECORD FOUND</span>
                  </>
                ) : (
                  <span>⚠ {verifyResult.message}</span>
                )}
              </div>
              {verifyResult.valid && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-emerald-200">
                  <div>Contributor: <b className="text-slate-900">{verifyResult.contributorName}</b></div>
                  <div>Amount: <b className="text-emerald-700 font-mono font-bold">₹ {verifyResult.amount?.toLocaleString('en-IN')}.00</b></div>
                  <div>Campaign: <b className="text-slate-900">{verifyResult.campaignTitle}</b></div>
                  <div>Payment: <span className="font-mono">{verifyResult.paymentMethod}</span> (Receipt #{verifyResult.receiptNumber})</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Real Public Contributions Table */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Public Contributions Register
              </h3>
              <p className="text-xs text-slate-500">
                Live database entries with cryptographic receipt numbers
              </p>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                {(['ALL', 'UPI', 'CASH'] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setFilterMethod(method)}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      filterMethod === method
                        ? 'bg-white text-slate-900 shadow-sm font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          {filteredContributions.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-700">No contributions recorded yet.</div>
              <p className="text-xs text-slate-400">
                New verified UPI and authorized cash contributions will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pl-2">Receipt No.</th>
                    <th className="pb-3">Contributor</th>
                    <th className="pb-3">Campaign</th>
                    <th className="pb-3">Method</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3 pr-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredContributions.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 pl-2 font-mono font-bold text-amber-700">
                        {c.receiptNumber || 'PENDING'}
                      </td>
                      <td className="py-3 font-semibold text-slate-900">
                        {c.contributorName}
                      </td>
                      <td className="py-3 text-slate-600 max-w-[180px] truncate">
                        {c.campaignTitle}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                          c.paymentMethod === 'UPI'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {c.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 font-mono font-black text-slate-900">
                        ₹ {c.amount.toLocaleString('en-IN')}.00
                      </td>
                      <td className="py-3 text-slate-500 font-mono text-[11px]">
                        {new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3 pr-2 text-right">
                        <button
                          onClick={() => handleViewReceipt(c)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-[#D4A244] hover:text-slate-950 text-slate-700 font-bold rounded-lg transition-all inline-flex items-center gap-1 text-[11px]"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransparencyPage;
