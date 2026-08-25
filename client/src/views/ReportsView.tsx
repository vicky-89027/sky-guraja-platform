import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { AuthUser } from '../types';
import { FileSpreadsheet, Download, Printer, BarChart3, Users, BookOpenCheck, ArrowDownRight, Building } from 'lucide-react';

interface ReportsViewProps {
  user: AuthUser | null;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ user }) => {
  const [reportData, setReportData] = useState<any>(null);
  const [memberPerformance, setMemberPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'financial' | 'campaigns' | 'members'>('financial');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    setLoading(true);
    Promise.all([api.getFinancialStatement(), api.getMembersPerformance()])
      .then(([finRes, memRes]) => {
        if (finRes.success) setReportData(finRes.data);
        if (memRes.success) setMemberPerformance(memRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = (type: string) => {
    window.open(`http://localhost:5000/api/reports/export-csv/${type}`, '_blank');
  };

  const summary = reportData?.summary || {};
  const campaignFinancials = reportData?.campaignFinancials || [];
  const monthlyLedger = reportData?.monthlyLedger || [];
  const expenseCategoryBreakdown = reportData?.expenseCategoryBreakdown || [];

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl lg:text-2xl font-black text-white font-display">
              Official Reports & Financial Statements
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Exportable audit statements, campaign summaries, and volunteer performance metrics
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#16335F] hover:bg-[#1E437C] text-slate-200 text-xs font-bold rounded-xl border border-white/10"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Print Report</span>
          </button>

          <div className="relative group">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg">
              <Download className="w-4 h-4" />
              <span>Export CSV File ▼</span>
            </button>
            <div className="absolute right-0 mt-1 w-48 bg-[#0B1B36] border border-amber-500/30 rounded-xl shadow-2xl p-1 hidden group-hover:block z-20">
              <button
                onClick={() => handleExportCSV('contributions')}
                className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-[#16335F] hover:text-white rounded-lg"
              >
                Collections CSV
              </button>
              <button
                onClick={() => handleExportCSV('expenses')}
                className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-[#16335F] hover:text-white rounded-lg"
              >
                Expenses CSV
              </button>
              <button
                onClick={() => handleExportCSV('ledger')}
                className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-[#16335F] hover:text-white rounded-lg"
              >
                Ledger Statement CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="no-print flex items-center gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'financial', label: 'Financial Summary Statement', icon: BookOpenCheck },
          { id: 'campaigns', label: 'Campaign-wise Balance Sheet', icon: BarChart3 },
          { id: 'members', label: 'Volunteer Collection Performance', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-[#0B1B36] text-slate-300 hover:bg-[#102447] border border-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Printable Report Document Surface */}
      <div className="bg-[#0B1B36] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Organization Header */}
        <div className="text-center pb-5 border-b-2 border-amber-500/30">
          <div className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 font-extrabold text-sm rounded-lg border border-amber-500/30 uppercase font-display mb-1">
            Sri Krishna Yadav Youth Guraja
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase font-display mt-1">
            AUDITED FINANCIAL & OPERATIONAL STATEMENT
          </h1>
          <p className="text-xs text-slate-400">
            Yadav Youth Bhavan, Main Road, Guraja, Krishna District, AP • Generated on {new Date().toLocaleDateString('en-IN')}
          </p>
        </div>

        {/* Tab 1: Financial Summary Statement */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            {/* Top Stat Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-[#061224] rounded-xl border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Verified Collections</span>
                <span className="text-xl font-mono font-extrabold text-emerald-400">
                  ₹{Number(summary.totalVerifiedContributions || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-4 bg-[#061224] rounded-xl border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Approved Disbursements</span>
                <span className="text-xl font-mono font-extrabold text-rose-400">
                  ₹{Number(summary.totalPaidExpenses || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-4 bg-[#061224] rounded-xl border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Approved Refunds</span>
                <span className="text-xl font-mono font-extrabold text-purple-400">
                  ₹{Number(summary.totalApprovedRefunds || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-500/20 to-[#0B1B36] rounded-xl border-2 border-amber-400">
                <span className="text-[10px] text-amber-300 uppercase font-bold block">Current Ledger Balance</span>
                <span className="text-xl font-mono font-black text-amber-300">
                  ₹{Number(summary.currentAvailableBalance || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Monthly Breakup Table */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white font-display">Monthly Financial Cashflow (Audit History)</h3>
              <div className="border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0E2447] text-slate-300 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Month</th>
                      <th className="p-3 text-right">Collections (Credit)</th>
                      <th className="p-3 text-right">Expenses (Debit)</th>
                      <th className="p-3 text-right">Net Cashflow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-slate-300">
                    {monthlyLedger.map((m: any) => (
                      <tr key={m.month} className="hover:bg-white/[0.02]">
                        <td className="p-3 text-white font-sans font-semibold">{m.month}</td>
                        <td className="p-3 text-right text-emerald-400">+₹{Number(m.credits).toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right text-rose-400">-₹{Number(m.debits).toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right text-amber-300 font-bold">₹{(m.credits - m.debits).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Campaigns Statement */}
        {activeTab === 'campaigns' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white font-display">Campaign-wise Collection & Spending Sheet</h3>
            <div className="border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0E2447] text-slate-300 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Campaign Name</th>
                    <th className="p-3 text-right">Target Goal</th>
                    <th className="p-3 text-right">Verified Collected</th>
                    <th className="p-3 text-right">Disbursed Spend</th>
                    <th className="p-3 text-right">Campaign Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-slate-300">
                  {campaignFinancials.map((c: any) => (
                    <tr key={c.campaign_name} className="hover:bg-white/[0.02]">
                      <td className="p-3 font-sans font-bold text-white">{c.campaign_name}</td>
                      <td className="p-3 text-right text-amber-300">₹{Number(c.target_amount).toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right text-emerald-400">₹{Number(c.total_collected).toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right text-rose-400">₹{Number(c.total_spent).toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right font-bold text-white">
                        ₹{(c.total_collected - c.total_spent).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Member Performance */}
        {activeTab === 'members' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white font-display">Committee Member Collection Quotas & Performance</h3>
            <div className="border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0E2447] text-slate-300 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Member Name</th>
                    <th className="p-3">Designation / Area</th>
                    <th className="p-3 text-right">Assigned Quota</th>
                    <th className="p-3 text-right">Verified Collected</th>
                    <th className="p-3 text-right">Pending Review</th>
                    <th className="p-3 text-right">Donations Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {memberPerformance.map((m) => (
                    <tr key={m.name} className="hover:bg-white/[0.02]">
                      <td className="p-3 font-bold text-white">{m.name}</td>
                      <td className="p-3 text-slate-400">{m.role_title} • {m.area_location}</td>
                      <td className="p-3 text-right font-mono text-amber-300">₹{Number(m.assigned_target).toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-400">₹{Number(m.verified_collected).toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right font-mono text-amber-400">₹{Number(m.pending_verification_amount).toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right font-mono font-bold text-white">{m.verified_donations_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Signatures block for printed reports */}
        <div className="pt-8 grid grid-cols-3 gap-4 text-center text-xs border-t border-slate-700">
          <div>
            <div className="h-10 border-b border-dashed border-slate-600 mb-1" />
            <span className="font-bold text-slate-300">Treasurer</span>
            <span className="text-[10px] text-slate-500 block">Ramesh Yadav</span>
          </div>
          <div>
            <div className="h-10 border-b border-dashed border-slate-600 mb-1" />
            <span className="font-bold text-slate-300">General Secretary</span>
            <span className="text-[10px] text-slate-500 block">Suresh Kumar Yadav</span>
          </div>
          <div>
            <div className="h-10 border-b border-dashed border-slate-600 mb-1" />
            <span className="font-bold text-slate-300">President</span>
            <span className="text-[10px] text-slate-500 block">Nagaraju Yadav</span>
          </div>
        </div>
      </div>
    </div>
  );
};
