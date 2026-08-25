import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

interface EventsPageProps {
  onOpenDonate: (campaignName?: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onOpenDonate }) => {
  const [tab, setTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');

  const upcomingEvents = [
    {
      id: 'ev-1',
      title: 'Sri Krishna Janmashtami 2026 Grand Utlotsavam',
      date: 'August 28, 2026',
      time: '04:00 PM - 11:30 PM',
      venue: 'Sri Krishna Temple Grounds, Main Road, Guraja',
      description: 'Annual cultural festival with traditional Pot Breaking (Utlotsavam), devotional singing, community feast (Annadanam), and prize distribution for village students.',
      expectedAttendance: '2,500+ Devotees & Youth',
      coordinator: 'K. Nageswara Rao (President)',
      supportCampaign: 'Sri Krishna Janmashtami 2026 Grand Celebration'
    },
    {
      id: 'ev-2',
      title: 'Guraja Youth Competitive Exam Orientation Workshop',
      date: 'September 12, 2026',
      time: '10:00 AM - 01:00 PM',
      venue: 'Yadav Youth Study Bhavan, Guraja',
      description: 'Special mentoring session with state government rankers on cracking APPSC Group 1/2 and Banking exams for Guraja college youth.',
      expectedAttendance: '120+ Aspirants',
      coordinator: 'P. Venkanna (Secretary)',
      supportCampaign: 'Youth Community Study Hall & Digital Library'
    }
  ];

  const pastEvents = [
    {
      id: 'ev-p1',
      title: 'Annual Youth Day & Blood Donation Camp',
      date: 'January 12, 2026',
      venue: 'Guraja Panchayat Hall',
      description: 'Mobilized 85 units of blood in partnership with Red Cross Vijayawada and conducted free health screenings.',
      highlights: '85 Units Collected • 180 Youth Volunteers'
    },
    {
      id: 'ev-p2',
      title: 'Guraja Clean Village & Green Tree Plantation Drive',
      date: 'June 5, 2025',
      venue: 'Village Main Streets & Canal Bund',
      description: 'Planted 400 neem and fruit-bearing saplings along the Guraja canal road with youth volunteer brigades.',
      highlights: '400 Trees Planted'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
          Community Events & Programs
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Gatherings, cultural celebrations, youth orientation workshops, and welfare drives organized by Sri Krishna Yadav Youth Guraja.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setTab('UPCOMING')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all border ${
            tab === 'UPCOMING'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
              : 'bg-[#0B1B36] text-slate-300 border-white/10'
          }`}
        >
          Upcoming Events
        </button>
        <button
          onClick={() => setTab('PAST')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all border ${
            tab === 'PAST'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
              : 'bg-[#0B1B36] text-slate-300 border-white/10'
          }`}
        >
          Past Accomplishments
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {tab === 'UPCOMING' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-6 bg-[#0B1B36] border border-amber-500/30 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 font-mono">
                    <Calendar className="w-4 h-4" />
                    <span>{ev.date}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-300">{ev.time}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white leading-snug">{ev.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{ev.description}</p>

                  <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{ev.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>Expected: <b className="text-white">{ev.expectedAttendance}</b></span>
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => onOpenDonate(ev.supportCampaign)}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Support Event Fund</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastEvents.map((ev) => (
              <div key={ev.id} className="p-6 bg-[#0B1B36] border border-white/10 rounded-3xl space-y-3 shadow-xl">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-emerald-400 font-mono font-bold">{ev.date}</span>
                  <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-white/5 border border-white/10">Completed</span>
                </div>
                <h3 className="text-base font-bold text-white">{ev.title}</h3>
                <p className="text-xs text-slate-300">{ev.description}</p>
                <div className="p-3 bg-[#061224] rounded-xl text-xs text-amber-300 font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{ev.highlights}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
