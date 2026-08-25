import React from 'react';
import { UserCheck } from 'lucide-react';

export const TeamPage: React.FC = () => {
  const leaders = [
    {
      name: 'Ramesh Yadav',
      role: 'President',
      bio: 'Leading Sri Krishna Yadav Youth with grassroots community experience in Guraja. Dedicated to cultural unity, temple festivals, and youth development.',
      initials: 'RY',
      image: '/images/gallery/guraja_youth_volunteers_group.png'
    },
    {
      name: 'Mahesh Yadav',
      role: 'Secretary',
      bio: 'Coordinates village cultural drives, event operations, youth volunteers, and keeps records of committee meetings and public resolutions.',
      initials: 'MY',
      image: '/images/gallery/youth_tractor_ratham_procession.png'
    },
    {
      name: 'Suresh Yadav',
      role: 'Treasurer',
      bio: 'Manages the double-entry accounting ledger, digital receipt verification, vendor disbursements, and verified bank records.',
      initials: 'SY',
      image: '/images/gallery/krishna_swamy_golden_arch.jpg'
    },
    {
      name: 'Venkatesh Yadav',
      role: 'Joint Secretary',
      bio: 'Oversees youth festival rallies, sound & lighting setup, and village community welfare programs.',
      initials: 'VY',
      image: '/images/gallery/guraja_youth_procession_rally.png'
    }
  ];

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-900">
      {/* Dark Header Banner */}
      <div className="bg-gradient-to-b from-[#050E1C] via-[#08152B] to-[#040C18] text-white py-14 px-4 text-center border-b border-amber-500/20">
        <div className="max-w-4xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
            COMMITTEE LEADERSHIP
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
            OUR TEAM
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Dedicated youth committee members who volunteer their time and energy to serve Guraja village.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leaders.map((m) => (
            <div
              key={m.name}
              className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between text-center group"
            >
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
                  <div className="text-xs font-bold text-[#D4A244] uppercase tracking-wider">
                    {m.role}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pt-1">
                    {m.bio}
                  </p>
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
    </div>
  );
};

export default TeamPage;
