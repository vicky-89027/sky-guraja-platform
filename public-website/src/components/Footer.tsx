import React from 'react';
import { SkyLogo } from './SkyLogo';
import { Heart, MapPin, Phone, Mail, Globe, ShieldCheck } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenDonate: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenDonate }) => {
  const scrollToTab = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#030914] border-t border-amber-500/20 pt-12 pb-8 px-4 lg:px-12 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
        {/* Column 1: Identity & Motto */}
        <div className="space-y-4">
          <SkyLogo variant="compact" size="md" />
          <p className="text-slate-300 text-xs leading-relaxed">
            "United for Community. Inspired by Krishna. Working for a Better Tomorrow."
          </p>
          <div className="text-[11px] text-amber-300 font-mono font-semibold uppercase tracking-wider">
            Unity • Culture • Seva • Youth Power • Progress
          </div>
          <div className="pt-1">
            <button
              onClick={onOpenDonate}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-slate-950" />
              <span>Contribute to Youth Fund</span>
            </button>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white font-display uppercase tracking-wider">
            Organization
          </h4>
          <ul className="space-y-2">
            <li><button onClick={() => scrollToTab('home')} className="hover:text-amber-400 transition-colors">Home Page</button></li>
            <li><button onClick={() => scrollToTab('about')} className="hover:text-amber-400 transition-colors">About Us & Vision</button></li>
            <li><button onClick={() => scrollToTab('campaigns')} className="hover:text-amber-400 transition-colors">Active Campaigns</button></li>
            <li><button onClick={() => scrollToTab('work')} className="hover:text-amber-400 transition-colors">Our Completed Work</button></li>
            <li><button onClick={() => scrollToTab('events')} className="hover:text-amber-400 transition-colors">Community Events</button></li>
            <li><button onClick={() => scrollToTab('transparency')} className="hover:text-amber-400 transition-colors">Public Transparency</button></li>
            <li><button onClick={() => scrollToTab('reports')} className="hover:text-amber-400 transition-colors">Audit Reports</button></li>
          </ul>
        </div>

        {/* Column 3: Contact & Headquarters */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white font-display uppercase tracking-wider">
            Headquarters
          </h4>
          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>Yadav Youth Bhavan, Main Road, Guraja, Krishna District, Andhra Pradesh - 521321</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>+91 98480 22334 / +91 94401 55678</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>contact@skyguraja.org / support@skyguraja.org</span>
            </div>
          </div>
        </div>

        {/* Column 4: Social Channels & Integrity */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white font-display uppercase tracking-wider">
            Connect & Follow
          </h4>
          <div className="space-y-2">
            <a
              href="https://instagram.com/sky_youth_guraja"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2.5 bg-[#061224] rounded-xl border border-white/10 hover:border-amber-500/40 text-slate-300 hover:text-white transition-all"
            >
              <span>Instagram (@sky_youth_guraja)</span>
              <span className="text-[10px] text-amber-400 font-bold">2.5k Followers</span>
            </a>

            <a
              href="https://facebook.com/skyguraja"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2.5 bg-[#061224] rounded-xl border border-white/10 hover:border-amber-500/40 text-slate-300 hover:text-white transition-all"
            >
              <span>Facebook Page</span>
              <span className="text-[10px] text-emerald-400 font-bold">Community</span>
            </a>

            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-[11px] text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>100% Traceable & Audited Financial Ledger</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
        <div>
          © {new Date().getFullYear()} <b>Sri Krishna Yadav Youth Guraja (SKY)</b>. All Rights Reserved.
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => scrollToTab('transparency')} className="hover:text-amber-400">Transparency</button>
          <span>•</span>
          <button onClick={() => scrollToTab('reports')} className="hover:text-amber-400">Audit Reports</button>
          <span>•</span>
          <button onClick={() => scrollToTab('contact')} className="hover:text-amber-400">Contact</button>
        </div>
      </div>
    </footer>
  );
};
