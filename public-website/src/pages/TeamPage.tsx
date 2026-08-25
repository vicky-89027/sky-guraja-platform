import React from 'react';
import { Users, Shield, Award, Heart } from 'lucide-react';

export const TeamPage: React.FC = () => {
  const leaders = [
    {
      name: 'K. Nageswara Rao Yadav',
      role: 'President',
      bio: 'Leading the youth committee with over 10 years of grassroots community experience in Guraja. Dedicated to education and cultural unity.',
      initials: 'KN',
      badgeColor: 'border-amber-400 text-amber-300'
    },
    {
      name: 'P. Venkanna Yadav',
      role: 'General Secretary',
      bio: 'Coordinates village social drives, event operations, youth volunteers, and keeps records of committee meetings and initiatives.',
      initials: 'PV',
      badgeColor: 'border-emerald-400 text-emerald-300'
    },
    {
      name: 'M. Jagadeesh Yadav',
      role: 'Treasurer',
      bio: 'Manages the double-entry accounting ledger, digital receipt verification, vendor disbursements, and bank reconciliations.',
      initials: 'MJ',
      badgeColor: 'border-cyan-400 text-cyan-300'
    },
    {
      name: 'T. Rama Krishna',
      role: 'Vice President',
      bio: 'Oversees youth sports tournaments, educational library setup, and village elder welfare programs.',
      initials: 'TR',
      badgeColor: 'border-purple-400 text-purple-300'
    },
    {
      name: 'S. Venkateswara Rao',
      role: 'Internal Auditor',
      bio: 'Independent financial inspector ensuring that every single receipt and expense has valid vouchers before publication.',
      initials: 'SV',
      badgeColor: 'border-rose-400 text-rose-300'
    },
    {
      name: 'B. Krishna Murthy',
      role: 'Youth Volunteer Lead',
      bio: 'Leads our 50+ energetic student and young professional volunteers across field collection, temple festivals, and flood relief.',
      initials: 'BK',
      badgeColor: 'border-amber-400 text-amber-300'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
          Committee Leadership & Volunteers
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Meet the dedicated youth committee members who volunteer their time and energy to serve Sri Krishna Yadav Youth Guraja.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {leaders.map((member) => (
          <div
            key={member.name}
            className="p-6 bg-[#0B1B36] border border-white/10 rounded-3xl space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-xl group"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#061224] to-[#16335F] border-2 border-amber-500/40 flex items-center justify-center text-amber-300 font-black text-lg font-display shadow-lg group-hover:scale-105 transition-transform">
                  {member.initials}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base leading-tight">{member.name}</h3>
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${member.badgeColor} mt-1 inline-block bg-white/5`}>
                    {member.role}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pt-1">{member.bio}</p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
              <span>Sri Krishna Yadav Youth</span>
              <span className="text-emerald-400 font-medium">Guraja, AP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
