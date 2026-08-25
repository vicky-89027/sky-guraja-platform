import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

interface EventsPageProps {
  onOpenDonate: (campaignName?: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onOpenDonate }) => {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const events = [
    {
      id: 'ev-1',
      title: 'Youth Leadership Workshop & Skill Assembly',
      date: '12 OCT 2026',
      time: '09:30 AM - 01:30 PM',
      location: 'Yadav Youth Bhavan, Main Road, Guraja',
      category: 'WORKSHOP',
      image: '/images/gallery/youth_study_hall_library.png',
      fallbackImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
      description: 'Career guidance, competitive exam prep methods, and communication workshops for Guraja students and youth volunteers.'
    },
    {
      id: 'ev-2',
      title: 'Grand Blood Donation & Free Health Screening Camp',
      date: '25 NOV 2026',
      time: '08:00 AM - 03:00 PM',
      location: 'Community Health Center, Guraja',
      category: 'HEALTHCARE',
      image: '/images/gallery/medical_camp_doctors.png',
      fallbackImage: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80',
      description: 'Quarterly voluntary blood donation drive organized in association with District Red Cross and government doctors.'
    },
    {
      id: 'ev-3',
      title: 'Sri Krishna Janmashtami & Utlotsavam Mahotsavam',
      date: '15 JAN 2027',
      time: '06:00 AM - 10:00 PM',
      location: 'Sri Krishna Mandiram & Main Junction, Guraja',
      category: 'FESTIVAL',
      image: '/images/gallery/krishna_swamy_golden_arch.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80',
      description: 'Traditional Utlotsavam (Dahi Handi), devotional bhajans, prize distribution for student merit toppers, and Annadanam for 2500+ devotees.'
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
            Participate in youth workshops, welfare camps, and cultural festivals in Guraja.
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
                {/* Photo & Date Badge */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={e.image}
                    alt={e.title}
                    onError={(ev: any) => {
                      ev.target.onerror = null;
                      ev.target.src = e.fallbackImage;
                    }}
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
