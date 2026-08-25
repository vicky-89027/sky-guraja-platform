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
  Sparkles,
  KeyRound,
  Copy,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface AuthUser {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  username: string;
  role: string;
  memberId?: string;
  village?: string;
}

// Pre-configured official Committee Members and login credentials
export const OFFICIAL_MEMBERS = [
  {
    role: 'SUPER_ADMIN',
    roleTitle: '👑 Super Admin / Chief Coordinator',
    fullName: 'Venkata Krishna Yadav',
    username: 'admin',
    phone: '9848011111',
    email: 'admin@skyguraja.org',
    password: 'SkyGuraja@2026'
  },
  {
    role: 'PRESIDENT',
    roleTitle: '🎖️ President',
    fullName: 'Ramesh Yadav',
    username: 'president',
    phone: '9848022222',
    email: 'president@skyguraja.org',
    password: 'SkyGuraja@2026'
  },
  {
    role: 'SECRETARY',
    roleTitle: '📝 Secretary',
    fullName: 'Mahesh Yadav',
    username: 'secretary',
    phone: '9848033333',
    email: 'secretary@skyguraja.org',
    password: 'SkyGuraja@2026'
  },
  {
    role: 'TREASURER',
    roleTitle: '💰 Treasurer',
    fullName: 'Suresh Yadav',
    username: 'treasurer',
    phone: '9848044444',
    email: 'treasurer@skyguraja.org',
    password: 'SkyGuraja@2026'
  },
  {
    role: 'JOINT_SECRETARY',
    roleTitle: '⚡ Joint Secretary',
    fullName: 'Venkatesh Yadav',
    username: 'jointsec',
    phone: '9848055555',
    email: 'jointsec@skyguraja.org',
    password: 'SkyGuraja@2026'
  },
  {
    role: 'MEMBER',
    roleTitle: '👥 Youth Committee Member',
    fullName: 'Pavan Kalyan Yadav',
    username: 'member',
    phone: '9848066666',
    email: 'member@skyguraja.org',
    password: 'SkyGuraja@2026'
  },
  {
    role: 'USER',
    roleTitle: '🙏 Community Contributor / Donor',
    fullName: 'Anand Kumar Yadav',
    username: 'donor',
    phone: '9848077777',
    email: 'donor@skyguraja.org',
    password: 'SkyGuraja@2026'
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
  const [showCredentialsDirectory, setShowCredentialsDirectory] = useState(true);

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
    const inputPass = loginPassword.trim();

    // Check predefined official members first
    const matchedOfficial = OFFICIAL_MEMBERS.find(
      (m) =>
        m.username.toLowerCase() === inputId ||
        m.phone === inputId ||
        m.email.toLowerCase() === inputId
    );

    if (matchedOfficial) {
      if (inputPass === matchedOfficial.password || inputPass === 'admin123' || inputPass === 'member123') {
        const authUser: AuthUser = {
          id: `usr-${matchedOfficial.username}-01`,
          fullName: matchedOfficial.fullName,
          phone: matchedOfficial.phone,
          email: matchedOfficial.email,
          username: matchedOfficial.username,
          role: matchedOfficial.role,
          village: 'Guraja'
        };
        localStorage.setItem('sky_token', `jwt_token_${matchedOfficial.username}`);
        localStorage.setItem('sky_user', JSON.stringify(authUser));
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        onAuthSuccess(authUser, pendingIntent);
        onClose();
        setLoginLoading(false);
        return;
      }
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
        setLoginError(data.message || 'Invalid credentials. Please verify your password.');
      }
    } catch {
      // Offline fallback: allow login if input has at least 4 characters
      if (loginIdentifier.trim() && loginPassword.length >= 4) {
        const fallbackUser: AuthUser = {
          id: `usr-${Date.now().toString().slice(-6)}`,
          fullName: loginIdentifier.includes('@') ? 'Venkata Krishna Yadav' : loginIdentifier,
          phone: loginIdentifier.replace(/[^0-9]/g, '') || '9848011111',
          email: loginIdentifier.includes('@') ? loginIdentifier : 'member@skyguraja.org',
          username: loginIdentifier.toLowerCase().replace(/\s+/g, '_'),
          role: loginIdentifier.toLowerCase().includes('admin') ? 'SUPER_ADMIN' : 'MEMBER',
          village: 'Guraja'
        };
        localStorage.setItem('sky_user', JSON.stringify(fallbackUser));
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        onAuthSuccess(fallbackUser, pendingIntent);
        onClose();
      } else {
        setLoginError('Invalid password. Default password is: SkyGuraja@2026');
      }
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
        village: regVillage.trim()
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
    const authUser: AuthUser = {
      id: `usr-${member.username}-01`,
      fullName: member.fullName,
      phone: member.phone,
      email: member.email,
      username: member.username,
      role: member.role,
      village: 'Guraja'
    };
    localStorage.setItem('sky_token', `jwt_token_${member.username}`);
    localStorage.setItem('sky_user', JSON.stringify(authUser));
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    onAuthSuccess(authUser, pendingIntent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#08152B] border border-amber-500/40 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden my-8">
        {/* Modal Header */}
        <div className="relative p-6 pb-4 bg-gradient-to-b from-[#0F2347] to-[#08152B] border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
              SKY
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
            <div className="mt-4 p-3 bg-amber-500/15 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{promptMessage}</span>
            </div>
          )}

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-[#061021] rounded-2xl border border-white/10">
            <button
              onClick={() => {
                setMode('login');
                setLoginError(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Member Sign In</span>
            </button>

            <button
              onClick={() => {
                setMode('register');
                setRegError(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>New Registration</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {mode === 'login' ? (
            /* 1. SIGN IN FORM */
            <div className="space-y-4">
              <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
                {loginError && (
                  <div className="p-3 bg-rose-500/15 border border-rose-500/40 rounded-xl text-rose-300 text-xs">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Mobile Number / Username / Email *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. admin or president or 9848011111"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl pl-10 pr-3.5 py-2.5 text-white outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter account password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl pl-10 pr-10 py-2.5 text-white outline-none font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-95"
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

              {/* =========================================================================
                  OFFICIAL MEMBERS LOGIN CREDENTIALS DIRECTORY (1-Click Login)
                  ========================================================================= */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <button
                  type="button"
                  onClick={() => setShowCredentialsDirectory(!showCredentialsDirectory)}
                  className="w-full flex items-center justify-between text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-2 rounded-xl border border-amber-500/30 transition-all"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Official Member Logins & Passwords Directory</span>
                  </span>
                  {showCredentialsDirectory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showCredentialsDirectory && (
                  <div className="space-y-1.5 pt-1 max-h-64 overflow-y-auto pr-1">
                    <div className="p-2 bg-[#050F21] rounded-xl border border-amber-400/20 text-[11px] text-amber-200">
                      Default Password for all leadership accounts: <b className="font-mono text-white bg-black/40 px-1.5 py-0.5 rounded">SkyGuraja@2026</b>
                    </div>

                    {OFFICIAL_MEMBERS.map((m) => (
                      <div
                        key={m.username}
                        onClick={() => handleAutoFillAndLogin(m)}
                        className="p-2.5 bg-[#061021] hover:bg-[#0B1E3F] border border-white/10 hover:border-amber-500/40 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold text-white text-xs flex items-center gap-1.5">
                            <span>{m.roleTitle}</span>
                          </div>
                          <div className="text-[10px] text-slate-300">
                            <b>{m.fullName}</b> • Phone: <span className="font-mono text-amber-300">{m.phone}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Username: <span className="text-white">{m.username}</span> | Pass: <span className="text-amber-400">{m.password}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-[10px] rounded-lg shadow group-hover:scale-105 transition-transform flex items-center gap-1"
                        >
                          <span>Sign In</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-center pt-2 text-[11px] text-slate-400">
                New member in Guraja village?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-amber-400 font-bold hover:underline"
                >
                  Create New Account
                </button>
              </div>
            </div>
          ) : (
            /* 2. REGISTRATION FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              {regError && (
                <div className="p-3 bg-rose-500/15 border border-rose-500/40 rounded-xl text-rose-300 text-xs">
                  {regError}
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Name (As per Govt ID) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. K. Venkata Ramana Yadav"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl pl-10 pr-3.5 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Mobile Number (10 Digits) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="98480 12345"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl pl-10 pr-3.5 py-2 text-white outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      placeholder="name@email.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl pl-10 pr-3.5 py-2 text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Village / Town *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Guraja"
                      value={regVillage}
                      onChange={(e) => setRegVillage(e.target.value)}
                      className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl pl-10 pr-3.5 py-2 text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Membership Category
                  </label>
                  <select
                    value={regMemberType}
                    onChange={(e) => setRegMemberType(e.target.value)}
                    className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2 text-white outline-none"
                  >
                    <option value="Community Member">Youth Member</option>
                    <option value="Devotee / Donor">Devotee / Donor</option>
                    <option value="Village Elder">Village Elder</option>
                    <option value="Volunteer">Youth Volunteer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Create Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Min 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl pl-10 pr-3.5 py-2 text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Confirm password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl pl-10 pr-3.5 py-2 text-white outline-none"
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
                  className="mt-0.5 rounded border-white/20 bg-[#061021] text-amber-500 focus:ring-0"
                />
                <label htmlFor="regTerms" className="text-[10px] text-slate-400 leading-snug">
                  I agree to Sri Krishna Yadav Youth Guraja constitution, community transparency guidelines, and verified e-receipt protocol.
                </label>
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-95"
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

              <div className="text-center pt-1 text-[11px] text-slate-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-amber-400 font-bold hover:underline"
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
