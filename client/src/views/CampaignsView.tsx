import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Campaign, CommitteeMember, AuthUser } from '../types';
import {
  Target,
  PlusCircle,
  Users,
  Coins,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  Layers,
  Award
} from 'lucide-react';

interface CampaignsViewProps {
  user: AuthUser | null;
  onOpenQuickCollect: () => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({ user, onOpenQuickCollect }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  // New Campaign Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('FESTIVAL');
  const [organizerId, setOrganizerId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Quota Assignment Modal
  const [assignCampaignId, setAssignCampaignId] = useState<string | null>(null);
  const [assignMemberId, setAssignMemberId] = useState('');
  const [assignTarget, setAssignTarget] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getCampaigns(), api.getMembers()])
      .then(([campRes, memRes]) => {
        if (campRes.success) setCampaigns(campRes.data);
        if (memRes.success) setMembers(memRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !startDate) {
      alert('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createCampaign({
        name,
        description,
        targetAmount: Number(targetAmount),
        startDate,
        endDate: endDate || undefined,
        category,
        organizerId: organizerId || undefined
      });

      if (res.success) {
        setIsModalOpen(false);
        setName('');
        setDescription('');
        setTargetAmount('');
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create campaign');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignQuota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignCampaignId || !assignMemberId || !assignTarget) return;

    setAssigning(true);
    try {
      const res = await api.assignQuota(assignCampaignId, {
        memberId: assignMemberId,
        targetAmount: Number(assignTarget)
      });
      if (res.success) {
        alert('Collection quota assigned to member!');
        setAssignCampaignId(null);
        setAssignMemberId('');
        setAssignTarget('');
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to assign quota');
    } finally {
      setAssigning(false);
    }
  };

  const canManage = user?.role === 'SUPER_ADMIN' || user?.role === 'PRESIDENT' || user?.role === 'SECRETARY' || user?.role === 'TREASURER';

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl lg:text-2xl font-black text-white font-display">
              Fundraising Campaigns & Quotas
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Target progress, volunteer collection quotas, and expenditure accountability
          </p>
        </div>

        {canManage && user?.role !== 'AUDITOR' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Campaign</span>
          </button>
        )}
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 py-12 text-center text-slate-400 text-xs">
            Loading fundraising campaigns...
          </div>
        ) : campaigns.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-400 text-xs">
            No active campaigns found.
          </div>
        ) : (
          campaigns.map((c) => {
            const collected = c.collected_amount || 0;
            const target = c.target_amount || 1;
            const spent = c.spent_amount || 0;
            const pct = Math.min(Math.round((collected / target) * 100), 100);

            return (
              <div
                key={c.id}
                className="bg-[#0B1B36] border border-amber-500/25 rounded-2xl p-5 shadow-xl space-y-4 hover:border-amber-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Category & Status Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                      {c.category.replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        c.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  {/* Campaign Name */}
                  <h3 className="text-base font-bold text-white font-display leading-snug">
                    {c.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 line-clamp-2">{c.description}</p>
                </div>

                {/* Progress Visualizer */}
                <div className="space-y-2 p-3.5 bg-[#061224] rounded-xl border border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Total Verified Collection:</span>
                    <span className="font-mono font-extrabold text-emerald-400 text-sm">
                      ₹{Number(collected).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Target: <b className="text-amber-300 font-mono">₹{Number(target).toLocaleString('en-IN')}</b></span>
                    <span className="font-mono font-bold text-emerald-400">{pct}% Achieved</span>
                  </div>
                </div>

                {/* Meta details & Assigned Quota */}
                <div className="grid grid-cols-2 gap-2 text-xs border-t border-white/10 pt-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Verified Donors</span>
                    <span className="font-mono font-bold text-white">{c.verified_donors_count || 0} Contributors</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Disbursed Spend</span>
                    <span className="font-mono font-bold text-rose-400">₹{Number(spent).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {canManage && user?.role !== 'AUDITOR' && (
                    <button
                      onClick={() => setAssignCampaignId(c.id)}
                      className="flex-1 py-2 bg-[#16335F] hover:bg-[#1E437C] text-amber-300 font-bold text-xs rounded-xl border border-amber-500/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Assign Volunteer Quota</span>
                    </button>
                  )}

                  {user?.role !== 'AUDITOR' && (
                    <button
                      onClick={onOpenQuickCollect}
                      className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Collect</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleCreateCampaign} className="bg-[#0B1B36] border border-amber-500/30 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" />
              Create Fundraising Campaign
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Campaign Title *</label>
              <input
                type="text"
                placeholder="e.g. Sri Krishna Janmashtami 2026 Grand Celebration"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
              <textarea
                placeholder="Describe campaign goals, Annadanam details, youth awards..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl p-3 text-xs text-white outline-none h-20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">Target Amount (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 250000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full bg-[#061224] border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold font-mono outline-none"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="FESTIVAL">Festival / Cultural</option>
                  <option value="COMMUNITY_DEVELOPMENT">Community Development</option>
                  <option value="COMMUNITY_SERVICE">Community Service</option>
                  <option value="EMERGENCY_AID">Emergency Aid</option>
                  <option value="SPORTS">Sports & Youth</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date *</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">End Date (Optional)</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Lead Organizer (Committee Member)</label>
              <select
                value={organizerId}
                onChange={(e) => setOrganizerId(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="">Select In-Charge Member</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} ({m.role_title})</option>
                ))}
              </select>
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
                {submitting ? 'Creating...' : 'Launch Campaign'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assign Quota Modal */}
      {assignCampaignId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleAssignQuota} className="bg-[#0B1B36] border border-amber-500/30 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              Assign Collection Responsibility
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Committee Volunteer *</label>
              <select
                value={assignMemberId}
                onChange={(e) => setAssignMemberId(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                required
              >
                <option value="">Select Member</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} - {m.area_location} ({m.role_title})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-300 mb-1">Assigned Collection Target (₹) *</label>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={assignTarget}
                onChange={(e) => setAssignTarget(e.target.value)}
                className="w-full bg-[#061224] border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold font-mono outline-none"
                min="1"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAssignCampaignId(null)}
                className="px-4 py-2 bg-[#16335F] text-slate-300 text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={assigning}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
              >
                {assigning ? 'Assigning...' : 'Confirm Assignment'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
