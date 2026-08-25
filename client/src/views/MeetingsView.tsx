import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { MeetingItem, CommitteeMember, AuthUser } from '../types';
import { ClipboardList, PlusCircle, CheckCircle2, Clock, MapPin, Calendar, CheckSquare, Square } from 'lucide-react';

interface MeetingsViewProps {
  user: AuthUser | null;
}

export const MeetingsView: React.FC<MeetingsViewProps> = ({ user }) => {
  const [meetings, setMeetings] = useState<MeetingItem[]>([]);
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  // New Meeting Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('SKY Youth Bhavan, Guraja');
  const [agenda, setAgenda] = useState('');
  const [decisions, setDecisions] = useState('');
  const [actionTitle, setActionTitle] = useState('');
  const [actionAssignee, setActionAssignee] = useState('');
  const [actionDeadline, setActionDeadline] = useState('');
  const [actionItems, setActionItems] = useState<{ title: string; assignedToId: string; deadline: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = () => {
    setLoading(true);
    Promise.all([api.getMeetings(), api.getMembers()])
      .then(([mtgRes, memRes]) => {
        if (mtgRes.success) setMeetings(mtgRes.data);
        if (memRes.success) setMembers(memRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleToggleActionItem = async (itemId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await api.updateActionItemStatus(itemId, newStatus);
      loadMeetings();
    } catch (err: any) {
      alert(err.message || 'Failed to update action item');
    }
  };

  const handleAddActionItemRow = () => {
    if (!actionTitle) return;
    setActionItems([...actionItems, { title: actionTitle, assignedToId: actionAssignee, deadline: actionDeadline }]);
    setActionTitle('');
    setActionAssignee('');
    setActionDeadline('');
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !meetingDate || !agenda) {
      alert('Please fill meeting title, date and agenda');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createMeeting({
        title,
        meetingDate,
        location,
        agenda,
        decisions: decisions || undefined,
        actionItems
      });

      if (res.success) {
        setIsModalOpen(false);
        setTitle('');
        setAgenda('');
        setDecisions('');
        setActionItems([]);
        loadMeetings();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create meeting');
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
            <ClipboardList className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl lg:text-2xl font-black text-white font-display">
              Committee Meetings & Action Items
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Official meeting minutes, resolutions, and tracked assigned tasks for committee members
          </p>
        </div>

        {canManage && user?.role !== 'AUDITOR' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record Meeting & Action Items</span>
          </button>
        )}
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">Loading meetings...</div>
        ) : meetings.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">No meetings recorded yet.</div>
        ) : (
          meetings.map((m) => (
            <div key={m.id} className="bg-[#0B1B36] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span className="font-mono text-xs text-amber-300 font-bold">{m.meeting_date}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {m.location}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white font-display mt-1">{m.title}</h3>
                </div>
                <div className="text-[11px] text-slate-400">
                  Recorded by: <span className="text-slate-200 font-medium">{m.created_by_name || 'Secretary'}</span>
                </div>
              </div>

              {/* Agenda & Decisions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-[#061224] rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Meeting Agenda</span>
                  <div className="text-slate-300 whitespace-pre-line leading-relaxed">{m.agenda}</div>
                </div>

                <div className="p-3.5 bg-[#061224] rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Decisions & Resolutions</span>
                  <div className="text-slate-300 whitespace-pre-line leading-relaxed">
                    {m.decisions || 'No formal resolutions recorded.'}
                  </div>
                </div>
              </div>

              {/* Action Items List */}
              {m.actionItems && m.actionItems.length > 0 && (
                <div className="pt-2 space-y-2">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Assigned Action Items ({m.actionItems.length}):
                  </span>
                  <div className="space-y-1.5">
                    {m.actionItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => user?.role !== 'AUDITOR' && handleToggleActionItem(item.id, item.status)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
                          item.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-400 line-through'
                            : 'bg-[#0E2447] border-white/10 text-white hover:border-amber-400'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {item.status === 'COMPLETED' ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          )}
                          <span className="font-medium">{item.title}</span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px]">
                          {item.assigned_to_name && (
                            <span className="text-amber-300 font-semibold bg-amber-500/15 px-2 py-0.5 rounded">
                              {item.assigned_to_name}
                            </span>
                          )}
                          {item.deadline && (
                            <span className="text-slate-400 font-mono">Due: {item.deadline}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Meeting Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleCreateMeeting} className="bg-[#0B1B36] border border-amber-500/30 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-amber-400" />
              Record Committee Meeting & Tasks
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Meeting Title *</label>
              <input
                type="text"
                placeholder="e.g. Executive Committee Monthly Planning Meeting"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date *</label>
                <input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Location *</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Meeting Agenda *</label>
              <textarea
                placeholder="1. Review of donations\n2. Stage sound quotations\n3. Route map..."
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl p-3 text-xs text-white outline-none h-20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Key Decisions / Resolutions</label>
              <textarea
                placeholder="Unanimously approved vendor quotation..."
                value={decisions}
                onChange={(e) => setDecisions(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl p-3 text-xs text-white outline-none h-20"
              />
            </div>

            {/* Inline Action Items Add */}
            <div className="p-3 bg-[#061224] rounded-xl border border-white/10 space-y-2">
              <span className="text-xs font-bold text-amber-300 block">Add Action Items</span>
              <input
                type="text"
                placeholder="Task description..."
                value={actionTitle}
                onChange={(e) => setActionTitle(e.target.value)}
                className="w-full bg-[#0B1B36] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={actionAssignee}
                  onChange={(e) => setActionAssignee(e.target.value)}
                  className="w-full bg-[#0B1B36] border border-white/15 rounded-lg px-2 py-1.5 text-xs text-white outline-none"
                >
                  <option value="">Assign To Member</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={actionDeadline}
                  onChange={(e) => setActionDeadline(e.target.value)}
                  className="w-full bg-[#0B1B36] border border-white/15 rounded-lg px-2 py-1.5 text-xs text-white outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleAddActionItemRow}
                className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold"
              >
                + Add Task to Agenda
              </button>

              {actionItems.length > 0 && (
                <div className="space-y-1 pt-1">
                  {actionItems.map((item, idx) => (
                    <div key={idx} className="text-[11px] text-slate-300 flex items-center justify-between">
                      <span>• {item.title}</span>
                      <span className="text-amber-400 font-mono">Due: {item.deadline || 'N/A'}</span>
                    </div>
                  ))}
                </div>
              )}
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
                {submitting ? 'Saving...' : 'Save Meeting Minutes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
