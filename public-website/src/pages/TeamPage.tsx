import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Edit3,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  X,
  Check,
  Sparkles,
  Phone,
  Mail,
  ShieldAlert
} from 'lucide-react';
import { AuthUser } from '../components/AuthModal';
import {
  getTeamMembers,
  addOrUpdateTeamMember,
  deleteTeamMember,
  TeamMember
} from '../services/teamService';
import confetti from 'canvas-confetti';

interface TeamPageProps {
  user?: AuthUser | null;
}

export const TeamPage: React.FC<TeamPageProps> = ({ user }) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formImage, setFormImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const isAdmin = user && ['ADMIN', 'SUPER_ADMIN', 'MEMBER'].includes(user.role);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = () => {
    setMembers(getTeamMembers());
  };

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormName('');
    setFormRole('');
    setFormBio('');
    setFormPhone('');
    setFormEmail('');
    setFormImage('/images/gallery/guraja_youth_volunteers_group.png');
    setImagePreview('/images/gallery/guraja_youth_volunteers_group.png');
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormName(member.name);
    setFormRole(member.role);
    setFormBio(member.bio);
    setFormPhone(member.phone || '');
    setFormEmail(member.email || '');
    setFormImage(member.image);
    setImagePreview(member.image);
    setIsEditorOpen(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormImage(result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formRole.trim()) {
      alert('Please fill in Member Name and Role.');
      return;
    }

    addOrUpdateTeamMember({
      id: editingMember ? editingMember.id : undefined,
      name: formName.trim(),
      role: formRole.trim(),
      bio: formBio.trim(),
      phone: formPhone.trim() || undefined,
      email: formEmail.trim() || undefined,
      image: formImage || '/images/gallery/guraja_youth_volunteers_group.png'
    });

    confetti({ particleCount: 70, spread: 60 });
    setIsEditorOpen(false);
    loadMembers();
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the leadership team?`)) {
      deleteTeamMember(id);
      loadMembers();
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-900">
      {/* Dark Header Banner */}
      <div className="bg-gradient-to-b from-[#050E1C] via-[#08152B] to-[#040C18] text-white py-14 px-4 text-center border-b border-amber-500/20 relative">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full text-[11px] font-mono font-bold text-amber-300 uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>COMMITTEE LEADERSHIP & ROSTER</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
            OUR TEAM
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Dedicated youth committee members who volunteer their time, energy, and leadership to serve Guraja village.
          </p>

          {/* Admin Management Toolbar */}
          {isAdmin && (
            <div className="pt-3 flex items-center justify-center gap-3">
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 bg-gradient-to-r from-[#D4A244] via-[#F5BD55] to-[#C49132] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-1.5 hover:from-[#E5B869] transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Team Member</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((m) => (
            <div
              key={m.id || m.name}
              className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between text-center group relative"
            >
              {/* Admin Action Overlay Buttons */}
              {isAdmin && (
                <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-[#051124]/90 backdrop-blur-md p-1.5 rounded-xl border border-white/20 shadow-lg">
                  <button
                    onClick={() => handleOpenEdit(m)}
                    className="p-1.5 bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400 transition-all text-xs font-bold flex items-center gap-1"
                    title="Edit Member Details & Photo"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteMember(m.id, m.name)}
                    className="p-1.5 bg-rose-500/80 text-white rounded-lg hover:bg-rose-600 transition-all text-xs"
                    title="Delete Member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div>
                <div className="relative h-56 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-[#061224]/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-amber-300 font-mono">
                    {m.initials}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-slate-900 text-lg leading-snug">
                    {m.name}
                  </h3>
                  <div className="text-xs font-black text-[#C49132] uppercase tracking-wider">
                    {m.role}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pt-1 line-clamp-3">
                    {m.bio}
                  </p>

                  {m.phone && (
                    <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-mono pt-1">
                      <Phone className="w-3 h-3 text-amber-500" />
                      <span>{m.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Sri Krishna Yadav Youth</span>
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  <span>Guraja, AP</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          ADMIN TEAM MEMBER EDITOR MODAL (Upload Picture, Name, Role, Bio)
          ========================================================================= */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#08152B] border border-amber-500/40 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-4 relative my-auto">
            <button
              onClick={() => setIsEditorOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white font-serif uppercase tracking-wide">
                  {editingMember ? 'Edit Team Member Details' : 'Add New Team Member'}
                </h3>
                <p className="text-[10px] text-amber-300 font-mono">
                  Committee Leadership & Roster Management
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-3.5 text-xs">
              {/* Photo Upload & Preview Box */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Member Profile Picture *
                </label>
                <div className="flex items-center gap-4 p-3 bg-[#050F21] rounded-2xl border border-white/15">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-800 border-2 border-amber-500/40 flex-shrink-0 relative">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <label className="px-3.5 py-2 bg-[#0B1E3F] hover:bg-[#122A54] border border-amber-500/40 text-amber-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Picture from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                    <div className="text-[10px] text-slate-400">
                      Supports JPG, PNG, WebP (Square or portrait recommended).
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Yadav"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-[#050F21] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>

              {/* Role & Phone Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Role / Designation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. President / Treasurer"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full bg-[#050F21] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Contact Mobile (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="98480 12345"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-[#050F21] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none font-mono"
                  />
                </div>
              </div>

              {/* Bio & Responsibilities */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Bio / Responsibilities *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe committee duties, community contributions, and village leadership..."
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  className="w-full bg-[#050F21] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#D4A244] via-[#F5BD55] to-[#C49132] hover:from-[#E5B869] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Member Details</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPage;
