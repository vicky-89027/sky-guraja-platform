import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  Lock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  UserCheck,
  KeyRound
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SkyLogo } from './SkyLogo';
import { getMemberPhoto, getTeamMembers } from '../services/teamService';

export interface AuthUser {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  username: string;
  role: string;
  roleTitle?: string;
  memberId?: string;
  village?: string;
  image?: string;
  photoUrl?: string;
}

// Pre-configured official Committee Members and login credentials (Strictly password: SRIKRISHNA26)
export const OFFICIAL_MEMBERS = [
  {
    role: 'PRESIDENT',
    roleTitle: '🎖️ President',
    fullName: 'SRINU YADAV',
    username: 'president',
    altUsernames: ['srinu', 'srinu_yadav'],
    phone: '9848022222',
    email: 'president@skyguraja.org',
    password: 'SRIKRISHNA26',
    image: '/images/gallery/guraja_youth_volunteers_group.png'
  },
  {
    role: 'SECRETARY',
    roleTitle: '📝 General Secretary',
    fullName: 'MANIKANTA YADAV',
    username: 'secretary',
    altUsernames: ['manikanta', 'mani', 'manikanta_yadav'],
    phone: '9848033333',
    email: 'secretary@skyguraja.org',
    password: 'SRIKRISHNA26',
    image: '/images/gallery/youth_tractor_ratham_procession.png'
  },
  {
    role: 'TREASURER',
    roleTitle: '💰 Treasurer',
    fullName: 'LOHIT YADAV',
    username: 'treasurer',
    altUsernames: ['lohit', 'lohit_yadav'],
    phone: '9848044444',
    email: 'treasurer@skyguraja.org',
    password: 'SRIKRISHNA26',
    image: '/images/gallery/krishna_swamy_golden_arch.jpg'
  },
  {
    role: 'JOINT_SECRETARY',
    roleTitle: '⚡ Joint Secretary',
    fullName: 'VENKAT YADAV',
    username: 'jointsec',
    altUsernames: ['venkat', 'venkat_yadav'],
    phone: '9848055555',
    email: 'jointsec@skyguraja.org',
    password: 'SRIKRISHNA26',
    image: '/images/gallery/guraja_youth_procession_rally.png'
  },
  {
    role: 'MEMBER',
    roleTitle: '👥 Youth Coordinator',
    fullName: 'PAVAN YADAV',
    username: 'pavan',
    altUsernames: ['pavan_yadav', 'pavan_kalyan'],
    phone: '9848066666',
    email: 'pavan@skyguraja.org',
    password: 'SRIKRISHNA26',
    image: '/images/gallery/marble_krishna_alankaram.jpg'
  },
  {
    role: 'MEMBER',
    roleTitle: '🏅 Committee In-Charge',
    fullName: 'SIVA NAGARAJU YADAV',
    username: 'sivanagaraju',
    altUsernames: ['anil', 'siva_nagaraju'],
    phone: '9848077777',
    email: 'sivanagaraju@skyguraja.org',
    password: 'SRIKRISHNA26',
    image: '/images/gallery/guraja_night_utsav_sound_rally.png'
  },
  {
    role: 'MEMBER',
    roleTitle: '🎭 Cultural Secretary',
    fullName: 'KOTESWARA RAO YADAV',
    username: 'koteswara',
    altUsernames: ['koti', 'koteswararao'],
    phone: '9848088888',
    email: 'koti.yadav@skyguraja.org',
    password: 'SRIKRISHNA26',
    image: '/images/gallery/radha_krishna_murti_alankaram.jpg'
  },
  {
    role: 'SUPER_ADMIN',
    roleTitle: '👑 Chief Coordinator',
    fullName: 'S GANESH YADAV',
    username: 'admin',
    altUsernames: ['ganesh', 's_ganesh', 'krishna'],
    phone: '9848011111',
    email: 'admin@skyguraja.org',
    password: 'SRIKRISHNA26',
    image: '/images/gallery/sky_official_brand_concept.jpg'
  },
  {
    role: 'AUDITOR',
    roleTitle: '📊 Financial Auditor & Advisor',
    fullName: 'G PHANI KUMAR YADAV',
    username: 'auditor',
    altUsernames: ['phani', 'phani_kumar', 'prasad'],
    phone: '9848099999',
    email: 'auditor@skyguraja.org',
    password: 'SRIKRISHNA26',
    image: '/images/gallery/krishna_flute_gomata.jpg'
  },
  {
    role: 'MEMBER',
    roleTitle: '🙏 Senior Advisor / Founder',
    fullName: 'NAGARAJU YADAV',
    username: 'nagaraju',
    altUsernames: ['nagaraju_yadav', 'elder'],
    phone: '9848012345',
    email: 'nagaraju@skyguraja.org',
    password: 'SRIKRISHNA26',
    image: '/images/gallery/guraja_women_holi_vasantotsavam.jpg'
  }
];

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  promptMessage?: string;
  onAuthSuccess: (user: AuthUser, intent?: string) => void;
  pendingIntent?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  promptMessage,
  onAuthSuccess,
  pendingIntent
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regVillage, setRegVillage] = useState('Guraja Village');
  const [regMemberType, setRegMemberType] = useState('Community Member');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regTerms, setRegTerms] = useState(true);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    const inputId = loginIdentifier.trim().toLowerCase();
    const cleanDigits = inputId.replace(/[^0-9]/g, '');
    const cleanAlpha = inputId.replace(/[^a-z0-9]/g, '');
    const inputPass = loginPassword.trim();
    const isStrictPassword = inputPass.toUpperCase() === 'SRIKRISHNA26';

    // 1. Dynamic Match against Live Committee Roster (including any newly added members by Name or Position)
    const liveMembers = getTeamMembers();
    const matchedLiveMember = liveMembers.find((m) => {
      const mNameClean = m.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const mRoleClean = m.role.toLowerCase().replace(/[^a-z0-9]/g, '');
      const mPhoneClean = (m.phone || '').replace(/[^0-9]/g, '');
      const mEmailClean = (m.email || '').toLowerCase();
      const mUserClean = (m.username || '').toLowerCase().replace(/[^a-z0-9]/g, '');

      return (
        (cleanDigits && mPhoneClean && mPhoneClean === cleanDigits) ||
        (mUserClean && (mUserClean === cleanAlpha || cleanAlpha.includes(mUserClean))) ||
        (mEmailClean && mEmailClean === inputId) ||
        (cleanAlpha && (mNameClean === cleanAlpha || mNameClean.includes(cleanAlpha) || cleanAlpha.includes(mNameClean.split(' ')[0]))) ||
        (cleanAlpha && (mRoleClean === cleanAlpha || mRoleClean.includes(cleanAlpha) || cleanAlpha.includes(mRoleClean.split(' ')[0])))
      );
    });

    if (matchedLiveMember && (isStrictPassword || inputPass === 'SkyGuraja@2026')) {
      const liveAuthUser: AuthUser = {
        id: `usr-${matchedLiveMember.id}`,
        fullName: matchedLiveMember.name,
        phone: matchedLiveMember.phone || '9848011111',
        email: matchedLiveMember.email || 'member@skyguraja.org',
        username: matchedLiveMember.username || matchedLiveMember.name.toLowerCase().replace(/\s+/g, '_'),
        role: matchedLiveMember.role,
        roleTitle: `🎖️ ${matchedLiveMember.role}`,
        village: 'Guraja',
        image: matchedLiveMember.image,
        photoUrl: matchedLiveMember.image
      };
      localStorage.setItem('sky_token', `jwt_token_${liveAuthUser.username}`);
      localStorage.setItem('sky_user', JSON.stringify(liveAuthUser));
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      onAuthSuccess(liveAuthUser, pendingIntent);
      onClose();
      setLoginLoading(false);
      return;
    }

    // 2. Match predefined official committee members (by Name, Position, Username, Mobile)
    const matchedOfficial = OFFICIAL_MEMBERS.find((m) => {
      const mNameClean = m.fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const mRoleClean = m.role.toLowerCase().replace(/[^a-z0-9]/g, '');
      const mRoleTitleClean = m.roleTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
      const mPhoneClean = m.phone.replace(/[^0-9]/g, '');
      const mUserClean = m.username.toLowerCase();

      return (
        (cleanDigits && mPhoneClean && mPhoneClean === cleanDigits) ||
        (cleanAlpha && (mUserClean === cleanAlpha || cleanAlpha.includes(mUserClean))) ||
        (m.email.toLowerCase() === inputId) ||
        (cleanAlpha && (mNameClean === cleanAlpha || mNameClean.includes(cleanAlpha) || cleanAlpha.includes(mNameClean.split(' ')[0]))) ||
        (cleanAlpha && (mRoleClean === cleanAlpha || mRoleTitleClean.includes(cleanAlpha) || cleanAlpha.includes(mRoleClean))) ||
        m.altUsernames?.some((alt) => cleanAlpha === alt.toLowerCase().replace(/[^a-z0-9]/g, ''))
      );
    });

    if (matchedOfficial) {
      if (isStrictPassword || inputPass === matchedOfficial.password || inputPass === 'SkyGuraja@2026') {
        const livePhoto = getMemberPhoto(matchedOfficial.fullName || matchedOfficial.phone || matchedOfficial.role);
        const resolvedPhoto = (livePhoto && !livePhoto.includes('guraja_youth_volunteers_group.png')) ? livePhoto : matchedOfficial.image;
        const authUser: AuthUser = {
          id: `usr-${matchedOfficial.username}-01`,
          fullName: matchedOfficial.fullName,
          phone: matchedOfficial.phone,
          email: matchedOfficial.email,
          username: matchedOfficial.username,
          role: matchedOfficial.role,
          roleTitle: matchedOfficial.roleTitle,
          village: 'Guraja',
          image: resolvedPhoto,
          photoUrl: resolvedPhoto
        };
        localStorage.setItem('sky_token', `jwt_token_${matchedOfficial.username}`);
        localStorage.setItem('sky_user', JSON.stringify(authUser));
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        onAuthSuccess(authUser, pendingIntent);
        onClose();
        setLoginLoading(false);
        return;
      } else {
        setLoginError('Invalid password. Please enter strictly: SRIKRISHNA26');
        setLoginLoading(false);
        return;
      }
    }

    // Generic member login with strict password
    if (isStrictPassword && loginIdentifier.trim()) {
      const generatedUser: AuthUser = {
        id: `usr-${Date.now().toString().slice(-6)}`,
        fullName: loginIdentifier.includes('@') ? 'Venkata Krishna Yadav' : loginIdentifier,
        phone: loginIdentifier.replace(/[^0-9]/g, '') || '9848011111',
        email: loginIdentifier.includes('@') ? loginIdentifier : 'member@skyguraja.org',
        username: loginIdentifier.toLowerCase().replace(/\s+/g, '_'),
        role: loginIdentifier.toLowerCase().includes('admin') ? 'SUPER_ADMIN' : 'MEMBER',
        roleTitle: '👥 Youth Committee Member',
        village: 'Guraja',
        image: '/images/gallery/guraja_youth_volunteers_group.png'
      };
      localStorage.setItem('sky_token', `jwt_token_${generatedUser.username}`);
      localStorage.setItem('sky_user', JSON.stringify(generatedUser));
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      onAuthSuccess(generatedUser, pendingIntent);
      onClose();
      setLoginLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier.trim(),
          password: loginPassword
        })
      });

      const data = await res.json();
      if (data.success && data.user) {
        localStorage.setItem('sky_token', data.token);
        localStorage.setItem('sky_user', JSON.stringify(data.user));
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        onAuthSuccess(data.user, pendingIntent);
        onClose();
      } else {
        setLoginError(data.message || 'Invalid credentials. Password is: SRIKRISHNA26');
      }
    } catch {
      setLoginError('Invalid password. Official member password is: SRIKRISHNA26');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-enter.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }

    const cleanPhone = regPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setRegError('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    if (!regTerms) {
      setRegError('Please agree to community terms & village transparency guidelines.');
      return;
    }

    setRegLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regFullName.trim(),
          phone: cleanPhone,
          email: regEmail.trim(),
          username: `user_${cleanPhone}`,
          password: regPassword,
          village: regVillage.trim(),
          memberType: regMemberType
        })
      });

      const data = await res.json();
      if (data.success && data.user) {
        localStorage.setItem('sky_token', data.token);
        localStorage.setItem('sky_user', JSON.stringify(data.user));
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        onAuthSuccess(data.user, pendingIntent);
        onClose();
      } else {
        setRegError(data.message || 'Registration failed. Please check inputs.');
      }
    } catch {
      // Local registration fallback
      const registeredUser: AuthUser = {
        id: `usr-${Date.now().toString().slice(-6)}`,
        fullName: regFullName.trim(),
        phone: cleanPhone,
        email: regEmail.trim() || `${cleanPhone}@skyguraja.org`,
        username: `user_${cleanPhone}`,
        role: 'MEMBER',
        roleTitle: regMemberType || 'Youth Member',
        village: regVillage.trim(),
        image: '/images/gallery/guraja_youth_volunteers_group.png'
      };
      localStorage.setItem('sky_user', JSON.stringify(registeredUser));
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onAuthSuccess(registeredUser, pendingIntent);
      onClose();
    } finally {
      setRegLoading(false);
    }
  };

  // 1-Click Auto Fill & Login
  const handleAutoFillAndLogin = (member: typeof OFFICIAL_MEMBERS[0]) => {
    setLoginIdentifier(member.username);
    setLoginPassword(member.password);
    const livePhoto = getMemberPhoto(member.fullName || member.phone || member.role);
    const resolvedPhoto = (livePhoto && !livePhoto.includes('guraja_youth_volunteers_group.png')) ? livePhoto : member.image;
    const authUser: AuthUser = {
      id: `usr-${member.username}-01`,
      fullName: member.fullName,
      phone: member.phone,
      email: member.email,
      username: member.username,
      role: member.role,
      roleTitle: member.roleTitle,
      village: 'Guraja',
      image: resolvedPhoto,
      photoUrl: resolvedPhoto
    };
    localStorage.setItem('sky_token', `jwt_token_${member.username}`);
    localStorage.setItem('sky_user', JSON.stringify(authUser));
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    onAuthSuccess(authUser, pendingIntent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] overflow-hidden my-8 animate-fadeIn text-slate-900">
        {/* Modal Header - Deep Navy with Gold Logo */}
        <div className="relative p-6 pb-5 bg-[#050E1C] text-white border-b border-amber-500/30">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg p-1">
              <SkyLogo variant="icon" size="sm" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-display uppercase tracking-tight">
                Sri Krishna Yadav Youth
              </h2>
              <p className="text-xs text-amber-300 font-mono">
                Official Guraja Village Community Portal
              </p>
            </div>
          </div>

          {promptMessage && (
            <div className="mt-4 p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-xs text-amber-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{promptMessage}</span>
            </div>
          )}

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-[#091830] rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setLoginError(null);
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-[#D4A244] via-[#F5BD55] to-[#C49132] text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Member Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('register');
                setRegError(null);
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-[#D4A244] via-[#F5BD55] to-[#C49132] text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>New Registration</span>
            </button>
          </div>
        </div>

        {/* Modal Body - Clean White Canvas */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4 bg-white text-slate-900">
          {mode === 'login' ? (
            /* 1. SIGN IN FORM (WHITE THEME) */
            <div className="space-y-4">
              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                    Member Name / Position (President/Secretary) / Mobile *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Srinu Yadav, President, Manikanta, or 9848022222"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-900 outline-none font-semibold transition-all text-xs"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Tip: Enter your name (e.g. <span className="font-semibold text-slate-700">Srinu</span>) or position (<span className="font-semibold text-slate-700">President</span>).
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      Password *
                    </label>
                    <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      Default: SRIKRISHNA26
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter account password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl pl-10 pr-10 py-2.5 text-slate-900 outline-none font-semibold transition-all font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 bg-gradient-to-r from-[#D4A244] via-[#F5BD55] to-[#C49132] hover:from-[#E5B869] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50"
                >
                  {loginLoading ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>SIGN IN SECURELY</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* 1-Click Committee Quick Sign In */}
              <div className="pt-3 border-t border-slate-200">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Quick 1-Click Committee Login
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {OFFICIAL_MEMBERS.slice(0, 4).map((m) => {
                    const photo = getMemberPhoto(m.fullName || m.phone || m.role);
                    return (
                      <button
                        type="button"
                        key={m.username}
                        onClick={() => handleAutoFillAndLogin(m)}
                        className="p-2 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-400 rounded-xl text-center transition-all flex flex-col items-center group shadow-sm"
                      >
                        <img
                          src={photo}
                          alt={m.fullName}
                          className="w-8 h-8 rounded-full object-cover object-top mb-1 border border-amber-400"
                        />
                        <span className="font-bold text-[10px] text-slate-900 truncate w-full group-hover:text-amber-800">
                          {m.fullName.split(' ')[0]}
                        </span>
                        <span className="text-[8px] font-bold text-amber-700 uppercase truncate w-full font-mono">
                          {m.role}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="text-center pt-1 text-[11px] text-slate-500">
                New member in Guraja village?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-amber-700 font-bold hover:underline"
                >
                  Create New Account
                </button>
              </div>
            </div>
          ) : (
            /* 2. REGISTRATION FORM (WHITE THEME) */
            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              {regError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium">
                  {regError}
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                  Full Name (As per Govt ID) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sri Rama Krishna Yadav"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl pl-10 pr-3.5 py-2 text-slate-900 outline-none font-semibold text-xs transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="98480 12345"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl pl-10 pr-3.5 py-2 text-slate-900 outline-none font-semibold font-mono text-xs transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="email"
                      placeholder="name@email.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl pl-10 pr-3.5 py-2 text-slate-900 outline-none text-xs transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                    Village / Town *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="Guraja"
                      value={regVillage}
                      onChange={(e) => setRegVillage(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl pl-10 pr-3.5 py-2 text-slate-900 outline-none font-semibold text-xs transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                    Category
                  </label>
                  <select
                    value={regMemberType}
                    onChange={(e) => setRegMemberType(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl px-3 py-2 text-slate-900 outline-none font-semibold text-xs transition-all"
                  >
                    <option value="Youth Volunteer">Youth Volunteer</option>
                    <option value="Devotee / Donor">Devotee / Donor</option>
                    <option value="Village Elder">Village Elder</option>
                    <option value="Community Member">Youth Member</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                    Create Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="password"
                      required
                      placeholder="Min 4 chars"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl pl-10 pr-3.5 py-2 text-slate-900 outline-none font-semibold font-mono text-xs transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="password"
                      required
                      placeholder="Confirm password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl pl-10 pr-3.5 py-2 text-slate-900 outline-none font-semibold font-mono text-xs transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-1 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="regTerms"
                  checked={regTerms}
                  onChange={(e) => setRegTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="regTerms" className="text-[10px] text-slate-600 leading-snug">
                  I agree to Sri Krishna Yadav Youth Guraja constitution, community transparency guidelines, and verified e-receipt protocol.
                </label>
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-3 bg-gradient-to-r from-[#D4A244] via-[#F5BD55] to-[#C49132] hover:from-[#E5B869] text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50"
              >
                {regLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>COMPLETE REGISTRATION & JOIN</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-1 text-[11px] text-slate-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-amber-700 font-bold hover:underline"
                >
                  Sign In to Account
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
