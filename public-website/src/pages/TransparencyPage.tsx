import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Search,
  ArrowDownRight,
  Coins,
  TrendingUp,
  Wallet
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

interface TransparencyPageProps {
  onVerifyReceipt: (receiptNumber: string) => void;
}

export const TransparencyPage: React.FC<TransparencyPageProps> = ({ onVerifyReceipt }) => {
  const [receiptInput, setReceiptInput] = useState('SKY-REC-2026-001');
  const [verifyResult, setVerifyResult] = useState<any>({
    isValid: true,
    donor: 'M. Venkateswara Rao',
    amount: '₹ 25,000 /-',
    campaign: 'Sri Krishna Janmashtami 2026 Grand Celebration',
    date: '2026-07-05',
    receiptNo: 'SKY-REC-2026-001',
    hash: 'HASH-49A1F29C3E1B'
  });

  const pieData = [
    { name: 'Education & Library', value: 35, color: '#D4A244' },
    { name: 'Community Water & Solar', value: 25, color: '#0D9488' },
    { name: 'Healthcare & Aid', value: 20, color: '#0284C7' },
    { name: 'Cultural & Festivals', value: 15, color: '#8B5CF6' },
    { name: 'Youth Sports & Misc', value: 5, color: '#EC4899' },
  ];

  const lineData = [
    { month: 'Jan', expense: 35000, collection: 50000 },
    { month: 'Feb', expense: 42000, collection: 70000 },
    { month: 'Mar', expense: 65000, collection: 95000 },
    { month: 'Apr', expense: 78000, collection: 120000 },
    { month: 'May', expense: 95000, collection: 140000 },
    { month: 'Jun', expense: 110000, collection: 165000 },
    { month: 'Jul', expense: 135000, collection: 205000 },
  ];

  const handleSearchReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptInput.trim()) return;
    onVerifyReceipt(receiptInput.trim());
  };

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
            "Every rupee collected and spent is public, verifiable, and mathematically auditable."
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12 space-y-10">
        {/* 3 Macro KPI Cards in Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-md text-center space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              TOTAL FUNDS COLLECTED
            </span>
            <div className="text-3xl font-black text-emerald-600 font-mono">
              ₹ 8,45,000 +
            </div>
            <span className="text-[11px] text-emerald-700 font-medium block">
              100% Verifiable Receipts Issued
            </span>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-md text-center space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              TOTAL FUNDS UTILIZED
            </span>
            <div className="text-3xl font-black text-rose-600 font-mono">
              ₹ 5,20,000 +
            </div>
            <span className="text-[11px] text-rose-700 font-medium block">
              Vouchers & Bills Verified by Auditor
            </span>
          </div>

          <div className="p-6 bg-white rounded-2xl border-2 border-[#D4A244] shadow-md text-center space-y-1">
            <span className="text-xs font-bold text-[#D4A244] uppercase tracking-wider">
              AVAILABLE RESERVE
            </span>
            <div className="text-3xl font-black text-amber-600 font-mono">
              ₹ 3,25,000 +
            </div>
            <span className="text-[11px] text-amber-700 font-medium block">
              Direct Bank & Cash Balance Matched
            </span>
          </div>
        </div>

        {/* 2 Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1: Fund Allocation */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-md space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              Fund Allocation Overview
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 font-medium">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Expense Overview */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-md space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              Monthly Inflow vs Outflow Trend
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Line type="monotone" dataKey="collection" stroke="#10b981" strokeWidth={2.5} name="Collections (₹)" />
                  <Line type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2.5} name="Expenses (₹)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-3 h-3 bg-emerald-500 rounded-full" /> Total Collections
              </span>
              <span className="flex items-center gap-1.5 text-rose-600">
                <span className="w-3 h-3 bg-rose-500 rounded-full" /> Total Expenses
              </span>
            </div>
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
                Enter any official receipt number issued by Sri Krishna Yadav Youth Guraja:
              </p>
            </div>
          </div>

          <form onSubmit={handleSearchReceipt} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={receiptInput}
              onChange={(e) => setReceiptInput(e.target.value)}
              placeholder="e.g. SKY-REC-2026-001"
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
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2 text-slate-700">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>AUTHENTIC & VERIFIED DIGITAL RECORD FOUND</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-emerald-200">
                <div>Donor: <b className="text-slate-900">{verifyResult.donor}</b></div>
                <div>Amount: <b className="text-emerald-700 font-mono font-bold">{verifyResult.amount}</b></div>
                <div>Campaign: <b className="text-slate-900">{verifyResult.campaign}</b></div>
                <div>Date: <span className="font-mono">{verifyResult.date}</span> (Receipt #{verifyResult.receiptNo})</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransparencyPage;
