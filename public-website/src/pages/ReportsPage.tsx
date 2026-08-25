import React from 'react';
import { FileText, Download, ShieldCheck, CheckCircle2, Calendar } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const reports = [
    {
      id: 'rep-1',
      title: 'Annual Financial Audit & Ledger Balance Statement (FY 2025-26)',
      period: 'April 2025 - March 2026',
      type: 'Financial Audit Report',
      description: 'Comprehensive double-entry financial summary verified by Internal Auditor S. Venkateswara Rao. Zero discrepancies recorded.',
      fileSize: '1.2 MB PDF',
      status: 'Auditor Approved'
    },
    {
      id: 'rep-2',
      title: 'Sri Krishna Janmashtami 2025 Income & Expenditure Statement',
      period: 'August 2025',
      type: 'Festival Campaign Report',
      description: 'Detailed statement of collections from 180+ donors, food procurement vouchers, and priest honorarium.',
      fileSize: '840 KB PDF',
      status: 'Published'
    },
    {
      id: 'rep-3',
      title: 'Guraja RO Clean Drinking Water Plant Operational Report',
      period: 'January 2026',
      type: 'Infrastructure Report',
      description: 'Log of daily water dispensation, TDS water quality test results, and power consumption bills.',
      fileSize: '650 KB PDF',
      status: 'Published'
    },
    {
      id: 'rep-4',
      title: 'Youth Community Study Hall & Library Progress Report',
      period: 'June 2026',
      type: 'Educational Project Report',
      description: 'Summary of student enrollments, computer hardware asset inventory, and textbook acquisition list.',
      fileSize: '920 KB PDF',
      status: 'Published'
    }
  ];

  const handleDownload = (title: string) => {
    alert(`Downloading verified official report: ${title}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 text-emerald-300 text-xs font-mono font-bold rounded-full border border-emerald-500/30 uppercase">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Public Governance & Disclosures</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
          Official Audit & Community Reports
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          We believe in complete public accountability. Review our administrator-approved financial statements and project impact disclosures.
        </p>
      </div>

      <div className="space-y-4">
        {reports.map((r) => (
          <div
            key={r.id}
            className="p-6 bg-[#0B1B36] border border-white/10 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-500/40 transition-all shadow-xl"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase">
                  {r.type}
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {r.period}
                </span>
              </div>
              <h3 className="text-base font-bold text-white leading-snug">{r.title}</h3>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">{r.description}</p>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
              <span className="text-[11px] font-mono text-emerald-400">{r.fileSize}</span>
              <button
                onClick={() => handleDownload(r.title)}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
