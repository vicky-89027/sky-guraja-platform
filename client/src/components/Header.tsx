import React, { useState } from 'react';
import { AuthUser, UserRole } from '../types';
import { SkyLogo } from './SkyLogo';
import { 
  Shield, 
  UserCheck, 
  PlusCircle, 
  Globe, 
  LogOut, 
  ChevronDown, 
  Award,
  Sparkles,
  RefreshCw,
  Bell
} from 'lucide-react';

interface HeaderProps {
  user: AuthUser | null;
  onRoleSwitch: (role: UserRole) => void;
  onOpenQuickCollect: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onRoleSwitch,
  onOpenQuickCollect,
  activeView,
  setActiveView,
  onLogout
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const roles: { role: UserRole; label: string; desc: string; color: string }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Full System Control & Settings', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
    { role: 'PRESIDENT', label: 'President', desc: 'Major Approvals & Governance', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { role: 'SECRETARY', label: 'Secretary', desc: 'Members, Events, Meetings', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { role: 'TREASURER', label: 'Treasurer', desc: 'Collections, Expenses & Ledger', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { role: 'MEMBER', label: 'Committee Member', desc: 'Field Collection & Quotas', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
    { role: 'AUDITOR', label: 'Auditor (CA)', desc: 'Strict Read-Only Inspection', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { role: 'PUBLIC', label: 'Public Portal', desc: 'Public Transparency View', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' }
  ];

  const currentRoleConfig = roles.find((r) => r.role === user?.role) || roles[0];

  return (
    <header className="sticky top-0 z-40 bg-[#061224]/95 backdrop-blur-md border-b border-[#f59e0b]/20 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-lg">
      {/* Brand Identity with Official Logo */}
      <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveView('dashboard')}>
        <SkyLogo variant="horizontal" size="md" />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 lg:gap-4">
        {/* Public Portal Switch */}
        <button
          onClick={() => setActiveView('public')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            activeView === 'public'
              ? 'bg-amber-500 text-[#061224] font-semibold border-amber-400 shadow-md'
              : 'bg-[#0B1B36] text-amber-300/90 border-amber-500/30 hover:border-amber-400 hover:bg-[#102447]'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Public Transparency</span>
        </button>

        {/* Quick Collection Button (Disabled for Auditor & Public) */}
        {user?.role !== 'AUDITOR' && (
          <button
            onClick={onOpenQuickCollect}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.35)] transition-all transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Record Donation</span>
            <span className="sm:hidden">Collect</span>
          </button>
        )}

        {/* Role Switcher Dropdown (Seamless Review & Verification) */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#0B1B36] hover:bg-[#102447] border border-white/10 hover:border-amber-500/40 rounded-lg text-xs text-white transition-all shadow-sm"
          >
            <div className="flex flex-col items-start text-left">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Role ({user?.role})</span>
              <span className="font-semibold text-amber-300 truncate max-w-[110px] sm:max-w-[150px]">
                {user?.fullName || 'Active User'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#0B1B36] border border-amber-500/30 rounded-xl shadow-2xl p-2 z-50 animate-fade-in backdrop-blur-xl">
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Switch Test Account / Role
                </p>
                <p className="text-[10px] text-slate-400">Instantly test permissions & workflows</p>
              </div>

              <div className="space-y-1">
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      onRoleSwitch(r.role);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-all ${
                      user?.role === r.role
                        ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                        : 'text-slate-300 hover:bg-[#162A4D] hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{r.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{r.desc}</div>
                    </div>
                    {user?.role === r.role && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
