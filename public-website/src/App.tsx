import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DonationModal } from './components/DonationModal';
import { ReceiptModal } from './components/ReceiptModal';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { TransparencyPage } from './pages/TransparencyPage';
import { WorkPage } from './pages/WorkPage';
import { EventsPage } from './pages/EventsPage';
import { TeamPage } from './pages/TeamPage';
import { GalleryPage } from './pages/GalleryPage';
import { ReportsPage } from './pages/ReportsPage';
import { ContactPage } from './pages/ContactPage';
import { JoinUsPage } from './pages/JoinUsPage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [donateCampaign, setDonateCampaign] = useState<string | undefined>(undefined);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const handleOpenDonate = (campaignName?: string) => {
    setDonateCampaign(campaignName);
    setIsDonateOpen(true);
  };

  const handleVerifyReceipt = (receiptNumber: string) => {
    setSelectedReceipt(receiptNumber);
  };

  return (
    <div className="min-h-screen bg-[#061224] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Sticky Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDonate={handleOpenDonate}
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
        {activeTab === 'work' && <WorkPage />}
        {activeTab === 'events' && <EventsPage onOpenDonate={handleOpenDonate} />}
        {activeTab === 'transparency' && <TransparencyPage onVerifyReceipt={handleVerifyReceipt} />}
        {activeTab === 'reports' && <ReportsPage />}
        {activeTab === 'team' && <TeamPage />}
        {activeTab === 'gallery' && <GalleryPage />}
        {activeTab === 'contact' && <ContactPage />}
        {activeTab === 'join' && <JoinUsPage />}
      </main>

      {/* Global Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenDonate={() => handleOpenDonate()}
      />

      {/* 5-Step Donation Modal */}
      <DonationModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        defaultCampaign={donateCampaign}
        onReceiptGenerated={(recNo) => setSelectedReceipt(recNo)}
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
