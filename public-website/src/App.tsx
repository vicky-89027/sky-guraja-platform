import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DonationModal } from './components/DonationModal';
import { CashContributionModal } from './components/CashContributionModal';
import { ReceiptModal } from './components/ReceiptModal';
import { AuthModal, AuthUser } from './components/AuthModal';
import { ManagementModal } from './components/ManagementModal';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { CampaignDetailsPage } from './pages/CampaignDetailsPage';
import { TransparencyPage } from './pages/TransparencyPage';
import { WorkPage } from './pages/WorkPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { TeamPage } from './pages/TeamPage';
import { GalleryPage } from './pages/GalleryPage';
import { ReportsPage } from './pages/ReportsPage';
import { ContactPage } from './pages/ContactPage';
import { JoinUsPage } from './pages/JoinUsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ReceiptVerificationPage } from './pages/ReceiptVerificationPage';
import { RealReceipt, getRealReceiptsList } from './services/receiptService';

import { OFFICIAL_MEMBERS } from './components/AuthModal';
import { getTeamMembers } from './services/teamService';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [user, setUser] = useState<AuthUser | null>(null);

  // Modals state
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isCashOpen, setIsCashOpen] = useState(false);
  const [donateCampaign, setDonateCampaign] = useState<string | undefined>(undefined);
  const [selectedReceipt, setSelectedReceipt] = useState<RealReceipt | null>(null);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authPrompt, setAuthPrompt] = useState<string | undefined>(undefined);
  const [pendingIntent, setPendingIntent] = useState<string | undefined>(undefined);

  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);

  // Check URL search params for ?verify=TOKEN or ?receipt=... and sync active user session
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const verifyToken = urlParams.get('verify') || urlParams.get('token');
      if (verifyToken) {
        setVerificationToken(verifyToken);
        setActiveTab('verify-receipt');
      }

      const syncActiveSession = () => {
        const saved = localStorage.getItem('sky_user');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const liveMembers = getTeamMembers();
            const cleanPhone = (parsed.phone || '').replace(/[^0-9]/g, '');

            const matched = liveMembers.find(
              (m) =>
                (cleanPhone && m.phone && m.phone.replace(/[^0-9]/g, '') === cleanPhone) ||
                m.role.toUpperCase() === (parsed.role || '').toUpperCase() ||
                (parsed.username && m.username?.toLowerCase() === parsed.username.toLowerCase())
            ) || OFFICIAL_MEMBERS.find(
              (m) =>
                (cleanPhone && m.phone && m.phone.replace(/[^0-9]/g, '') === cleanPhone) ||
                m.role.toUpperCase() === (parsed.role || '').toUpperCase() ||
                (parsed.username && m.username.toLowerCase() === parsed.username.toLowerCase())
            );

            if (matched) {
              parsed.fullName = (matched as any).name || (matched as any).fullName;
              parsed.role = matched.role;
              parsed.roleTitle = (matched as any).roleTitle || matched.role;
              parsed.image = matched.image || parsed.image;
              parsed.photoUrl = matched.image || parsed.photoUrl;
              parsed.phone = matched.phone || parsed.phone;
              parsed.email = matched.email || parsed.email;
              localStorage.setItem('sky_user', JSON.stringify(parsed));
            }
            setUser(parsed);
          } catch {
            setUser(null);
          }
        }
      };

      syncActiveSession();
      window.addEventListener('storage', syncActiveSession);
      return () => window.removeEventListener('storage', syncActiveSession);
    } catch {
      // Ignore
    }
  }, []);

  const handleOpenDonate = (campaignName?: string) => {
    setDonateCampaign(campaignName);
    setIsDonateOpen(true);
  };

  const handleOpenCashContribution = () => {
    if (!user || !['MEMBER', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      handleOpenAuth('login', 'Please sign in with your authorized Member account to record cash contributions.', 'record_cash');
      return;
    }
    setIsCashOpen(true);
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login', prompt?: string, intent?: string) => {
    setAuthMode(mode);
    setAuthPrompt(prompt);
    setPendingIntent(intent);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (authUser: AuthUser, intent?: string) => {
    setUser(authUser);
    if (intent === 'transfer_funds') {
      setIsDonateOpen(true);
    } else if (intent === 'make_changes') {
      setIsManagementOpen(true);
    } else if (intent === 'record_cash') {
      setIsCashOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sky_user');
    localStorage.removeItem('sky_token');
    setUser(null);
  };

  const handleVerifyReceipt = (receiptNumberOrToken: string) => {
    setVerificationToken(receiptNumberOrToken);
    setActiveTab('verify-receipt');
  };

  return (
    <div className="min-h-screen bg-[#061224] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Sticky Top Navbar with Auth State */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDonate={handleOpenDonate}
        onOpenAuth={handleOpenAuth}
        onOpenManagement={() => {
          if (!user) {
            handleOpenAuth('login', 'Please sign in or register to make committee changes and manage records.', 'make_changes');
          } else {
            setIsManagementOpen(true);
          }
        }}
        user={user}
        onLogout={handleLogout}
      />

      {/* Dynamic Main Page Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            onOpenDonate={handleOpenDonate}
            onNavigateTab={setActiveTab}
            onVerifyReceipt={handleVerifyReceipt}
          />
        )}
        {activeTab === 'about' && <AboutPage />}
        {activeTab === 'campaigns' && <CampaignsPage onOpenDonate={handleOpenDonate} />}
        {activeTab === 'campaign-details' && (
          <CampaignDetailsPage
            onOpenDonate={handleOpenDonate}
            onBack={() => setActiveTab('campaigns')}
          />
        )}
        {activeTab === 'work' && <WorkPage />}
        {activeTab === 'events' && <EventsPage onOpenDonate={handleOpenDonate} />}
        {activeTab === 'event-details' && (
          <EventDetailsPage onBack={() => setActiveTab('events')} />
        )}
        {activeTab === 'transparency' && (
          <TransparencyPage
            onVerifyReceipt={handleVerifyReceipt}
            onOpenReceiptModal={(r) => setSelectedReceipt(r)}
          />
        )}
        {activeTab === 'reports' && <ReportsPage />}
        {activeTab === 'team' && <TeamPage user={user} />}
        {activeTab === 'gallery' && <GalleryPage />}
        {activeTab === 'contact' && <ContactPage />}
        {activeTab === 'join' && <JoinUsPage />}
        {activeTab === 'verify-receipt' && verificationToken && (
          <ReceiptVerificationPage
            token={verificationToken}
            onBack={() => setActiveTab('home')}
            onOpenReceiptModal={(r) => setSelectedReceipt(r)}
          />
        )}
        {activeTab === '404' && <NotFoundPage onGoHome={() => setActiveTab('home')} />}
      </main>

      {/* Global Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenDonate={() => handleOpenDonate()}
      />

      {/* Mandatory Authentication (Register / Login) Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        promptMessage={authPrompt}
        onAuthSuccess={handleAuthSuccess}
        pendingIntent={pendingIntent}
      />

      {/* Public UPI Contribution Modal */}
      <DonationModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        defaultCampaign={donateCampaign}
        onReceiptGenerated={(r) => setSelectedReceipt(r)}
        user={user}
        onRequireAuth={(intent) => handleOpenAuth('register', 'Please register or sign in to transfer funds.', intent)}
      />

      {/* Member-Only Cash Contribution Modal */}
      {isCashOpen && (
        <CashContributionModal
          user={user}
          onClose={() => setIsCashOpen(false)}
          onSuccess={(r) => {
            setIsCashOpen(false);
            setSelectedReceipt(r);
          }}
        />
      )}

      {/* Make Changes & Committee Management Modal */}
      <ManagementModal
        isOpen={isManagementOpen}
        onClose={() => setIsManagementOpen(false)}
        user={user}
      />

      {/* Digital Receipt Modal with QR and PDF */}
      {selectedReceipt && (
        <ReceiptModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          onNavigateToVerify={(token) => handleVerifyReceipt(token)}
        />
      )}
    </div>
  );
};

export default App;
