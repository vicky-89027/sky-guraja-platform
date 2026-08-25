import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { EventItem, CommitteeMember, Campaign, AuthUser } from '../types';
import { Calendar, PlusCircle, MapPin, Users, IndianRupee, Clock, CheckCircle2 } from 'lucide-react';

interface EventsViewProps {
  user: AuthUser | null;
}

export const EventsView: React.FC<EventsViewProps> = ({ user }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('18:00');
  const [venue, setVenue] = useState('');
  const [coordinatorId, setCoordinatorId] = useState('');
  const [budget, setBudget] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [participantsCount, setParticipantsCount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    setLoading(true);
    Promise.all([api.getEvents(), api.getMembers(), api.getCampaigns()])
      .then(([evRes, memRes, campRes]) => {
        if (evRes.success) setEvents(evRes.data);
        if (memRes.success) setMembers(memRes.data);
        if (campRes.success) setCampaigns(campRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !eventDate || !venue) {
      alert('Please fill required fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createEvent({
        name,
        description,
        eventDate,
        eventTime,
        venue,
        coordinatorId: coordinatorId || undefined,
        budget: Number(budget) || 0,
        campaignId: campaignId || undefined,
        participantsCount: Number(participantsCount) || 0
      });

      if (res.success) {
        setIsModalOpen(false);
        setName('');
        setDescription('');
        setVenue('');
        setBudget('');
        loadEvents();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create event');
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
            <Calendar className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl lg:text-2xl font-black text-white font-display">
              Events & Community Programs
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Village festival schedules, youth health camps, budget allocations & actual spends
          </p>
        </div>

        {canManage && user?.role !== 'AUDITOR' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Schedule New Event</span>
          </button>
        )}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 py-12 text-center text-slate-400 text-xs">Loading event calendar...</div>
        ) : events.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-400 text-xs">No scheduled events.</div>
        ) : (
          events.map((ev) => (
            <div
              key={ev.id}
              className="bg-[#0B1B36] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {ev.event_date} {ev.event_time ? `• ${ev.event_time}` : ''}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      ev.status === 'UPCOMING'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {ev.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white font-display leading-snug">{ev.name}</h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">{ev.description}</p>

                <div className="mt-3 space-y-1 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-slate-200">{ev.venue}</span>
                  </div>
                  {ev.coordinator_name && (
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>Coordinator: <b className="text-white">{ev.coordinator_name}</b></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial & Attendees Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-[#061224] rounded-xl border border-white/5 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Budget</span>
                  <span className="font-mono font-bold text-amber-300">₹{Number(ev.budget).toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Actual Spend</span>
                  <span className="font-mono font-bold text-rose-400">₹{Number(ev.actual_expenses_sum || ev.actual_expense || 0).toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Participants</span>
                  <span className="font-mono font-bold text-white">{ev.participants_count}+</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleCreateEvent} className="bg-[#0B1B36] border border-amber-500/30 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              Schedule Community Event
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Event Name *</label>
              <input
                type="text"
                placeholder="e.g. Utlotsavam & Cultural Night 2026"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date *</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Time</label>
                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Venue / Location in Guraja *</label>
              <input
                type="text"
                placeholder="e.g. Sri Krishna Temple Grounds, Guraja"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">Allocated Budget (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Event Coordinator</label>
                <select
                  value={coordinatorId}
                  onChange={(e) => setCoordinatorId(e.target.value)}
                  className="w-full bg-[#061224] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="">Select Coordinator</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} ({m.role_title})</option>
                  ))}
                </select>
              </div>
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
                {submitting ? 'Saving...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
