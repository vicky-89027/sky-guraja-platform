import React from 'react';
import { Eye, Target, Award, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full bg-[#F8FAFC] text-slate-900">
      {/* Dark Header Banner */}
      <div className="bg-gradient-to-b from-[#050E1C] via-[#08152B] to-[#040C18] text-white py-14 px-4 text-center border-b border-amber-500/20">
        <div className="max-w-4xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
            ESTABLISHED IN GURAJA
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
            ABOUT US
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            "United for Community. Inspired by Krishna. Working for a Better Tomorrow."
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Column: Story & Mission */}
          <div className="space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#D4A244] uppercase tracking-wider">
                OUR JOURNEY & VALUES
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 leading-tight">
                Sri Krishna Yadav Youth Guraja
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Founded in <b>Guraja village, Krishna District, Andhra Pradesh</b>, Sri Krishna Yadav Youth (SKY) is a grassroots non-profit youth organization committed to cultural heritage, community service, temple celebrations, and youth empowerment.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              Our committee is dedicated to 100% financial transparency. Every rupee collected from village devotees, youth members, and supporters across the globe is directly recorded in our public digital ledger with verified vouchers and instant digital receipt generation.
            </p>

            <div className="space-y-2.5 pt-2">
              {[
                '100% Publicly Audited Double-Entry Financial Governance',
                'Grand Sri Krishna Janmashtami & Utlotsavam Mahotsavam Celebrations',
                'Youth Solidarity Rallies, Tractor Ratham Processions & Cultural Drives',
                'Village Welfare, Navaratri Utsavams & Community Annadanam Seva'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Real Guraja Youth Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 h-80 sm:h-96">
              <img
                src="/images/gallery/guraja_youth_volunteers_group.png"
                alt="Guraja Youth Committee"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-[#08152B] text-white p-4 rounded-2xl border border-amber-500/30 shadow-xl hidden sm:block">
              <div className="text-lg font-black text-amber-400 font-mono">10+ Years</div>
              <div className="text-[10px] text-slate-300">Grassroots Village Service in Guraja</div>
            </div>
          </div>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D4A244] flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Our Vision</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To build a prosperous, united Guraja where cultural heritage is celebrated with devotion and youth lead community progress.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Our Mission</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To manage community funds with zero corruption, celebrate grand festivals, and execute impactful welfare initiatives.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Our Values</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Selfless service, democratic committee elections, absolute financial integrity, and brotherhood inspired by Lord Krishna.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
