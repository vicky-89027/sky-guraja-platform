import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DonationModal } from './components/DonationModal';
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

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [user, setUser] = useState<AuthUser | null>(null);

  // Modals state
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [donateCampaign, setDonateCampaign] = useState<string | undefined>(undefined);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authPrompt, setAuthPrompt] = useState<string | undefined>(undefined);
  const [pendingIntent, setPendingIntent] = useState<string | undefined>(undefined);

  const [isManagementOpen, setIsManagementOpen] = useState(false);

  // Load existing user session from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sky_user');
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleOpenDonate = (campaignName?: string) => {
    if (!user) {
      setDonateCampaign(campaignName);
      setAuthMode('register');
      setAuthPrompt('Please register or sign in first to transfer funds and record verified contributions.');
      setPendingIntent('transfer_funds');
      setIsAuthOpen(true);
      return;
    }
    setDonateCampaign(campaignName);
    setIsDonateOpen(true);
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
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sky_user');
    localStorage.removeItem('sky_token');
    setUser(null);
  };

  const handleVerifyReceipt = (receiptNumber: string) => {
    setSelectedReceipt(receiptNumber);
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
        {activeTab === 'transparency' && <TransparencyPage onVerifyReceipt={handleVerifyReceipt} />}
        {activeTab === 'reports' && <ReportsPage />}
        {activeTab === 'team' && <TeamPage />}
        {activeTab === 'gallery' && <GalleryPage />}
        {activeTab === 'contact' && <ContactPage />}
        {activeTab === 'join' && <JoinUsPage />}
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

      {/* Fund Transfer & Donation Modal */}
      <DonationModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        defaultCampaign={donateCampaign}
        onReceiptGenerated={(recNo) => setSelectedReceipt(recNo)}
        user={user}
        onRequireAuth={(intent) => handleOpenAuth('register', 'Please register or sign in to transfer funds.', intent)}
      />

      {/* Make Changes & Committee Management Modal */}
      <ManagementModal
        isOpen={isManagementOpen}
        onClose={() => setIsManagementOpen(false)}
        user={user}
      />

      {/* Digital Receipt Modal with QR and PDF */}
      <ReceiptModal
        receiptNumber={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
};

export default App;
