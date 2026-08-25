import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { AuthUser, FinancialSummary, Campaign, Contribution, Expense } from '../types';
import { SkyLogo } from '../components/SkyLogo';
import {
  Wallet,
  Coins,
  ArrowDownRight,
  Clock,
  Target,
  Users,
  CheckCircle2,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
  AlertTriangle,
  ArrowUpRight,
  PlusCircle,
  Building,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardViewProps {
  user: AuthUser | null;
  onOpenQuickCollect: () => void;
  onOpenReceipt: (receiptNo: string) => void;
  setActiveView: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onOpenQuickCollect,
  onOpenReceipt,
  setActiveView
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = () => {
    setLoading(true);
    api.getDashboardOverview()
      .then((res) => {
        if (res.success) {
          setData(res.data);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 space-y-3">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs">Computing double-entry financial ledger balances...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-300 text-xs m-6">
        {error}
      </div>
    );
  }

  const summary = data?.summary || {};
  const campaigns = data?.campaignsProgress || [];
  const monthlyTrends = data?.monthlyTrends || [];
  const expenseCategories = data?.expenseCategories || [];
  const recentContributions = data?.recentContributions || [];
  const recentExpenses = data?.recentExpenses || [];
  const recentActivities = data?.recentActivities || [];

  const PIE_COLORS = ['#F59E0B', '#0D9488', '#0284C7', '#8B5CF6', '#EC4899', '#10B981'];

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Welcome with Official Logo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0B1B36] via-[#102447] to-[#0B1B36] border border-amber-500/25 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <SkyLogo variant="icon" size="md" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                Financial Operating System
              </span>
              <span className="text-[11px] text-amber-400/80 font-mono font-semibold">
                Unity • Culture • Seva • Youth Power • Progress
              </span>
            </div>
            <h2 className="text-xl lg:text-2xl font-black text-white font-display mt-0.5">
              Sri Krishna Yadav Youth Guraja
            </h2>
            <p className="text-xs text-slate-300">
              Welcome back, <span className="font-bold text-amber-300">{user?.fullName}</span> ({user?.role}) • <span className="italic text-slate-400">"United for Community. Inspired by Krishna."</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {user?.role !== 'AUDITOR' && (
            <button
              onClick={onOpenQuickCollect}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Donation</span>
            </button>
          )}

          <button
            onClick={() => setActiveView('reports')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#16335F] hover:bg-[#1E437C] text-slate-200 hover:text-white text-xs font-semibold rounded-xl border border-white/10 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            <span>Reports & Exports</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance Card (Core Financial Metric) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0D244D] to-[#091833] border border-amber-500/40 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Available Balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-black text-white font-mono tracking-tight">
            ₹{Number(summary.currentAvailableBalance || 0).toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified across {summary.totalEntriesCount} immutable ledger entries</span>
          </div>
        </div>

        {/* Total Verified Collections */}
        <div className="p-5 rounded-2xl bg-[#0B1B36] border border-emerald-500/30 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Total Verified Collections
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
            ₹{Number(summary.totalVerifiedContributions || 0).toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] text-amber-300/80 flex items-center justify-between">
            <span>Pending verification:</span>
            <span className="font-mono font-bold">₹{Number(summary.pendingCollections || 0).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Total Verified Expenses */}
        <div className="p-5 rounded-2xl bg-[#0B1B36] border border-blue-500/30 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
              Total Paid Expenses
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-300 font-mono tracking-tight">
            ₹{Number(summary.totalPaidExpenses || 0).toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] text-indigo-300/80 flex items-center justify-between">
            <span>Pending approvals:</span>
            <span className="font-mono font-bold">₹{Number(summary.pendingExpenses || 0).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Operations Overview */}
        <div className="p-5 rounded-2xl bg-[#0B1B36] border border-purple-500/30 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
              Active Campaigns & Tasks
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-300 font-mono tracking-tight flex items-center gap-2">
            <span>{summary.activeCampaignsCount || 0}</span>
            <span className="text-xs font-sans text-slate-400 font-normal">Active Campaigns</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-300 flex items-center justify-between">
            <span>Active Members: <b className="text-white">{summary.activeMembersCount || 0}</b></span>
            <span>Pending Reviews: <b className="text-amber-400">{summary.pendingApprovalsCount || 0}</b></span>
          </div>
        </div>
      </div>

      {/* Visualizations: Monthly Collections vs Expenses & Campaign Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Chart */}
        <div className="lg:col-span-2 p-5 bg-[#0B1B36] border border-white/10 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                Monthly Collections vs Expenses (Ledger Record)
              </h3>
              <p className="text-[11px] text-slate-400">Financial inflows vs disbursements across months</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#061224', borderColor: '#F59E0B', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="income" name="Collections (Credit)" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expenses (Debit)" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Distribution */}
        <div className="p-5 bg-[#0B1B36] border border-white/10 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-display mb-1">
              Category Expense Breakdown
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">Disbursed funds by community purpose</p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseCategories}
                  dataKey="total_amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={4}
                >
                  {expenseCategories.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#061224', borderColor: '#F59E0B', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 mt-2 max-h-28 overflow-y-auto">
            {expenseCategories.map((cat: any, i: number) => (
              <div key={cat.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-slate-300 capitalize">{cat.category.toLowerCase().replace(/_/g, ' ')}</span>
                </div>
                <span className="font-mono text-amber-300 font-semibold">₹{Number(cat.total_amount).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaigns Progress Bars */}
      <div className="p-5 bg-[#0B1B36] border border-white/10 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-display">Active Fundraising Campaigns</h3>
            <p className="text-[11px] text-slate-400">Target vs verified collections progress</p>
          </div>
          <button
            onClick={() => setActiveView('campaigns')}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
          >
            <span>View All Campaigns</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((c: any) => {
            const pct = Math.min(Math.round((c.collected_amount / c.target_amount) * 100), 100);
            return (
              <div key={c.id} className="p-4 rounded-xl bg-[#061224] border border-white/5 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider px-1.5 py-0.2 bg-amber-500/10 rounded border border-amber-500/20">
                      {c.category.replace(/_/g, ' ')}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-1 leading-snug">{c.name}</h4>
                  </div>
                  <span className="font-mono font-bold text-xs text-emerald-400">{pct}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Collected: <b className="text-white font-mono">₹{Number(c.collected_amount).toLocaleString('en-IN')}</b></span>
                  <span>Target: <b className="text-amber-300 font-mono">₹{Number(c.target_amount).toLocaleString('en-IN')}</b></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dual Table Feed: Recent Collections & Recent Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contributions */}
        <div className="p-5 bg-[#0B1B36] border border-white/10 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-400" /> Recent Collections
            </h3>
            <button
              onClick={() => setActiveView('contributions')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              View Table →
            </button>
          </div>

          <div className="divide-y divide-white/5 text-xs">
            {recentContributions.map((item: any) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between hover:bg-white/[0.02] px-1 rounded-lg">
                <div>
                  <div className="font-semibold text-white">{item.donor_name}</div>
                  <div className="text-[10px] text-slate-400">{item.campaign_name} • {item.date}</div>
                </div>

                <div className="text-right flex items-center gap-2">
                  <div>
                    <div className="font-mono font-bold text-emerald-400">₹{Number(item.amount).toLocaleString('en-IN')}</div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      item.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {item.receipt_number && (
                    <button
                      onClick={() => onOpenReceipt(item.receipt_number)}
                      className="p-1.5 bg-[#16335F] hover:bg-[#1E437C] text-amber-300 rounded-lg"
                      title="View Digital Receipt"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="p-5 bg-[#0B1B36] border border-white/10 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-1.5">
              <ArrowDownRight className="w-4 h-4 text-blue-400" /> Recent Expense Requests
            </h3>
            <button
              onClick={() => setActiveView('expenses')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              View Approvals →
            </button>
          </div>

          <div className="divide-y divide-white/5 text-xs">
            {recentExpenses.map((item: any) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between hover:bg-white/[0.02] px-1 rounded-lg">
                <div>
                  <div className="font-semibold text-white truncate max-w-[200px]">{item.description}</div>
                  <div className="text-[10px] text-slate-400">{item.vendor_name} • {item.date}</div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-rose-400">₹{Number(item.amount).toLocaleString('en-IN')}</div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                    item.approval_status === 'PAID' ? 'bg-blue-500/20 text-blue-300' :
                    item.approval_status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300' :
                    'bg-amber-500/20 text-amber-300'
                  }`}>
                    {item.approval_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
