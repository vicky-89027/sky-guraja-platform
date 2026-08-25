import React, { useState, useEffect } from 'react';
import { api, setAuthToken, clearAuthToken } from './api/client';
import { AuthUser, UserRole } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { QuickCollectModal } from './components/QuickCollectModal';
import { ReceiptModal } from './components/ReceiptModal';

import { DashboardView } from './views/DashboardView';
import { ContributionsView } from './views/ContributionsView';
import { ExpensesView } from './views/ExpensesView';
import { LedgerView } from './views/LedgerView';
import { CampaignsView } from './views/CampaignsView';
import { MembersView } from './views/MembersView';
import { EventsView } from './views/EventsView';
import { MeetingsView } from './views/MeetingsView';
import { DocumentsView } from './views/DocumentsView';
import { AuditLogsView } from './views/AuditLogsView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { PublicTransparencyView } from './views/PublicTransparencyView';
import { LandingPageView } from './views/LandingPageView';

import {
  LayoutDashboard,
  Coins,
  ArrowDownRight,
  BookOpenCheck,
  PlusCircle,
  Globe
} from 'lucide-react';

export const App: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeView, setActiveView] = useState<string>('landing');
  const [isQuickCollectOpen, setIsQuickCollectOpen] = useState(false);
  const [selectedReceiptNo, setSelectedReceiptNo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    handleRoleSwitch('SUPER_ADMIN');
  }, []);

  const handleRoleSwitch = async (role: UserRole) => {
    if (role === 'PUBLIC') {
      setUser({
        id: 'usr-public',
        username: 'public_donor',
        email: 'public@skyguraja.org',
        role: 'PUBLIC',
        fullName: 'Public Community Visitor'
      });
      setActiveView('public');
      return;
    }

    try {
      const res = await api.demoSwitch(role);
      if (res.success) {
        setAuthToken(res.token);
        setUser(res.user);
      }
    } catch (err) {
      console.error('Failed to switch demo role:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReceipt = (receiptNo: string) => {
    setSelectedReceiptNo(receiptNo);
  };

  const handleCloseReceipt = () => {
    setSelectedReceiptNo(null);
  };

  const handleQuickCollectSuccess = (receiptNo?: string) => {
    if (receiptNo) {
      setSelectedReceiptNo(receiptNo);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#061224] flex items-center justify-center text-amber-400 font-display text-sm">
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <div>Initializing Sri Krishna Yadav Youth Guraja Platform...</div>
        </div>
      </div>
    );
  }

  // If landing page or public transparency view is active
  if (activeView === 'landing' || activeView === 'public') {
    return (
      <div className="min-h-screen bg-[#061224] flex flex-col">
        {activeView === 'landing' ? (
          <LandingPageView
            onEnterDashboard={() => setActiveView('dashboard')}
            onOpenReceipt={handleOpenReceipt}
          />
        ) : (
          <>
            <Header
              user={user}
              onRoleSwitch={handleRoleSwitch}
              onOpenQuickCollect={() => setIsQuickCollectOpen(true)}
              activeView={activeView}
              setActiveView={setActiveView}
              onLogout={() => handleRoleSwitch('SUPER_ADMIN')}
            />
            <div className="flex-1">
              <PublicTransparencyView onOpenReceipt={handleOpenReceipt} />
            </div>
          </>
        )}
        <QuickCollectModal
          isOpen={isQuickCollectOpen}
          onClose={() => setIsQuickCollectOpen(false)}
          onSuccess={handleQuickCollectSuccess}
          user={user}
        />
        <ReceiptModal
          receiptNumber={selectedReceiptNo}
          onClose={handleCloseReceipt}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#061224] flex flex-col text-slate-100 font-sans">
      {/* Top Header */}
      <Header
        user={user}
        onRoleSwitch={handleRoleSwitch}
        onOpenQuickCollect={() => setIsQuickCollectOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={() => handleRoleSwitch('SUPER_ADMIN')}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Desktop) */}
        <div className="hidden md:block">
          <Sidebar
            activeView={activeView}
            setActiveView={setActiveView}
            userRole={user?.role}
          />
        </div>

        {/* Dynamic Center Main View */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-6">
          {activeView === 'dashboard' && (
            <DashboardView
              user={user}
              onOpenQuickCollect={() => setIsQuickCollectOpen(true)}
              onOpenReceipt={handleOpenReceipt}
              setActiveView={setActiveView}
            />
          )}

          {activeView === 'contributions' && (
            <ContributionsView
              user={user}
              onOpenQuickCollect={() => setIsQuickCollectOpen(true)}
              onOpenReceipt={handleOpenReceipt}
            />
          )}

          {activeView === 'receipts' && (
            <ContributionsView
              user={user}
              onOpenQuickCollect={() => setIsQuickCollectOpen(true)}
              onOpenReceipt={handleOpenReceipt}
            />
          )}

          {activeView === 'expenses' && (
            <ExpensesView user={user} />
          )}

          {activeView === 'ledger' && (
            <LedgerView user={user} />
          )}

          {activeView === 'campaigns' && (
            <CampaignsView
              user={user}
              onOpenQuickCollect={() => setIsQuickCollectOpen(true)}
            />
          )}

          {activeView === 'members' && (
            <MembersView user={user} />
          )}

          {activeView === 'events' && (
            <EventsView user={user} />
          )}

          {activeView === 'meetings' && (
            <MeetingsView user={user} />
          )}

          {activeView === 'documents' && (
            <DocumentsView user={user} />
          )}

          {activeView === 'audit-logs' && (
            <AuditLogsView user={user} />
          )}

          {activeView === 'reports' && (
            <ReportsView user={user} />
          )}

          {activeView === 'settings' && (
            <SettingsView user={user} />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#08152B]/95 backdrop-blur-md border-t border-[#f59e0b]/20 px-3 py-2 flex items-center justify-around z-40">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center gap-1 text-[10px] ${
            activeView === 'dashboard' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveView('contributions')}
          className={`flex flex-col items-center gap-1 text-[10px] ${
            activeView === 'contributions' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Collect</span>
        </button>

        {user?.role !== 'AUDITOR' && (
          <button
            onClick={() => setIsQuickCollectOpen(true)}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg -mt-5 border-2 border-[#061224]"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        )}

        <button
          onClick={() => setActiveView('expenses')}
          className={`flex flex-col items-center gap-1 text-[10px] ${
            activeView === 'expenses' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <ArrowDownRight className="w-4 h-4" />
          <span>Expenses</span>
        </button>

        <button
          onClick={() => setActiveView('ledger')}
          className={`flex flex-col items-center gap-1 text-[10px] ${
            activeView === 'ledger' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <BookOpenCheck className="w-4 h-4" />
          <span>Ledger</span>
        </button>
      </div>

      {/* Global Modals */}
      <QuickCollectModal
        isOpen={isQuickCollectOpen}
        onClose={() => setIsQuickCollectOpen(false)}
        onSuccess={handleQuickCollectSuccess}
        user={user}
      />

      <ReceiptModal
        receiptNumber={selectedReceiptNo}
        onClose={handleCloseReceipt}
      />
    </div>
  );
};

export default App;
