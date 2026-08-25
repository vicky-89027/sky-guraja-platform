import React, { useState } from 'react';
import { Award, MapPin, Calendar, CheckCircle2, Filter, Layers } from 'lucide-react';

export const WorkPage: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string>('ALL');

  const projects = [
    {
      id: 1,
      title: 'Guraja Village RO Clean Drinking Water Plant Installation',
      category: 'COMMUNITY_SERVICE',
      date: 'March 2025 - Ongoing',
      location: 'Near Yadav Youth Bhavan, Guraja',
      impact: 'Provides 20 Litres of 100% purified mineral water daily to 600+ households.',
      budget: '₹4,50,000',
      status: 'Active & Maintained'
    },
    {
      id: 2,
      title: 'Youth Digital Library & Competitive Examination Center',
      category: 'EDUCATION_SUPPORT',
      date: 'January 2026',
      location: 'Main Road Study Center, Guraja',
      impact: 'Equipped with 6 high-speed desktop PCs, AC study hall, and 450+ reference textbooks for APPSC/UPSC.',
      budget: '₹1,80,000',
      status: 'Completed'
    },
    {
      id: 3,
      title: 'Annual Sri Krishna Utlotsavam (Dahi Handi) & Cultural Festival',
      category: 'CULTURAL_ACTIVITIES',
      date: 'August 2025',
      location: 'Temple Ground, Guraja',
      impact: 'Organized traditional village folk sports, Annadanam for 3,000 visitors, and merit scholarships.',
      budget: '₹2,10,000',
      status: 'Completed'
    },
    {
      id: 4,
      title: 'Emergency Flood Relief & Food Distribution Wing',
      category: 'EMERGENCY_ASSISTANCE',
      date: 'September 2024',
      location: 'Guraja & Surrounding Low-Lying Hamlets',
      impact: 'Distributed 1,200 dry ration kits, drinking water packets, and essential medical supplies during seasonal rains.',
      budget: '₹95,000',
      status: 'Completed'
    },
    {
      id: 5,
      title: 'Free Mega Health & Blood Donation Drive',
      category: 'SOCIAL_INITIATIVES',
      date: 'November 2025',
      location: 'Zilla Parishad High School, Guraja',
      impact: '150+ blood units mobilized for Government Hospital; free eye checks and spectacles distributed to 80 elders.',
      budget: '₹40,000',
      status: 'Completed'
    },
    {
      id: 6,
      title: 'Village Youth Cricket & Kabaddi Sports Championship',
      category: 'YOUTH_ACTIVITIES',
      date: 'May 2026',
      location: 'Guraja Sports Ground',
      impact: '16 rural teams participated; awarded sports kits and coaching mentorship to youth athletes.',
      budget: '₹35,000',
      status: 'Completed'
    }
  ];

  const categories = [
    { id: 'ALL', label: 'All Projects' },
    { id: 'COMMUNITY_SERVICE', label: 'Community Service' },
    { id: 'EDUCATION_SUPPORT', label: 'Education Support' },
    { id: 'CULTURAL_ACTIVITIES', label: 'Cultural Activities' },
    { id: 'EMERGENCY_ASSISTANCE', label: 'Emergency Assistance' },
    { id: 'YOUTH_ACTIVITIES', label: 'Youth Activities' }
  ];

  const filtered = selectedCat === 'ALL'
    ? projects
    : projects.filter((p) => p.category === selectedCat);

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
          Our Work & Impact
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Transforming Guraja through accountable youth action, infrastructure development, educational programs, and selfless community service.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCat(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              selectedCat === c.id
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-[#0B1B36] text-slate-300 border-white/10 hover:border-amber-500/30'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-6 bg-[#0B1B36] border border-white/10 rounded-3xl space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase">
                  {item.category.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{item.status}</span>
                </span>
              </div>

              <h3 className="font-bold text-white text-base leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.impact}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-400" />{item.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{item.date}</span>
                <span className="font-mono text-emerald-300 font-bold">{item.budget}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
