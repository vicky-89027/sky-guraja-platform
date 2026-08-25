import React, { useState } from 'react';
import { Clock, MapPin } from 'lucide-react';

interface EventsPageProps {
  onOpenDonate: (campaignName?: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = () => {
  const events = [
    {
      id: 'ev-1',
      title: 'Sri Krishna Janmashtami & Utlotsavam Mahotsavam',
      date: '15 JAN 2027',
      time: '06:00 AM - 10:00 PM',
      location: 'Sri Krishna Mandiram & Main Junction, Guraja',
      category: 'FESTIVAL',
      image: '/images/gallery/radha_krishna_janmashtami_banner.jpg',
      description: 'Traditional Utlotsavam (Dahi Handi), devotional bhajans, prize distribution for student merit toppers, and Annadanam for 2500+ devotees.'
    },
    {
      id: 'ev-2',
      title: 'Guraja Youth Tractor Chariot Procession Rally',
      date: '12 OCT 2026',
      time: '04:00 PM - 09:00 PM',
      location: 'Yadav Youth Bhavan & Village Streets, Guraja',
      category: 'YOUTH RALLY',
      image: '/images/gallery/youth_tractor_ratham_procession.png',
      description: 'Grand devotional tractor chariot procession with traditional drums, lighting, and cultural performances by village youth.'
    },
    {
      id: 'ev-3',
      title: 'Devi Navaratri Mahotsavam & Special Puja',
      date: '25 NOV 2026',
      time: '08:00 AM - 08:00 PM',
      location: 'Sri Krishna Mandiram, Guraja',
      category: 'CULTURAL',
      image: '/images/gallery/devi_navaratri_guraja_banner.jpg',
      description: 'Special 9-day Navaratri Alankaram, Harati deepam, and community prasadam distribution organized by youth committee.'
    }
  ];

  const handleRegisterEvent = (eventTitle: string) => {
    alert(`Registration recorded for "${eventTitle}". See you at Yadav Youth Bhavan, Guraja!`);
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-900">
      {/* Dark Header Banner */}
      <div className="bg-gradient-to-b from-[#050E1C] via-[#08152B] to-[#040C18] text-white py-14 px-4 text-center border-b border-amber-500/20">
        <div className="max-w-4xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
            COMMUNITY ASSEMBLIES
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
            UPCOMING EVENTS
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Participate in youth rallies, cultural festivals, and community celebrations in Guraja.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((e) => (
            <div
              key={e.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={e.image}
                    alt={e.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#08152B] text-white border border-amber-500/40 px-3 py-1.5 rounded-xl text-center shadow-lg">
                    <div className="text-[10px] font-black text-amber-400 font-mono leading-none">
                      {e.date.split(' ')[0]}
                    </div>
                    <div className="text-[9px] font-bold text-slate-300 uppercase leading-none mt-0.5">
                      {e.date.split(' ')[1]}
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-[#D4A244] border border-amber-200 uppercase">
                    {e.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {e.title}
                  </h3>
                  <div className="space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{e.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{e.location}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {e.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => handleRegisterEvent(e.title)}
                  className="w-full py-2.5 bg-[#D4A244] hover:bg-[#C49132] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow transition-all text-center"
                >
                  REGISTER NOW
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
