import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-spam honeypot
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Silent discard for bot spam
    setSending(true);

    setTimeout(() => {
      setSending(false);
      setSent(true);
      setName('');
      setPhone('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSent(false), 5000);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
          Contact Sri Krishna Yadav Youth Guraja
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Have questions, wish to support a campaign, or need emergency assistance? Reach out to our village youth secretariat.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information & Office Card */}
        <div className="space-y-6">
          <div className="p-8 bg-[#0B1B36] border border-amber-500/30 rounded-3xl space-y-6 shadow-xl">
            <h2 className="text-xl font-bold text-white font-display">
              Headquarters & Secretariat
            </h2>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <b className="text-white text-sm block">Yadav Youth Bhavan</b>
                  <span>Main Road, Guraja Village, Krishna District, Andhra Pradesh - 521321, India</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <b className="text-white text-sm block">Helpline & WhatsApp</b>
                  <span>+91 98480 22334 / +91 94401 55678</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <b className="text-white text-sm block">Official Correspondence</b>
                  <span>contact@skyguraja.org / support@skyguraja.org</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <b className="text-white text-sm block">Office Timings</b>
                  <span>Monday - Sunday: 08:00 AM - 08:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Channels Card */}
          <div className="p-6 bg-[#0B1B36] border border-white/10 rounded-3xl space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white font-display">Official Social Channels</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <a
                href="https://instagram.com/sky_youth_guraja"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-[#061224] rounded-xl border border-white/5 hover:border-amber-500/40 text-slate-300 hover:text-white"
              >
                <div className="font-bold">Instagram</div>
                <div className="text-[10px] text-amber-400">@sky_youth_guraja</div>
              </a>
              <a
                href="https://facebook.com/skyguraja"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-[#061224] rounded-xl border border-white/5 hover:border-amber-500/40 text-slate-300 hover:text-white"
              >
                <div className="font-bold">Facebook</div>
                <div className="text-[10px] text-emerald-400">@skyguraja</div>
              </a>
            </div>
          </div>
        </div>

        {/* Anti-Spam Contact Form */}
        <div className="p-8 bg-[#0B1B36] border border-white/10 rounded-3xl shadow-xl space-y-5">
          <h2 className="text-xl font-bold text-white font-display">Send a Message to Committee</h2>
          <p className="text-xs text-slate-300">We respond to all community inquiries within 24 hours.</p>

          {sent && (
            <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>Thank you! Your message has been received by the Guraja youth committee.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Honeypot hidden input for spam bots */}
            <input
              type="text"
              name="company_trap"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Your Full Name *</label>
              <input
                type="text"
                placeholder="e.g. S. Jagadeesh Yadav"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  placeholder="98480 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#061224] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#061224] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Subject</label>
              <input
                type="text"
                placeholder="e.g. Inquiry about Janmashtami celebration / Donation"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Your Message *</label>
              <textarea
                rows={4}
                placeholder="Write your message or inquiry here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#061224] border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? 'Sending Message...' : 'Submit Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
