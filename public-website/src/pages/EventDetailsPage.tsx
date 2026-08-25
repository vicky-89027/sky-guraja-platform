import React from 'react';
import { Calendar, Clock, MapPin, User, ArrowLeft, CheckCircle2, Share2 } from 'lucide-react';

interface EventDetailsPageProps {
  onBack: () => void;
}

export const EventDetailsPage: React.FC<EventDetailsPageProps> = ({ onBack }) => {
  const event = {
    title: 'Sri Krishna Janmashtami & Utlotsavam Mahotsavam 2026',
    date: '15 January 2027',
    time: '06:00 AM - 10:00 PM',
    location: 'Sri Krishna Mandiram & Main Junction, Guraja Village',
    coordinator: 'Sri Krishna Yadav Youth Committee Guraja',
    image: '/images/gallery/youth_tractor_ratham_procession.png',
    description: `The Sri Krishna Janmashtami & Utlotsavam (Dahi Handi) is the signature annual cultural and religious festival organized by Sri Krishna Yadav Youth in Guraja village. 

Starting with early morning sacred abhishekam and floral alankaram, the festivities proceed with devotional bhajans, holy ratham procession across Guraja streets, student merit prize awards, competitive Dahi Handi breaking (Utlotsavam), and grand community Annadanam feast.`,
    schedule: [
      { time: '06:00 AM - 08:30 AM', event: 'Maha Abhishekam & Golden Prabhavali Alankaram at Sri Krishna Mandir' },
      { time: '09:00 AM - 11:30 AM', event: 'Devotional Bhajans & Community Kumkum Puja' },
      { time: '12:00 PM - 03:00 PM', event: 'Mass Annadanam (Prasadam Distribution) for 2500+ Devotees' },
      { time: '04:00 PM - 07:30 PM', event: 'Grand Tractor Ratham Devotional Procession & Youth Rally' },
      { time: '08:00 PM - 10:00 PM', event: 'Utlotsavam (Dahi Handi Breaking Competition) & Merit Award Distribution' }
    ]
  };

  const handleRegister = () => {
    alert('Thank you for registering your attendance! We look forward to celebrating with you at Sri Krishna Mandiram, Guraja.');
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-900 min-h-screen">
      {/* Dark Header Banner */}
      <div className="bg-gradient-to-b from-[#050E1C] via-[#08152B] to-[#040C18] text-white py-10 px-4 border-b border-amber-500/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events</span>
          </button>
          <span className="text-[10px] font-mono px-3 py-1 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-full uppercase">
            EVENT ID: SKY-EV-2026-01
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-950 h-80 sm:h-96 relative">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 leading-tight">
                {event.title}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#D4A244]" />
                  <span>Date: <b>{event.date}</b></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#D4A244]" />
                  <span>Timing: <b>{event.time}</b></span>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <MapPin className="w-4 h-4 text-[#D4A244]" />
                  <span>Venue: <b>{event.location}</b></span>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <User className="w-4 h-4 text-[#D4A244]" />
                  <span>Coordinator: <b>{event.coordinator}</b></span>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {event.description}
              </div>
            </div>

            {/* Event Schedule Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 uppercase font-display">
                Event Day Schedule & Agenda
              </h3>
              <div className="space-y-3">
                {event.schedule.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-bold font-mono rounded-lg flex-shrink-0">
                      {item.time}
                    </span>
                    <span className="font-medium text-slate-700 mt-0.5">{item.event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Register Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg space-y-5 sticky top-24">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  PARTICIPATION
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Attend this Festival
                </h3>
                <p className="text-xs text-slate-500">
                  Join with your family and be part of Guraja's grandest festival.
                </p>
              </div>

              <button
                onClick={handleRegister}
                className="w-full py-3.5 bg-[#D4A244] hover:bg-[#C49132] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all text-center"
              >
                REGISTER ATTENDANCE NOW
              </button>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1 text-xs text-amber-950">
                <b className="block">Free Community Annadanam</b>
                <span>Nutritious meals & sweets served for all devotees throughout the day.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
