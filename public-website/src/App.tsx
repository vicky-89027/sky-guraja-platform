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
import { CheckoutPage } from './pages/CheckoutPage';
import { AuthPage } from './pages/AuthPage';
import { LegalPolicyPage } from './pages/LegalPolicyPage';
import { RealReceipt, getRealReceiptsList } from './services/receiptService';

import { OFFICIAL_MEMBERS } from './components/AuthModal';
import { getTeamMembers, isCommitteeMember } from './services/teamService';

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

  // Check URL search params or pathname for QR verification (?verify=TOKEN, /verify/receipt/TOKEN, etc.)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const pathname = window.location.pathname;

      let verifyToken = urlParams.get('verify') || urlParams.get('token') || urlParams.get('receipt');

      // Check pathname patterns like /verify/receipt/:token or /verify/:token or /receipt/:token
      if (!verifyToken && pathname) {
        const verifyMatch = pathname.match(/^\/(?:verify\/receipt|verify|receipt)\/([^/]+)/i);
        if (verifyMatch && verifyMatch[1]) {
          verifyToken = decodeURIComponent(verifyMatch[1]);
        }
      }

      if (verifyToken) {
        setVerificationToken(verifyToken);
        setActiveTab('verify-receipt');
      } else if (
        urlParams.get('page') === 'checkout' ||
        urlParams.get('page') === 'donate' ||
        urlParams.get('donate') !== null ||
        urlParams.get('checkout') !== null
      ) {
        setActiveTab('checkout');
      } else if (urlParams.get('page') === 'login' || urlParams.get('login') !== null) {
        setActiveTab('login');
      } else if (urlParams.get('page') === 'register' || urlParams.get('register') !== null) {
        setActiveTab('register');
      } else if (urlParams.get('page') === 'terms' || pathname.includes('/terms')) {
        setActiveTab('terms');
      } else if (urlParams.get('page') === 'privacy' || pathname.includes('/privacy')) {
        setActiveTab('privacy');
      } else if (urlParams.get('page') === 'refund' || pathname.includes('/refund')) {
        setActiveTab('refund');
      } else if (urlParams.get('page') === 'shipping' || pathname.includes('/shipping')) {
        setActiveTab('shipping');
      } else if (urlParams.get('page') === 'policies' || urlParams.get('page') === 'legal') {
        setActiveTab('terms');
      }

      const syncActiveSession = () => {
        const saved = localStorage.getItem('sky_user');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const liveMembers = getTeamMembers();
            const cleanPhone = (parsed.phone || '').replace(/[^0-9]/g, '');
            const cleanUsername = (parsed.username || '').toLowerCase().trim();
            const cleanFullName = (parsed.fullName || '').toLowerCase().trim();

            // Strict matching by Phone, Username, or Full Name only
            const matched = liveMembers.find(
              (m) =>
                (cleanPhone && m.phone && m.phone.replace(/[^0-9]/g, '') === cleanPhone) ||
                (cleanUsername && m.username && m.username.toLowerCase() === cleanUsername) ||
                (cleanFullName && m.name.toLowerCase() === cleanFullName)
            ) || OFFICIAL_MEMBERS.find(
              (m) =>
                (cleanPhone && m.phone && m.phone.replace(/[^0-9]/g, '') === cleanPhone) ||
                (cleanUsername && m.username && m.username.toLowerCase() === cleanUsername) ||
                (cleanFullName && m.fullName.toLowerCase() === cleanFullName)
            );

            if (matched) {
              parsed.fullName = (matched as any).name || (matched as any).fullName;
              parsed.role = matched.role;
              parsed.roleTitle = (matched as any).roleTitle || matched.role;
              if (matched.image) {
                parsed.image = matched.image;
                parsed.photoUrl = matched.image;
              }
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
    setActiveTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCashContribution = () => {
    const authorized = isCommitteeMember(user);

    if (!authorized) {
      handleOpenAuth('login', 'Please sign in with your authorized Committee Member / Leadership account to record cash contributions.', 'record_cash');
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
        {(activeTab === 'checkout' || activeTab === 'donate') && (
          <CheckoutPage
            user={user}
            onOpenAuth={handleOpenAuth}
            onNavigateHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            initialCampaignTitle={donateCampaign}
          />
        )}
        {(activeTab === 'login' || activeTab === 'register' || activeTab === 'auth') && (
          <AuthPage
            initialMode={activeTab === 'register' ? 'register' : 'login'}
            user={user}
            onAuthSuccess={(authUser) => {
              setUser(authUser);
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
        {activeTab === 'terms' && <LegalPolicyPage initialPolicy="terms" onNavigateTab={setActiveTab} />}
        {activeTab === 'privacy' && <LegalPolicyPage initialPolicy="privacy" onNavigateTab={setActiveTab} />}
        {activeTab === 'refund' && <LegalPolicyPage initialPolicy="refund" onNavigateTab={setActiveTab} />}
        {activeTab === 'shipping' && <LegalPolicyPage initialPolicy="shipping" onNavigateTab={setActiveTab} />}
        {(activeTab === 'policies' || activeTab === 'legal' || activeTab === 'grievance') && (
          <LegalPolicyPage initialPolicy={activeTab === 'grievance' ? 'contact' : 'terms'} onNavigateTab={setActiveTab} />
        )}
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
