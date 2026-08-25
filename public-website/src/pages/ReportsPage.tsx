import React from 'react';
import { FileText, Download, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const documents = [
    {
      id: 'doc-1',
      title: 'Annual Report 2023-24',
      size: '2.4 MB PDF',
      date: 'March 2024',
      type: 'Annual Governance'
    },
    {
      id: 'doc-2',
      title: 'Financial Statement Q1 2024',
      size: '1.1 MB PDF',
      date: 'April 2024',
      type: 'Quarterly Audit'
    },
    {
      id: 'doc-3',
      title: 'Community Impact Report',
      size: '3.8 MB PDF',
      date: 'May 2024',
      type: 'Project Impact'
    },
    {
      id: 'doc-4',
      title: 'Audit Report 2023-24',
      size: '1.8 MB PDF',
      date: 'June 2024',
      type: 'Financial Audit'
    },
    {
      id: 'doc-5',
      title: 'Campaign Report - Education for All',
      size: '950 KB PDF',
      date: 'July 2024',
      type: 'Initiative Report'
    }
  ];

  const handleAction = (type: string, title: string) => {
    alert(`${type} document: "${title}" (Official Sri Krishna Yadav Youth Guraja record)`);
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-900">
      {/* Dark Header Banner */}
      <div className="bg-gradient-to-b from-[#050E1C] via-[#08152B] to-[#040C18] text-white py-14 px-4 text-center border-b border-amber-500/20">
        <div className="max-w-4xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
            PUBLIC DISCLOSURES
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
            REPORTS & DOCUMENTS
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Download and inspect all official committee audits, annual reports, and financial balance sheets.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-14 space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                  {doc.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                  <span>{doc.type}</span>
                  <span>•</span>
                  <span>{doc.date}</span>
                  <span>•</span>
                  <span>{doc.size}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-center">
              <button
                onClick={() => handleAction('Viewing', doc.title)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>VIEW</span>
              </button>

              <button
                onClick={() => handleAction('Downloading', doc.title)}
                className="px-4 py-2 bg-[#D4A244] hover:bg-[#C49132] text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DOWNLOAD</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
