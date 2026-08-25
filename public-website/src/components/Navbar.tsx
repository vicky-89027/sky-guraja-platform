import React, { useState } from 'react';
import { SkyLogo } from './SkyLogo';
import {
  Menu,
  X,
  User,
  LogOut,
  UserCheck,
  ChevronDown,
  Edit3,
  Coins
} from 'lucide-react';
import { AuthUser } from './AuthModal';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenDonate: (campaignName?: string) => void;
  onOpenAuth: (mode?: 'login' | 'register', prompt?: string, intent?: string) => void;
  onOpenManagement: () => void;
  user: AuthUser | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenDonate,
  onOpenAuth,
  onOpenManagement,
  user,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'campaigns', label: 'CAMPAIGNS' },
    { id: 'work', label: 'OUR WORK' },
    { id: 'events', label: 'EVENTS' },
    { id: 'transparency', label: 'TRANSPARENCY' },
    { id: 'reports', label: 'REPORTS' },
    { id: 'team', label: 'TEAM' },
    { id: 'gallery', label: 'GALLERY' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSupportUsClick = () => {
    if (!user) {
      onOpenAuth('register', 'Please register or sign in first to transfer funds and receive an official E-Receipt.', 'transfer_funds');
    } else {
      onOpenDonate();
    }
  };

  const handleMakeChangesClick = () => {
    if (!user) {
      onOpenAuth('login', 'Please sign in or register to record changes or manage committee records.', 'make_changes');
    } else {
      onOpenManagement();
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#050E1C]/95 backdrop-blur-md border-b border-amber-500/25 px-4 lg:px-8 py-3 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Monogram & Title */}
        <div className="cursor-pointer flex items-center gap-2.5" onClick={() => handleNavClick('home')}>
          <SkyLogo variant="icon" size="sm" />
          <div className="hidden sm:block text-left">
            <div className="text-sm font-black font-serif uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#FFFBEB] via-[#FBBF24] to-[#D97706] leading-none">
              SRI KRISHNA YADAV
            </div>
            <div className="text-[9px] font-extrabold tracking-[0.3em] text-amber-300 uppercase font-sans mt-0.5">
              YOUTH GURAJA
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links (Exact Match with Reference Image) */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs font-bold tracking-wider">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === link.id
                  ? 'text-amber-300 font-extrabold bg-amber-500/15 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-amber-300 hover:bg-white/5'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right Side Action Controls */}
        <div className="flex items-center gap-3">
          {/* Primary Gold CTA Button: SUPPORT US */}
          <button
            onClick={handleSupportUsClick}
            className="px-5 py-2 bg-gradient-to-r from-[#D4A244] via-[#F5BD55] to-[#C49132] hover:from-[#E5B869] hover:to-[#D4A244] text-slate-950 font-black text-xs tracking-wider uppercase rounded-xl shadow-[0_0_20px_rgba(212,162,68,0.4)] transition-all transform active:scale-95 flex items-center gap-1.5"
          >
            <Coins className="w-3.5 h-3.5 fill-slate-950" />
            <span>SUPPORT US</span>
          </button>

          {/* Committee Action / Member Account */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#08152B] hover:bg-[#102447] border border-amber-500/30 rounded-xl text-xs text-slate-200 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                  {user.fullName.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-bold text-white leading-none truncate max-w-[100px]">
                    {user.fullName.split(' ')[0]}
                  </div>
                  <div className="text-[9px] text-amber-400 font-mono leading-none mt-0.5">
                    {user.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#08152B] border border-amber-500/30 rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1 animate-fadeIn">
                  <div className="p-2 border-b border-white/10 text-left">
                    <div className="font-bold text-white truncate">{user.fullName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{user.phone}</div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px]">
                      {user.role}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenDonate();
                    }}
                    className="w-full text-left p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                  >
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span>Transfer Funds / Donate</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenManagement();
                    }}
                    className="w-full text-left p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4 text-cyan-400" />
                    <span>Make Changes / Committee</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 pt-2 border-t border-white/5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 bg-[#08152B] hover:bg-[#12274A] border border-white/15 text-slate-200 hover:text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Login</span>
              </button>

              <button
                onClick={() => onOpenAuth('register')}
                className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Trigger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-[#08152B] border border-white/10 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden pt-4 pb-3 border-t border-white/10 mt-3 space-y-2 bg-[#050E1C] rounded-2xl p-4 shadow-2xl">
          {user ? (
            <div className="p-3 bg-[#08152B] rounded-xl border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                  {user.fullName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-white text-xs">{user.fullName}</div>
                  <div className="text-[10px] text-amber-400 font-mono">{user.role}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pb-2">
              <button
                onClick={() => {
                  onOpenAuth('login');
                  setMobileMenuOpen(false);
                }}
                className="py-2 text-center bg-[#08152B] border border-white/15 text-white text-xs font-bold rounded-xl"
              >
                Member Sign In
              </button>
              <button
                onClick={() => {
                  onOpenAuth('register');
                  setMobileMenuOpen(false);
                }}
                className="py-2 text-center bg-amber-500 text-slate-950 text-xs font-bold rounded-xl"
              >
                Register
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-1.5 pb-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all ${
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
                handleSupportUsClick();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-gradient-to-r from-[#D4A244] via-[#F5BD55] to-[#C49132] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow text-center flex items-center justify-center gap-2"
            >
              <Coins className="w-4 h-4 fill-slate-950" />
              <span>SUPPORT US / TRANSFER FUNDS</span>
            </button>

            <button
              onClick={() => {
                handleMakeChangesClick();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 bg-[#08152B] border border-amber-500/30 text-amber-300 text-xs rounded-xl text-center flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-4 h-4" />
              <span>Make Changes (Committee)</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
