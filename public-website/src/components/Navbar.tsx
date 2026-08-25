import React, { useState } from 'react';
import { SkyLogo } from './SkyLogo';
import { Heart, Menu, X, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenDonate: (campaignName?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenDonate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'work', label: 'Our Work' },
    { id: 'events', label: 'Events' },
    { id: 'transparency', label: 'Transparency' },
    { id: 'reports', label: 'Reports' },
    { id: 'team', label: 'Team' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
    { id: 'join', label: 'Join Us' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#061224]/95 backdrop-blur-lg border-b border-amber-500/20 px-4 lg:px-10 py-3 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Identity */}
        <div className="cursor-pointer" onClick={() => handleNavClick('home')}>
          <SkyLogo variant="horizontal" size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden xl:flex items-center gap-1 text-xs font-semibold text-slate-300">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === link.id
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => onOpenDonate()}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all transform active:scale-95"
          >
            <Heart className="w-3.5 h-3.5 fill-slate-950" />
            <span>SUPPORT US</span>
          </button>

          <a
            href="http://localhost:5000"
            target="_blank"
            rel="noreferrer"
            title="Open Internal Committee Portal"
            className="flex items-center gap-1 px-3 py-2 bg-[#0B1B36] hover:bg-[#12274A] border border-white/15 text-slate-300 hover:text-white text-xs font-medium rounded-xl transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Committee App</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="xl:hidden flex items-center gap-2">
          <button
            onClick={() => onOpenDonate()}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow"
          >
            Donate
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-[#0B1B36] border border-white/10 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden pt-4 pb-3 border-t border-white/10 mt-3 space-y-1 bg-[#061224] rounded-2xl p-4 shadow-2xl">
          <div className="grid grid-cols-2 gap-1.5 pb-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === link.id
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenDonate();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow text-center flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-slate-950" />
              <span>SUPPORT A CAMPAIGN</span>
            </button>
            <a
              href="http://localhost:5000"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 bg-[#0B1B36] text-slate-300 text-xs rounded-xl text-center border border-white/10 flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Internal Committee Portal</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
