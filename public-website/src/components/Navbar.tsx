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
  Coins,
  ShieldCheck
} from 'lucide-react';
import { AuthUser } from './AuthModal';
import { getMemberPhoto } from '../services/teamService';

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

  const livePhoto = user ? getMemberPhoto(user.fullName || user.phone || user.role || '') : '';
  const avatarPhoto =
    (livePhoto && !livePhoto.includes('guraja_youth_volunteers_group.png'))
      ? livePhoto
      : (user?.image && !user.image.includes('guraja_youth_volunteers_group.png'))
      ? user.image
      : (user?.photoUrl && !user.photoUrl.includes('guraja_youth_volunteers_group.png'))
      ? user.photoUrl
      : livePhoto || user?.image || user?.photoUrl || '/images/gallery/guraja_youth_volunteers_group.png';

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
    { id: 'checkout', label: 'CHECKOUT' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSupportUsClick = () => {
    setActiveTab('checkout');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

          {/* Committee Action / Member Account with Member Photo Icon & Label */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 bg-[#08152B] hover:bg-[#0D2142] border-2 border-amber-500/40 hover:border-amber-400 rounded-2xl text-xs text-slate-200 transition-all shadow-[0_0_15px_rgba(245,158,11,0.15)] group"
                title={`Logged in as ${user.fullName} (${user.role})`}
              >
                {/* Member Photo Icon with Gold Ring Frame */}
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full p-0.5 bg-gradient-to-tr from-[#B38020] via-[#F5BD55] to-[#D4A244] shadow-md flex-shrink-0">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
                    {avatarPhoto ? (
                      <img
                        src={avatarPhoto}
                        alt={user.fullName}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          // Fallback to initial
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="font-black text-amber-300 text-xs font-serif">
                        {user.fullName.charAt(0)}
                      </span>
                    )}
                  </div>
                  {/* Verified Online Green Pulse Indicator */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#08152B] rounded-full shadow-sm" />
                </div>

                {/* Member Label */}
                <div className="text-left hidden md:block">
                  <div className="flex items-center gap-1">
                    <span className="font-black text-white text-xs leading-none truncate max-w-[130px] group-hover:text-amber-300 transition-colors">
                      {user.fullName}
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.2 rounded leading-none font-mono">
                      {user.role}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono leading-none">
                      Guraja
                    </span>
                  </div>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#08152B] border-2 border-amber-500/40 rounded-2xl shadow-2xl p-2.5 z-50 text-xs space-y-1.5 animate-fadeIn">
                  {/* Dropdown Profile Header with Photo */}
                  <div className="p-3 bg-[#050F21] rounded-xl border border-white/10 text-left flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-amber-600 shadow-md flex-shrink-0">
                      <img
                        src={avatarPhoto}
                        alt={user.fullName}
                        className="w-full h-full object-cover object-top rounded-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white text-xs truncate">{user.fullName}</div>
                      <div className="text-[10px] text-amber-300 font-mono truncate">{user.phone}</div>
                      <div className="mt-1 flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-500/30">
                          {user.role}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">SKY Guraja</span>
                      </div>
                    </div>
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
                    className="w-full text-left p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 pt-2 border-t border-white/5 font-semibold"
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
            <div className="p-3 bg-[#08152B] rounded-xl border border-amber-500/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-amber-600 flex-shrink-0">
                  <img
                    src={user.image || user.photoUrl || '/images/gallery/guraja_youth_volunteers_group.png'}
                    alt={user.fullName}
                    className="w-full h-full object-cover object-top rounded-full"
                  />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">{user.fullName}</div>
                  <div className="text-[10px] text-amber-300 font-mono flex items-center gap-1">
                    <span>{user.role}</span>
                    <span>•</span>
                    <span>{user.phone}</span>
                  </div>
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
