import React, { useState, useEffect } from 'react';
import {
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
  KeyRound,
  Sparkles,
  AlertTriangle,
  HeartHandshake,
  BadgeCheck,
  Building
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SkyLogo } from '../components/SkyLogo';
import { AuthUser, OFFICIAL_MEMBERS } from '../components/AuthModal';
import { getMemberPhoto, getTeamMembers } from '../services/teamService';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  user: AuthUser | null;
  onAuthSuccess: (user: AuthUser, intent?: string) => void;
  onNavigateHome: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  user,
  onAuthSuccess,
  onNavigateHome
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Registration form state
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regVillage, setRegVillage] = useState('Guraja');
  const [regCategory, setRegCategory] = useState('YOUTH_VOLUNTEER');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [regTerms, setRegTerms] = useState(true);
  const [regError, setRegError] = useState<string | null>(null);
  const [regLoading, setRegLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    const inputId = loginIdentifier.trim().toLowerCase();
    const cleanDigits = inputId.replace(/[^0-9]/g, '');
    const cleanAlpha = inputId.replace(/[^a-z0-9]/g, '');
    const inputPass = loginPassword.trim();
    const isStrictPassword = inputPass.toUpperCase() === 'SRIKRISHNA26';

    // 1. Dynamic Match against Live Committee Roster (including newly added members by Name or Position)
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
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      onAuthSuccess(liveAuthUser);
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
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        onAuthSuccess(authUser);
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
        fullName: loginIdentifier.includes('@') ? 'Sri Krishna Yadav Member' : loginIdentifier,
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
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      onAuthSuccess(generatedUser);
      setLoginLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
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
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        onAuthSuccess(data.user);
      } else {
        setLoginError(data.message || 'Invalid credentials. Password is SRIKRISHNA26.');
      }
    } catch {
      setLoginError('Invalid credentials. Password is SRIKRISHNA26.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    const cleanPhone = regPhone.replace(/[^0-9]/g, '');
    if (!regFullName.trim() || cleanPhone.length < 10) {
      setRegError('Please provide full name and a valid 10-digit mobile number.');
      return;
    }

    if (regPassword.length < 4) {
      setRegError('Password must be at least 4 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Password and Confirm Password do not match.');
      return;
    }

    if (!regTerms) {
      setRegError('Please accept the Sri Krishna Yadav Youth Guraja community guidelines.');
      return;
    }

    setRegLoading(true);

    try {
      const newUser: AuthUser = {
        id: `usr-${Date.now().toString().slice(-6)}`,
        fullName: regFullName.trim(),
        phone: cleanPhone,
        email: regEmail.trim() || `${cleanPhone}@skyguraja.org`,
        username: regFullName.trim().toLowerCase().replace(/\s+/g, '_'),
        role: 'MEMBER',
        roleTitle: `👥 ${regCategory.replace('_', ' ')}`,
        village: regVillage.trim() || 'Guraja',
        image: '/images/gallery/guraja_youth_volunteers_group.png'
      };

      localStorage.setItem('sky_token', `jwt_token_${newUser.username}`);
      localStorage.setItem('sky_user', JSON.stringify(newUser));

      // Sync registration to server
      try {
        fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: newUser.fullName,
            phone: newUser.phone,
            email: newUser.email,
            username: newUser.username,
            password: regPassword,
            village: newUser.village
          })
        }).catch(() => {});
      } catch {}

      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      onAuthSuccess(newUser);
    } catch (err: any) {
      setRegError(err.message || 'Failed to complete registration.');
    } finally {
      setRegLoading(false);
    }
  };

  const handle1ClickLogin = (member: typeof OFFICIAL_MEMBERS[0]) => {
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
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    onAuthSuccess(authUser);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-24 selection:bg-amber-500 selection:text-slate-950">
      {/* Header Banner - White & Deep Navy Gradient with Gold Accents */}
      <div className="relative bg-[#050E1C] border-b border-amber-500/30 py-10 px-4 sm:px-6 lg:px-8 text-center text-white overflow-hidden shadow-xl">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none mix-blend-screen"
          style={{ backgroundImage: `url('/images/team_header_krishna_bg.png')` }}
        />
        <div className="relative max-w-3xl mx-auto flex flex-col items-center">
          <div className="mb-4">
            <SkyLogo variant="full" size="md" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Committee & Member Authentication Portal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 tracking-tight">
            {mode === 'login' ? 'Member & Leadership Sign In' : 'New Member Registration'}
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl">
            Access transparent village financial accounts, digital cash handover recording, and community seva management for Sri Krishna Yadav Youth Guraja.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Access Protocol
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
              <BadgeCheck className="w-4 h-4 text-amber-400" />
              Guraja Village, AP
            </span>
          </div>
        </div>
      </div>

      {/* Main Container - Clean White Theme */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl space-y-6">
          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setLoginError(null);
              }}
              className={`py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-[#D4A244] via-[#F5BD55] to-[#C49132] text-slate-950 shadow-md transform scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Member Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('register');
                setRegError(null);
              }}
              className={`py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-[#D4A244] via-[#F5BD55] to-[#C49132] text-slate-950 shadow-md transform scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>New Registration</span>
            </button>
          </div>

          {/* Form Content */}
          {mode === 'login' ? (
            /* =========================================================================
               SIGN IN FORM (CLEAN WHITE THEME)
               ========================================================================= */
            <div className="space-y-6 animate-fadeIn">
              {loginError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-shake shadow-sm">
                  <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Authentication Notice: </span>
                    {loginError}
                  </div>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Member Name / Position (President/Secretary) / Mobile <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Srinu Yadav, President, Manikanta, or 9848022222"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-sm font-semibold text-slate-900 transition-all outline-none"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    You can enter your name (e.g. <span className="font-semibold text-slate-700">Srinu</span>), designation (e.g. <span className="font-semibold text-slate-700">President</span>), or 10-digit mobile.
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Password <span className="text-rose-600">*</span>
                    </label>
                    <span className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Default Key: SRIKRISHNA26
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showLoginPass ? 'text' : 'password'}
                      required
                      placeholder="Enter account password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-sm font-semibold text-slate-900 transition-all outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPass(!showLoginPass)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700"
                    >
                      {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#D4A244] via-[#F5BD55] to-[#C49132] hover:from-[#E5B869] hover:to-[#D4A244] text-slate-950 font-serif font-black text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {loginLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating Member...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 fill-slate-950" />
                      <span>Sign In to Committee Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* 1-Click Quick Sign In Roster */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Quick 1-Click Committee Sign In
                  </span>
                  <span className="text-[11px] text-slate-500">Tap to log in instantly</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {OFFICIAL_MEMBERS.slice(0, 8).map((m) => {
                    const photo = getMemberPhoto(m.fullName || m.phone || m.role);
                    return (
                      <button
                        type="button"
                        key={m.username}
                        onClick={() => handle1ClickLogin(m)}
                        className="p-2.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-400 rounded-2xl text-left transition-all group shadow-sm flex flex-col items-center text-center"
                      >
                        <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-amber-600 mb-1.5 shadow-sm">
                          <img
                            src={photo}
                            alt={m.fullName}
                            className="w-full h-full object-cover object-top rounded-full"
                          />
                        </div>
                        <div className="font-bold text-slate-900 text-xs truncate w-full group-hover:text-amber-800">
                          {m.fullName.split(' ')[0]}
                        </div>
                        <div className="text-[9px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded mt-0.5 font-mono">
                          {m.role.replace('_', ' ')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="text-center pt-2 text-xs text-slate-500">
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
            /* =========================================================================
               REGISTRATION FORM (CLEAN WHITE THEME)
               ========================================================================= */
            <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fadeIn">
              {regError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-shake shadow-sm">
                  <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Registration Error: </span>
                    {regError}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name (As per Govt ID) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sri Rama Krishna Yadav"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-sm font-semibold text-slate-900 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mobile Number (10 Digits) <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-2.5 flex items-center gap-1 text-slate-500 font-semibold text-sm">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="98480 12345"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full pl-16 pr-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-sm font-semibold text-slate-900 transition-all outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      placeholder="name@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-sm font-medium text-slate-900 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Native Village / Town <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="Guraja"
                      value={regVillage}
                      onChange={(e) => setRegVillage(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-sm font-semibold text-slate-900 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Membership Category
                  </label>
                  <select
                    value={regCategory}
                    onChange={(e) => setRegCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 transition-all outline-none"
                  >
                    <option value="YOUTH_VOLUNTEER">Youth Volunteer</option>
                    <option value="ACTIVE_DONOR">Active Seva Donor</option>
                    <option value="CULTURAL_MEMBER">Cultural & Festival Member</option>
                    <option value="VILLAGE_DEVOTEE">Guraja Village Devotee</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Create Password <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showRegPass ? 'text' : 'password'}
                      required
                      placeholder="Min. 4 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-sm font-semibold text-slate-900 transition-all outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPass(!showRegPass)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700"
                    >
                      {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confirm Password <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showRegPass ? 'text' : 'password'}
                      required
                      placeholder="Confirm password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-sm font-semibold text-slate-900 transition-all outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-1 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="pageRegTerms"
                  checked={regTerms}
                  onChange={(e) => setRegTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="pageRegTerms" className="text-[11px] text-slate-600 leading-snug">
                  I agree to Sri Krishna Yadav Youth Guraja community guidelines, transparency charter, and verified digital e-receipt system.
                </label>
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-3.5 bg-gradient-to-r from-[#D4A244] via-[#F5BD55] to-[#C49132] hover:from-[#E5B869] hover:to-[#D4A244] text-slate-950 font-serif font-black text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {regLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Registering New Account...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration & Join</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-1 text-xs text-slate-500">
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
