import React, { useState } from 'react';
import { Users, CheckCircle2, Heart, Award, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const JoinUsPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('Guraja Village (Main)');
  const [interest, setInterest] = useState('Cultural & Festival Events');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    setSubmitted(true);
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 text-amber-300 text-xs font-mono font-bold rounded-full border border-amber-500/30 uppercase">
          <Users className="w-3.5 h-3.5" />
          <span>Youth Volunteer Enrollment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
          Join Sri Krishna Yadav Youth Guraja
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Be a part of a dynamic youth brigade serving Guraja village. Fill out this brief interest form and our committee leads will welcome you.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 bg-[#0B1B36] border border-emerald-500/40 rounded-3xl text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white font-display">Welcome to Sri Krishna Yadav Youth!</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Thank you for stepping forward to serve Guraja. A youth coordinator will contact you via WhatsApp to introduce you to the team.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow mt-2"
          >
            Submit Another Response
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 bg-[#0B1B36] border border-amber-500/30 rounded-3xl shadow-2xl space-y-5 text-xs">
          <input
            type="text"
            name="security_trap"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Your Full Name *</label>
              <input
                type="text"
                placeholder="e.g. K. Rajesh Yadav"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Mobile / WhatsApp *</label>
              <input
                type="tel"
                placeholder="98480 12345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Residential Area / Hamlet</label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Guraja Main / Ramalayam St / Outstation"
                className="w-full bg-[#061224] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Primary Area of Interest</label>
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
              >
                <option value="Cultural & Festival Events">Cultural & Janmashtami Events</option>
                <option value="Education Tutoring & Study Hall">Education Tutoring & Study Hall</option>
                <option value="Blood Donation & Healthcare Seva">Blood Donation & Healthcare Seva</option>
                <option value="Village RO Water Plant Maintenance">Village RO Water Plant Maintenance</option>
                <option value="Sports & Youth Tournaments">Sports & Youth Tournaments</option>
                <option value="Digital Media, Accounts & Tech">Digital Media, Accounts & Tech</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Brief Note / Skills (Optional)</label>
            <textarea
              rows={3}
              placeholder="Tell us about your background, occupation, or how you wish to contribute..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#061224] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>Submit Membership Interest</span>
          </button>
        </form>
      )}
    </div>
  );
};
