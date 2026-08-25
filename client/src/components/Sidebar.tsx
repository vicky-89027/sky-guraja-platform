import React from 'react';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  Coins,
  Receipt,
  ArrowDownRight,
  BookOpenCheck,
  Target,
  Users,
  Calendar,
  ClipboardList,
  FolderLock,
  History,
  FileSpreadsheet,
  Sliders,
  Globe,
  ShieldCheck,
  Building
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  userRole?: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, userRole }) => {
  const navItems = [
    { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard, category: 'Core' },
    { id: 'contributions', label: 'Fund Collections', icon: Coins, category: 'Finance', badge: 'Active' },
    { id: 'receipts', label: 'Digital Receipts', icon: Receipt, category: 'Finance' },
    { id: 'expenses', label: 'Expenses & Approvals', icon: ArrowDownRight, category: 'Finance' },
    { id: 'ledger', label: 'Financial Ledger', icon: BookOpenCheck, category: 'Finance', highlight: true },
    { id: 'campaigns', label: 'Fundraising Campaigns', icon: Target, category: 'Operations' },
    { id: 'members', label: 'Committee Members', icon: Users, category: 'Operations' },
    { id: 'events', label: 'Events & Programs', icon: Calendar, category: 'Operations' },
    { id: 'meetings', label: 'Meetings & Minutes', icon: ClipboardList, category: 'Operations' },
    { id: 'documents', label: 'Document Vault', icon: FolderLock, category: 'Governance' },
    { id: 'reports', label: 'Financial Reports & CSV', icon: FileSpreadsheet, category: 'Governance' },
    { id: 'audit-logs', label: 'Audit Trail (Immutable)', icon: History, category: 'Governance' },
    { id: 'settings', label: 'System & Approval Tiers', icon: Sliders, category: 'Admin', adminOnly: true },
    { id: 'public', label: 'Public Transparency', icon: Globe, category: 'Public' }
  ];

  const categories = ['Core', 'Finance', 'Operations', 'Governance', 'Admin', 'Public'];

  return (
    <aside className="w-64 bg-[#08152B] border-r border-[#f59e0b]/15 flex flex-col justify-between py-4 px-3 select-none flex-shrink-0 min-h-[calc(100vh-65px)]">
      <div className="space-y-5">
        {/* Organization Mini Badge */}
        <div className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#0B1B36] to-[#12274A] border border-amber-500/20 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-wide">Yadav Youth Guraja</div>
            <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Ledger Online & ACID
            </div>
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="space-y-4">
          {categories.map((cat) => {
            const itemsInCat = navItems.filter((i) => {
              if (i.category !== cat) return false;
              if (i.adminOnly && userRole !== 'SUPER_ADMIN') return false;
              return true;
            });

            if (itemsInCat.length === 0) return null;

            return (
              <div key={cat}>
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  {cat}
                </div>
                <div className="space-y-0.5">
                  {itemsInCat.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                          isActive
                            ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 font-semibold border-l-4 border-amber-400 shadow-sm'
                            : 'text-slate-300 hover:bg-[#0E2242] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`w-4 h-4 transition-colors ${
                              isActive
                                ? 'text-amber-400'
                                : 'text-slate-400 group-hover:text-amber-300'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.highlight && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-mono border border-emerald-500/30">
                            Strict
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Auditor Read Only Notice if active */}
      {userRole === 'AUDITOR' && (
        <div className="mt-4 p-2.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-[11px] text-purple-300">
          <div className="font-bold flex items-center gap-1 mb-0.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Auditor Mode Active
          </div>
          <p className="text-[10px] text-slate-300">
            Strict read-only inspection access. Modification actions are disabled.
          </p>
        </div>
      )}
    </aside>
  );
};
