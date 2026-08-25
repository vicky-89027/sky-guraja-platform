import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { CommitteeMember, AuthUser } from '../types';
import {
  Users,
  PlusCircle,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  Coins,
  Shield,
  Calendar,
  Award
} from 'lucide-react';

interface MembersViewProps {
  user: AuthUser | null;
}

export const MembersView: React.FC<MembersViewProps> = ({ user }) => {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  // New Member Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [areaLocation, setAreaLocation] = useState('Guraja');
  const [assignedResponsibilities, setAssignedResponsibilities] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = () => {
    setLoading(true);
    api.getMembers()
      .then((res) => {
        if (res.success) setMembers(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleToggleStatus = async (id: string, currentActive: number) => {
    const newStatus = currentActive === 1 ? false : true;
    try {
      const res = await api.toggleMemberStatus(id, newStatus);
      if (res.success) {
        loadMembers();
      }
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    }
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !roleTitle || !phone || !areaLocation) {
      alert('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createMember({
        name,
        roleTitle,
        phone,
        email: email || undefined,
        areaLocation,
        assignedResponsibilities: assignedResponsibilities || undefined
      });

      if (res.success) {
        setIsModalOpen(false);
        setName('');
        setRoleTitle('');
        setPhone('');
        setEmail('');
        setAssignedResponsibilities('');
        loadMembers();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add member');
    } finally {
      setSubmitting(false);
    }
  };

  const canManage = user?.role === 'SUPER_ADMIN' || user?.role === 'PRESIDENT' || user?.role === 'SECRETARY';

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl lg:text-2xl font-black text-white font-display">
              Committee Member Directory
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Roles, area responsibilities, collection quotas & member performance tracking
          </p>
        </div>

        {canManage && user?.role !== 'AUDITOR' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Committee Member</span>
          </button>
        )}
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-slate-400 text-xs">
            Loading member directory...
          </div>
        ) : members.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-slate-400 text-xs">
            No committee members recorded.
          </div>
        ) : (
          members.map((m) => (
            <div
              key={m.id}
              className={`bg-[#0B1B36] border rounded-2xl p-5 shadow-xl space-y-4 transition-all flex flex-col justify-between ${
                m.active === 1 ? 'border-white/10 hover:border-amber-500/40' : 'border-red-500/20 opacity-70'
              }`}
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16335F] to-[#0A1A33] border border-amber-500/30 flex items-center justify-center font-bold text-amber-300 font-display">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">{m.name}</h3>
                      <span className="text-[11px] text-amber-300 font-semibold">{m.role_title}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      m.active === 1
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}
                  >
                    {m.active === 1 ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Contact & Location */}
                <div className="mt-3.5 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-mono text-white">{m.phone}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{m.area_location}</span>
                  </div>

                  {m.assigned_responsibilities && (
                    <div className="text-[11px] text-slate-400 bg-[#061224] p-2 rounded-lg border border-white/5 mt-2">
                      <b className="text-slate-300">Duties:</b> {m.assigned_responsibilities}
                    </div>
                  )}
                </div>
              </div>

              {/* Collection stats */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Verified Collections:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    ₹{Number(m.total_verified_collected || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                {canManage && user?.role !== 'AUDITOR' && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleToggleStatus(m.id, m.active)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                        m.active === 1
                          ? 'border-red-500/30 text-red-400 hover:bg-red-500/20'
                          : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                      }`}
                    >
                      {m.active === 1 ? 'Deactivate (Keep Records)' : 'Reactivate Member'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleCreateMember} className="bg-[#0B1B36] border border-amber-500/30 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              Add Committee Member
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Anil Yadav"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Designation / Role Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Youth Coordinator / Sports In-Charge"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  placeholder="e.g. 98480 77777"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Area / Street in Guraja *</label>
                <input
                  type="text"
                  placeholder="e.g. Guraja Temple Street"
                  value={areaLocation}
                  onChange={(e) => setAreaLocation(e.target.value)}
                  className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Operational Duties</label>
              <textarea
                placeholder="Key responsibilities, committee functions..."
                value={assignedResponsibilities}
                onChange={(e) => setAssignedResponsibilities(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl p-3 text-xs text-white outline-none h-20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-[#16335F] text-slate-300 text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
              >
                {submitting ? 'Saving...' : 'Add Member'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
