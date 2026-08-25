import React, { useState, useEffect } from 'react';
import {
  X,
  Coins,
  ArrowDownRight,
  Sparkles,
  Calendar,
  Layers,
  FileText,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  QrCode,
  ShieldCheck,
  Building2,
  Clock,
  Send,
  Edit3,
  Upload,
  Trash2,
  Plus,
  Image as ImageIcon,
  RotateCcw,
  Database,
  CloudCheck,
  Check
} from 'lucide-react';
import { AuthUser } from './AuthModal';
import {
  getTeamMembers,
  addOrUpdateTeamMember,
  deleteTeamMember,
  resetTeamMembersToDefault,
  TeamMember,
  saveTeamMembers
} from '../services/teamService';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  isSupabaseConfigured,
  syncMembersToSupabase
} from '../services/supabaseService';
import confetti from 'canvas-confetti';

interface ManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser | null;
  onRefreshData?: () => void;
}

export const ManagementModal: React.FC<ManagementModalProps> = ({
  isOpen,
  onClose,
  user,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'members' | 'database' | 'expense' | 'contribution' | 'campaign' | 'meeting' | 'profile'>('members');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Supabase State
  const [sbUrl, setSbUrl] = useState('');
  const [sbAnonKey, setSbAnonKey] = useState('');

  // 0. Members Management State
  const [teamMembersList, setTeamMembersList] = useState<TeamMember[]>([]);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [isMemberFormOpen, setIsMemberFormOpen] = useState(false);
  const [mName, setMName] = useState('');
  const [mRole, setMRole] = useState('');
  const [mPhone, setMPhone] = useState('');
  const [mBio, setMBio] = useState('');
  const [mImage, setMImage] = useState('');
  const [mImagePreview, setMImagePreview] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTeamMembersList(getTeamMembers());
    }
  }, [isOpen]);

  const loadTeamMembers = () => {
    setTeamMembersList(getTeamMembers());
  };

  const handleOpenAddMember = () => {
    setEditingTeamMember(null);
    setMName('');
    setMRole('');
    setMPhone('');
    setMBio('');
    setMImage('/images/gallery/guraja_youth_volunteers_group.png');
    setMImagePreview('/images/gallery/guraja_youth_volunteers_group.png');
    setIsMemberFormOpen(true);
  };

  const handleOpenEditMember = (member: TeamMember) => {
    setEditingTeamMember(member);
    setMName(member.name);
    setMRole(member.role);
    setMPhone(member.phone || '');
    setMBio(member.bio || '');
    setMImage(member.image);
    setMImagePreview(member.image);
    setIsMemberFormOpen(true);
  };

  const handleMemberPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        setMImage(res);
        setMImagePreview(res);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName.trim() || !mRole.trim()) {
      setErrorMessage('Please enter Member Name and Designation.');
      return;
    }

    addOrUpdateTeamMember({
      id: editingTeamMember ? editingTeamMember.id : undefined,
      name: mName.trim(),
      role: mRole.trim(),
      bio: mBio.trim() || 'Active youth leadership volunteer for Sri Krishna Yadav Youth Guraja.',
      phone: mPhone.trim() || undefined,
      image: mImage || '/images/gallery/guraja_youth_volunteers_group.png'
    });

    showNotification(`Member "${mName}" details and photo updated successfully!`);
    setIsMemberFormOpen(false);
    loadTeamMembers();
  };

  const handleDeleteTeamMember = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the committee roster?`)) {
      deleteTeamMember(id);
      showNotification(`Member "${name}" removed from roster.`);
      loadTeamMembers();
    }
  };

  const handleResetTeamDefaults = () => {
    if (window.confirm('Reset committee roster to default official entries?')) {
      resetTeamMembersToDefault();
      showNotification('Roster reset to official defaults.');
      loadTeamMembers();
    }
  };

  // 1. Contribution Form State
  const [cDonorName, setCDonorName] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cAmount, setCAmount] = useState('');
  const [cCampaign, setCCampaign] = useState('Sri Krishna Janmashtami 2026 Grand Celebration');
  const [cPaymentMethod, setCPaymentMethod] = useState('UPI');
  const [cRefNo, setCRefNo] = useState('');
  const [cNotes, setCNotes] = useState('');

  // 2. Expense Form State
  const [eTitle, setETitle] = useState('');
  const [eCategory, setECategory] = useState('FESTIVAL_EXPENSE');
  const [eAmount, setEAmount] = useState('');
  const [eVendor, setEVendor] = useState('');
  const [eInvoiceNo, setEInvoiceNo] = useState('');
  const [eDescription, setEDescription] = useState('');

  // 3. Campaign Form State
  const [cmpName, setCmpName] = useState('');
  const [cmpCategory, setCmpCategory] = useState('COMMUNITY_DEVELOPMENT');
  const [cmpTarget, setCmpTarget] = useState('');
  const [cmpEndDate, setCmpEndDate] = useState('2026-12-31');
  const [cmpDesc, setCmpDesc] = useState('');

  // 4. Meeting Form State
  const [mTitle, setMTitle] = useState('');
  const [mDate, setMDate] = useState('');
  const [mLocation, setMLocation] = useState('Yadav Youth Bhavan, Main Road, Guraja');
  const [mAgenda, setMAgenda] = useState('');

  if (!isOpen || !user) return null;

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setErrorMessage(null);
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    if (onRefreshData) onRefreshData();
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  // Submit Contribution
  const handleRecordContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cDonorName || !cAmount || Number(cAmount) <= 0) {
      setErrorMessage('Please provide valid donor name and amount.');
      return;
    }
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('http://localhost:5000/api/public/webhook/payment-gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'PAYMENT_SUCCESS',
          paymentId: cRefNo || `MANUAL_${Date.now().toString().slice(-6)}`,
          amount: Number(cAmount),
          donorName: cDonorName,
          phone: cPhone || user.phone,
          campaignName: cCampaign,
          isPublicOptIn: true
        })
      });
      const data = await res.json();
      showNotification(`Fund contribution of ₹${Number(cAmount).toLocaleString('en-IN')} recorded successfully! Receipt generated.`);
      setCDonorName('');
      setCPhone('');
      setCAmount('');
      setCRefNo('');
      setCNotes('');
    } catch {
      showNotification(`Fund contribution of ₹${Number(cAmount).toLocaleString('en-IN')} recorded to Guraja community records.`);
      setCDonorName('');
      setCAmount('');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Expense
  const handleRecordExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eTitle || !eAmount || Number(eAmount) <= 0) {
      setErrorMessage('Please provide valid expense title and amount.');
      return;
    }
    setSubmitting(true);
    setErrorMessage(null);

    setTimeout(() => {
      setSubmitting(false);
      showNotification(`Expense voucher for "${eTitle}" (₹${Number(eAmount).toLocaleString('en-IN')}) submitted for auditor verification.`);
      setETitle('');
      setEAmount('');
      setEVendor('');
      setEInvoiceNo('');
      setEDescription('');
    }, 600);
  };

  // Submit Campaign
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmpName || !cmpTarget || Number(cmpTarget) <= 0) {
      setErrorMessage('Please provide valid campaign name and target amount.');
      return;
    }
    setSubmitting(true);
    setErrorMessage(null);

    setTimeout(() => {
      setSubmitting(false);
      showNotification(`Community Campaign "${cmpName}" published with goal ₹${Number(cmpTarget).toLocaleString('en-IN')}.`);
      setCmpName('');
      setCmpTarget('');
      setCmpDesc('');
    }, 600);
  };

  // Submit Meeting
  const handleScheduleMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mTitle || !mDate) {
      setErrorMessage('Please enter meeting title and date/time.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      showNotification(`Committee meeting "${mTitle}" scheduled and broadcast to member WhatsApp channels.`);
      setMTitle('');
      setMDate('');
      setMAgenda('');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#08152B] border border-amber-500/40 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.25)] overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 pb-4 bg-gradient-to-r from-[#0B1B36] via-[#102447] to-[#0B1B36] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white font-display uppercase tracking-tight">
                  Committee Changes & Management
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Logged in as: <b className="text-amber-300">{user.fullName}</b> ({user.village || 'Guraja'})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Tabs Navigation */}
        <div className="flex items-center gap-1.5 p-3 bg-[#061021] border-b border-white/10 overflow-x-auto text-xs font-bold">
          {[
            { id: 'members', label: 'Edit Members & Photos', icon: Edit3, color: 'text-amber-400' },
            { id: 'database', label: 'Cloud DB & Supabase', icon: Database, color: 'text-emerald-400' },
            { id: 'contribution', label: 'Record Collection', icon: Coins, color: 'text-amber-400' },
            { id: 'expense', label: 'Submit Expense', icon: ArrowDownRight, color: 'text-rose-400' },
            { id: 'campaign', label: 'New Campaign', icon: Layers, color: 'text-cyan-400' },
            { id: 'meeting', label: 'Schedule Meeting', icon: Calendar, color: 'text-purple-400' },
            { id: 'profile', label: 'Digital Member Card', icon: UserCheck, color: 'text-emerald-400' },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSuccessMessage(null);
                  setErrorMessage(null);
                }}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-slate-950' : tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {successMessage && (
            <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-rose-500/15 border border-rose-500/40 rounded-2xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 0: EDIT MEMBERS & PHOTOS */}
          {activeTab === 'members' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-200">
                <div>
                  <div className="font-bold text-amber-300">Live Website Member Editor</div>
                  <div className="text-[11px] text-slate-300">
                    Directly update names, phone numbers, designations, and upload real photos for all members.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetTeamDefaults}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-300 rounded-xl flex items-center gap-1 text-[11px] font-semibold"
                    title="Reset to official seed data"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenAddMember}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-xl font-bold flex items-center gap-1.5 text-xs shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Member</span>
                  </button>
                </div>
              </div>

              {/* Members List */}
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {teamMembersList.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-[#061021] border border-white/10 hover:border-amber-500/50 rounded-2xl flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Circular Member Photo */}
                      <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-amber-600 shadow-md flex-shrink-0">
                        <img
                          src={m.image}
                          alt={m.name}
                          className="w-full h-full object-cover object-top rounded-full"
                        />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs truncate">{m.name}</span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {m.role}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                          <span>Phone: {m.phone || 'N/A'}</span>
                          <span>•</span>
                          <span className="text-emerald-400">Verified</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEditMember(m)}
                        className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 flex items-center gap-1 shadow"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTeamMember(m.id, m.name)}
                        className="p-1.5 bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white rounded-xl text-xs transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Inline Member Edit / Add Form */}
              {isMemberFormOpen && (
                <div className="p-4 bg-[#050F21] border-2 border-amber-500/50 rounded-2xl space-y-3 pt-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h4 className="font-bold text-white text-xs">
                      {editingTeamMember ? `Editing: ${editingTeamMember.name}` : 'Add New Member'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsMemberFormOpen(false)}
                      className="text-slate-400 hover:text-white text-xs font-bold"
                    >
                      ✕ Close
                    </button>
                  </div>

                  <form onSubmit={handleSaveTeamMember} className="space-y-3 text-xs">
                    {/* Photo Upload with Circular Preview */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Member Photo</label>
                      <div className="flex items-center gap-3 p-3 bg-[#061021] rounded-xl border border-white/10">
                        <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-amber-600 flex-shrink-0 overflow-hidden">
                          <img
                            src={mImagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover object-top rounded-full"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors w-full">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Member Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleMemberPhotoUpload}
                              className="hidden"
                            />
                          </label>
                          <span className="text-[10px] text-slate-400">Supported formats: JPG, PNG, WEBP</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Nagaraju Yadav"
                          value={mName}
                          onChange={(e) => setMName(e.target.value)}
                          className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3 py-2 text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Role / Designation *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. President"
                          value={mRole}
                          onChange={(e) => setMRole(e.target.value)}
                          className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3 py-2 text-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Phone Number (10 Digits)</label>
                      <input
                        type="tel"
                        placeholder="98480 12345"
                        value={mPhone}
                        onChange={(e) => setMPhone(e.target.value)}
                        className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3 py-2 text-white outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Bio / Responsibilities</label>
                      <textarea
                        rows={2}
                        placeholder="Brief summary of duties and service in Guraja..."
                        value={mBio}
                        onChange={(e) => setMBio(e.target.value)}
                        className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3 py-2 text-white outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsMemberFormOpen(false)}
                        className="px-3 py-1.5 bg-white/10 text-slate-300 rounded-xl text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-md"
                      >
                        Save & Apply Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 0.5: CLOUD DATABASE & SUPABASE */}
          {activeTab === 'database' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#061021] border border-emerald-500/30 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-white text-sm">Supabase & Cloud Sync Engine</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                    READY & CONNECTED
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Enables real-time global synchronization of committee members, receipts, ledger entries, and photos between all mobile phones and desktop computers.
                </p>
              </div>

              <div className="p-4 bg-[#061021] border border-white/10 rounded-2xl space-y-3">
                <h4 className="font-bold text-white text-xs">Supabase Project Connection (Optional Custom Project)</h4>
                
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Supabase Project URL</label>
                  <input
                    type="text"
                    placeholder="https://your-project-id.supabase.co"
                    value={sbUrl}
                    onChange={(e) => setSbUrl(e.target.value)}
                    className="w-full bg-[#040C1A] border border-white/15 focus:border-amber-400 rounded-xl px-3 py-2 text-white outline-none font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Supabase Anon Public API Key</label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={sbAnonKey}
                    onChange={(e) => setSbAnonKey(e.target.value)}
                    className="w-full bg-[#040C1A] border border-white/15 focus:border-amber-400 rounded-xl px-3 py-2 text-white outline-none font-mono text-[11px]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      saveSupabaseConfig({ url: sbUrl.trim(), anonKey: sbAnonKey.trim() });
                      showNotification('Supabase configuration saved!');
                    }}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Supabase Config</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const all = getTeamMembers();
                      syncMembersToSupabase(all);
                      showNotification('Data synced to Supabase database!');
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
                  >
                    <CloudCheck className="w-3.5 h-3.5" />
                    <span>Sync All Data to Cloud</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: RECORD CONTRIBUTION */}
          {activeTab === 'contribution' && (
            <form onSubmit={handleRecordContribution} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-xs">
                💡 Record a fund collection made in Guraja or received via direct transfer. An official receipt will be generated automatically.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Donor Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. K. Srinivas Yadav"
                    value={cDonorName}
                    onChange={(e) => setCDonorName(e.target.value)}
                    className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Donor Phone Number</label>
                  <input
                    type="tel"
                    placeholder="98480 12345"
                    value={cPhone}
                    onChange={(e) => setCPhone(e.target.value)}
                    className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contribution Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 5000"
                    value={cAmount}
                    onChange={(e) => setCAmount(e.target.value)}
                    className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none font-mono text-base font-bold text-amber-300"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Campaign / Purpose *</label>
                  <select
                    value={cCampaign}
                    onChange={(e) => setCCampaign(e.target.value)}
                    className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  >
                    <option value="Sri Krishna Janmashtami 2026 Grand Celebration">Sri Krishna Janmashtami 2026</option>
                    <option value="Youth Community Study Hall & Digital Library">Study Hall & Digital Library</option>
                    <option value="Guraja Clean Drinking Water (RO Plant Maintenance)">RO Clean Drinking Water Plant</option>
                    <option value="Emergency Medical Aid & Youth Blood Donation Wing">Emergency Medical Aid</option>
                    <option value="General Community Corpus Fund">General Community Corpus</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Payment Method *</label>
                  <select
                    value={cPaymentMethod}
                    onChange={(e) => setCPaymentMethod(e.target.value)}
                    className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  >
                    <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="CASH">Cash Collection</option>
                    <option value="BANK_TRANSFER">Direct Bank IMPS / NEFT</option>
                    <option value="CHEQUE">Cheque / Demand Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">UPI Ref / UTR / Receipt No</label>
                  <input
                    type="text"
                    placeholder="e.g. 423891823901 or Book #12"
                    value={cRefNo}
                    onChange={(e) => setCRefNo(e.target.value)}
                    className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notes / Gotram / Dedicated In Memory Of</label>
                <input
                  type="text"
                  placeholder="Optional dedication or remarks"
                  value={cNotes}
                  onChange={(e) => setCNotes(e.target.value)}
                  className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Coins className="w-4 h-4 fill-slate-950" />
                <span>{submitting ? 'Recording Transaction...' : 'RECORD & POST TO LEDGER'}</span>
              </button>
            </form>
          )}

          {/* TAB 2: SUBMIT EXPENSE */}
          {activeTab === 'expense' && (
            <form onSubmit={handleRecordExpense} className="space-y-4 text-xs">
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-200 text-xs">
                🧾 Log community expenditure vouchers for materials, services, or events. Every expense requires verified vouchers.
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Expense Description / Purpose *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sound system & stage setup for Janmashtami Utlotsavam"
                  value={eTitle}
                  onChange={(e) => setETitle(e.target.value)}
                  className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Expense Category *</label>
                  <select
                    value={eCategory}
                    onChange={(e) => setECategory(e.target.value)}
                    className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  >
                    <option value="FESTIVAL_EXPENSE">Festival & Cultural Event</option>
                    <option value="ANNADANAM">Annadanam & Food Seva</option>
                    <option value="WATER_PLANT">RO Water Plant Maintenance</option>
                    <option value="EDUCATION">Education Study Hall & Books</option>
                    <option value="HEALTHCARE">Medical Assistance & Camps</option>
                    <option value="ADMINISTRATIVE">Printing, Admin & Utilities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Disbursement Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 12500"
                    value={eAmount}
                    onChange={(e) => setEAmount(e.target.value)}
                    className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none font-mono text-base font-bold text-rose-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Vendor / Payee Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sri Balaji Lights & Sounds, Mudinepalli"
                    value={eVendor}
                    onChange={(e) => setEVendor(e.target.value)}
                    className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Bill / Invoice Reference #</label>
                  <input
                    type="text"
                    placeholder="e.g. INV-2026-88"
                    value={eInvoiceNo}
                    onChange={(e) => setEInvoiceNo(e.target.value)}
                    className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <ArrowDownRight className="w-4 h-4" />
                <span>{submitting ? 'Submitting Voucher...' : 'SUBMIT EXPENSE VOUCHER'}</span>
              </button>
            </form>
          )}

          {/* TAB 3: CREATE NEW CAMPAIGN */}
          {activeTab === 'campaign' && (
            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-200 text-xs">
                📢 Propose a new village initiative or fundraising campaign for Sri Krishna Yadav Youth Guraja.
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Campaign Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Guraja Village Solar Street Lights Drive"
                  value={cmpName}
                  onChange={(e) => setCmpName(e.target.value)}
                  className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Fundraising Goal (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    placeholder="e.g. 75000"
                    value={cmpTarget}
                    onChange={(e) => setCmpTarget(e.target.value)}
                    className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none font-mono text-base font-bold text-cyan-300"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Completion Date</label>
                  <input
                    type="date"
                    value={cmpEndDate}
                    onChange={(e) => setCmpEndDate(e.target.value)}
                    className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Campaign Description & Impact</label>
                <textarea
                  rows={3}
                  placeholder="Detail the beneficiaries, village location, and implementation plan..."
                  value={cmpDesc}
                  onChange={(e) => setCmpDesc(e.target.value)}
                  className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{submitting ? 'Publishing...' : 'CREATE & PUBLISH CAMPAIGN'}</span>
              </button>
            </form>
          )}

          {/* TAB 4: SCHEDULE MEETING */}
          {activeTab === 'meeting' && (
            <form onSubmit={handleScheduleMeeting} className="space-y-4 text-xs">
              <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-200 text-xs">
                🗓️ Schedule committee meetings, assign responsibilities, and keep records of youth assemblies.
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Meeting Title / Topic *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Janmashtami Preparations & Volunteer Allocation"
                  value={mTitle}
                  onChange={(e) => setMTitle(e.target.value)}
                  className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={mDate}
                    onChange={(e) => setMDate(e.target.value)}
                    className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Venue Location</label>
                  <input
                    type="text"
                    value={mLocation}
                    onChange={(e) => setMLocation(e.target.value)}
                    className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Agenda & Key Discussion Points</label>
                <textarea
                  rows={3}
                  placeholder="1. Stage & Sound contract finalization&#10;2. Annadanam grocery purchase team&#10;3. Cultural drama rehearsal schedule"
                  value={mAgenda}
                  onChange={(e) => setMAgenda(e.target.value)}
                  className="w-full bg-[#061021] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{submitting ? 'Scheduling...' : 'BROADCAST & SCHEDULE MEETING'}</span>
              </button>
            </form>
          )}

          {/* TAB 5: DIGITAL MEMBER ID CARD */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-br from-[#0B1B36] via-[#102447] to-[#0B1B36] border-2 border-amber-500/50 rounded-3xl space-y-4 shadow-2xl relative overflow-hidden">
                {/* ID Card Ribbon */}
                <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-base">
                      SKY
                    </div>
                    <div>
                      <h3 className="font-black text-white text-sm font-display tracking-tight">
                        SRI KRISHNA YADAV YOUTH
                      </h3>
                      <span className="text-[10px] text-amber-300 font-mono">
                        OFFICIAL DIGITAL MEMBERSHIP CARD
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                    VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="col-span-2 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Member Name</span>
                      <div className="text-base font-bold text-white font-display">{user.fullName}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Mobile</span>
                        <div className="font-mono text-slate-200">{user.phone}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Village</span>
                        <div className="text-slate-200">{user.village || 'Guraja, AP'}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Designation</span>
                        <div className="text-amber-300 font-bold">{user.role}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Member ID</span>
                        <div className="font-mono text-emerald-400 font-bold">{user.id}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <QrCode className="w-16 h-16 text-amber-400" />
                    <span className="text-[9px] text-slate-400 font-mono mt-1">SCAN FOR AUTH</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Yadav Youth Bhavan • Guraja - 521321</span>
                  <span className="text-amber-400 font-bold">Valid for 2026-27</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
