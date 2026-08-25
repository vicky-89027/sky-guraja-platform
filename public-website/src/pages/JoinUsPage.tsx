import React, { useState } from 'react';
import { Users, CheckCircle2, Heart, Award, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const JoinUsPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('Cultural & Festivals');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-900">
      {/* Dark Header Banner */}
      <div className="bg-gradient-to-b from-[#050E1C] via-[#08152B] to-[#040C18] text-white py-14 px-4 text-center border-b border-amber-500/20">
        <div className="max-w-4xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
            YOUTH VOLUNTEER CORPS
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
            JOIN OUR COMMUNITY
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            "Be a part of our mission to build a better Guraja."
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-xl mx-auto px-4 py-14">
        {submitted ? (
          <div className="p-8 bg-white rounded-3xl border border-emerald-200 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black font-display text-slate-900">
              Welcome to Sri Krishna Yadav Youth!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Thank you for stepping forward to serve Guraja village. A youth coordinator will contact you via WhatsApp shortly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 bg-[#D4A244] text-slate-950 font-bold text-xs rounded-xl shadow mt-2"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-4 text-xs"
          >
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#D4A244] rounded-xl px-3.5 py-2.5 text-slate-900 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#D4A244] rounded-xl px-3.5 py-2.5 text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 98480 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#D4A244] rounded-xl px-3.5 py-2.5 text-slate-900 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Area of Interest</label>
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#D4A244] rounded-xl px-3.5 py-2.5 text-slate-900 outline-none"
              >
                <option value="Cultural & Festivals">Cultural & Janmashtami Festivals</option>
                <option value="Education Tutoring & Study Hall">Education Tutoring & Study Hall</option>
                <option value="Drinking Water & Clean Village">Drinking Water & Clean Village Seva</option>
                <option value="Healthcare & Blood Donation">Healthcare & Blood Donation Wing</option>
                <option value="Youth Sports Tournaments">Youth Sports Tournaments</option>
                <option value="Accounts, Media & Tech">Accounts, Digital Media & Tech</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">How would you like to contribute? (Optional)</label>
              <textarea
                rows={3}
                placeholder="Tell us about your background or availability..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#D4A244] rounded-xl px-3.5 py-2.5 text-slate-900 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#D4A244] hover:bg-[#C49132] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>SUBMIT APPLICATION</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default JoinUsPage;
