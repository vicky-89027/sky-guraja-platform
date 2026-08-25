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
  KeyRound
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
        setLoginError(data.message || 'Invalid phone, email or password.');
      }
    } catch (err: any) {
      // Fallback local authentication for offline demo
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
        setLoginError('Could not connect to authentication server. Please check your inputs.');
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
    } catch (err: any) {
      // Graceful local registration fallback
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

  // Quick Demo Account Switcher
  const handleQuickDemoLogin = (role: string, name: string, phone: string) => {
    const demoUser: AuthUser = {
      id: `usr-${role.toLowerCase()}-01`,
      fullName: name,
      phone: phone,
      email: `${role.toLowerCase()}@skyguraja.org`,
      username: role.toLowerCase(),
      role: role,
      village: 'Guraja'
    };
    localStorage.setItem('sky_user', JSON.stringify(demoUser));
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    onAuthSuccess(demoUser, pendingIntent);
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
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              {loginError && (
                <div className="p-3 bg-rose-500/15 border border-rose-500/40 rounded-xl text-rose-300 text-xs">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Mobile Number / Email / Username *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9848011111 or admin"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl pl-10 pr-3.5 py-2.5 text-white outline-none"
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
                    className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl pl-10 pr-10 py-2.5 text-white outline-none"
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
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-95"
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

              {/* One-Click Quick Role Switcher for Testing */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[11px] text-slate-400 block font-semibold">
                  ⚡ Quick Demo Login (Select Role):
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('SUPER_ADMIN', 'Venkata Krishna Yadav', '9848011111')}
                    className="p-2 bg-[#0B1B36] hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-center"
                  >
                    👑 Super Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('PRESIDENT', 'Nagaraju Yadav', '9848022222')}
                    className="p-2 bg-[#0B1B36] hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-center"
                  >
                    🎖️ President
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('TREASURER', 'Ramesh Yadav', '9848044444')}
                    className="p-2 bg-[#0B1B36] hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-center"
                  >
                    💰 Treasurer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('SECRETARY', 'Suresh Kumar Yadav', '9848033333')}
                    className="p-2 bg-[#0B1B36] hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-center"
                  >
                    📝 Secretary
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('AUDITOR', 'G. V. R. Prasad', '9848066666')}
                    className="p-2 bg-[#0B1B36] hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-center"
                  >
                    🔍 Auditor
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('MEMBER', 'Pavan Kalyan Yadav', '9848055555')}
                    className="p-2 bg-[#0B1B36] hover:bg-slate-700 text-slate-200 border border-white/10 rounded-lg text-center"
                  >
                    👥 Member
                  </button>
                </div>
              </div>

              <div className="text-center pt-2 text-[11px] text-slate-400">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-amber-400 font-bold hover:underline"
                >
                  Register as a New Member
                </button>
              </div>
            </form>
          ) : (
            /* 2. REGISTRATION FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              {regError && (
                <div className="p-3 bg-rose-500/15 border border-rose-500/40 rounded-xl text-rose-300 text-xs">
                  {regError}
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Name (As per Aadhar / ID) *
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Mobile Phone (10 digits) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="98480 12345"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl pl-10 pr-3 py-2 text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      placeholder="name@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl pl-10 pr-3 py-2 text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Village / Area *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Guraja Main Road"
                      value={regVillage}
                      onChange={(e) => setRegVillage(e.target.value)}
                      className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl pl-10 pr-3 py-2 text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Enrollment Type
                  </label>
                  <select
                    value={regMemberType}
                    onChange={(e) => setRegMemberType(e.target.value)}
                    className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="Community Member">Community Member</option>
                    <option value="Youth Volunteer">Youth Volunteer</option>
                    <option value="Devotee / Donor">Devotee / Donor</option>
                    <option value="Outstation Supporter">Outstation Supporter</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Create Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regTerms}
                  onChange={(e) => setRegTerms(e.target.checked)}
                  className="mt-0.5 rounded accent-amber-500"
                />
                <span className="text-[11px] text-slate-300 leading-tight">
                  I agree to participate with integrity in Sri Krishna Yadav Youth Guraja initiatives and understand that all contributions are recorded on public transparent books.
                </span>
              </label>

              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-95"
              >
                {regLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>COMPLETE REGISTRATION</span>
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
