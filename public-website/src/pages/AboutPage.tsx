import React from 'react';
import { SkyLogo } from '../components/SkyLogo';
import { ShieldCheck, Heart, Users, Sparkles, Award, Target, Eye, BookOpen } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500/15 text-amber-300 text-xs font-mono font-bold rounded-full border border-amber-500/40 uppercase">
          <BookOpen className="w-3.5 h-3.5" />
          <span>About Sri Krishna Yadav Youth Guraja</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
          Heritage • Unity • Service
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Founded in Guraja, Krishna District, Andhra Pradesh, <b>Sri Krishna Yadav Youth (SKY)</b> is a grassroots non-profit community youth committee dedicated to uplifting village education, preserving sacred cultural traditions, and ensuring 100% transparent management of public community funds.
        </p>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-[#0B1B36] border border-amber-500/30 rounded-3xl space-y-4 shadow-xl relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white font-display">Our Vision</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            To build a progressive, self-sustaining, and culturally vibrant Guraja village where every youth is empowered with education, modern digital skills, and community solidarity inspired by the timeless teachings of Sri Krishna.
          </p>
        </div>

        <div className="p-8 bg-[#0B1B36] border border-emerald-500/30 rounded-3xl space-y-4 shadow-xl relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white font-display">Our Mission</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            To manage community resources with zero corruption and absolute transparency; to execute high-impact social projects including clean drinking water, education study halls, health camps, and cultural Janmashtami celebrations.
          </p>
        </div>
      </div>

      {/* 5 Core Values */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-white font-display text-center uppercase tracking-wide">
          Our Five Guiding Pillars
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { title: 'UNITY', sub: 'Youth Solidarity', desc: 'Bringing the entire community together above politics, fostering mutual brotherhood and cooperation.', icon: '👥' },
            { title: 'CULTURE', sub: 'Krishna Heritage', desc: 'Preserving our sacred festivals, folk arts, Utlotsavam traditions, and moral heritage for the next generation.', icon: '🪈' },
            { title: 'SEVA', sub: 'Selfless Service', desc: 'Serving the needy with free drinking water, Annadanam, emergency medical support, and disaster relief.', icon: '🤲' },
            { title: 'YOUTH POWER', sub: 'Empowerment', desc: 'Mentoring village students, providing competitive exam resources, libraries, and promoting athletic talent.', icon: '✊' },
            { title: 'PROGRESS', sub: 'Village Upliftment', desc: 'Pioneering digital transparency where every collected rupee is public, auditable, and traceably spent.', icon: '📈' },
          ].map((v) => (
            <div key={v.title} className="p-5 bg-[#0B1B36] border border-white/10 rounded-2xl space-y-2">
              <div className="text-2xl mb-1">{v.icon}</div>
              <h3 className="font-bold text-amber-300 text-sm font-display">{v.title}</h3>
              <span className="text-[10px] text-emerald-400 font-bold block">{v.sub}</span>
              <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Organization Roots in Guraja */}
      <div className="p-8 bg-gradient-to-r from-[#0B1B36] via-[#102549] to-[#0B1B36] border border-amber-500/25 rounded-3xl space-y-4">
        <h2 className="text-xl font-bold text-white font-display">Rooted in Guraja, Andhra Pradesh</h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Operating out of **Yadav Youth Bhavan** on Main Road in Guraja village, Krishna District, our committee is composed of energetic students, young professionals, farmers, and elders working hand-in-hand. We operate on the foundational principle that **trust is built through open books**.
        </p>
      </div>
    </div>
  );
};
