import React from 'react';
import { Users, Shield, Award, Mail, Phone } from 'lucide-react';

export const TeamPage: React.FC = () => {
  const leaders = [
    {
      name: 'Ramesh Yadav',
      role: 'President',
      bio: 'Leading Sri Krishna Yadav Youth with grassroots community experience in Guraja. Dedicated to education and cultural unity.',
      initials: 'RY',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Mahesh Yadav',
      role: 'Secretary',
      bio: 'Coordinates village social drives, event operations, youth volunteers, and keeps records of committee meetings.',
      initials: 'MY',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Suresh Yadav',
      role: 'Treasurer',
      bio: 'Manages the double-entry accounting ledger, digital receipt verification, vendor disbursements, and bank accounts.',
      initials: 'SY',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Venkatesh Yadav',
      role: 'Joint Secretary',
      bio: 'Oversees youth sports tournaments, educational library setup, and village elder welfare programs.',
      initials: 'VY',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'
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
            Meet the dedicated youth committee members who volunteer their time and energy to serve Guraja.
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
                {/* Photo */}
                <div className="relative h-60 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
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
                <span className="text-emerald-600 font-medium">Guraja, AP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
