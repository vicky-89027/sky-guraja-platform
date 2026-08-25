import React from 'react';
import { Heart, ArrowLeft, CheckCircle2, Share2, Calendar, MapPin } from 'lucide-react';

interface CampaignDetailsPageProps {
  campaignId?: string;
  onOpenDonate: (campaignName?: string) => void;
  onBack: () => void;
}

export const CampaignDetailsPage: React.FC<CampaignDetailsPageProps> = ({
  onOpenDonate,
  onBack
}) => {
  const campaign = {
    title: 'Sri Krishna Janmashtami 2026 Grand Celebration',
    category: 'FESTIVAL & CULTURAL',
    image: '/images/gallery/radha_krishna_janmashtami_banner.jpg',
    collected: 195000,
    target: 250000,
    percentage: 78,
    donorsCount: 412,
    daysLeft: 18,
    description: `Sri Krishna Yadav Youth Guraja organizes the annual Sri Krishna Janmashtami & Utlotsavam (Dahi Handi) Mahotsavam with traditional religious reverence, cultural drama, and mass community Annadanam serving over 2,500 devotees from Guraja and neighboring villages.

Every rupee contributed towards the festival is accounted for in our public books, funding the puja rituals, floral alankaram, sound and stage setups, prasad ingredients, and student merit awards.`,
    recentDonors: [
      { name: 'M. Venkateswara Rao', amount: '₹ 25,000', date: '2 hours ago', time: '10:45 AM' },
      { name: 'Guraja NRI Association', amount: '₹ 50,000', date: 'Yesterday', time: '04:20 PM' },
      { name: 'K. Ramana Yadav', amount: '₹ 10,000', date: '2 days ago', time: '02:15 PM' },
      { name: 'Youth Brigade Guraja', amount: '₹ 15,000', date: '3 days ago', time: '11:30 AM' },
      { name: 'Devotee Community', amount: '₹ 5,000', date: '4 days ago', time: '09:10 AM' }
    ],
    updates: [
      { date: '10 Aug 2026', title: 'Golden Prabhavali & Stage Sound Setup Confirmed', desc: 'The committee has finalized the stage decorators, traditional nadaswaram artists, and illumination systems.' },
      { date: '05 Aug 2026', title: 'Annadanam Provisions Procured', desc: 'Rice, ghee, jaggery, and grocery provisions for 2500+ meals have been secured with local farmers.' }
    ]
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-900 min-h-screen">
      {/* Dark Header Banner */}
      <div className="bg-gradient-to-b from-[#050E1C] via-[#08152B] to-[#040C18] text-white py-10 px-4 border-b border-amber-500/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Campaigns</span>
          </button>
          <span className="text-[10px] font-mono px-3 py-1 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-full uppercase">
            CAMPAIGN ID: SKY-CMP-2026-01
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Main Story & Images */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-950 h-80 sm:h-96 relative">
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#08152B]/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs font-bold font-display uppercase tracking-wider border border-amber-500/30">
                {campaign.category}
              </div>
            </div>

            {/* Campaign Title & Meta */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 leading-tight">
                {campaign.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#D4A244]" />
                  <span>Sri Krishna Mandiram, Guraja</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#D4A244]" />
                  <span>Organized by SKY Youth Committee</span>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {campaign.description}
              </div>
            </div>

            {/* Campaign Updates Section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 uppercase font-display">
                Campaign Progress & Updates
              </h3>
              <div className="space-y-3">
                {campaign.updates.map((u, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{u.title}</span>
                      <span className="text-[10px] font-mono text-slate-400">{u.date}</span>
                    </div>
                    <p className="text-slate-500 leading-relaxed">{u.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Donation Card & Donors Wall */}
          <div className="space-y-6">
            {/* Fundraising Progress Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg space-y-5 sticky top-24">
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-black text-slate-950 font-mono">
                    ₹ {campaign.collected.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500">
                    of ₹ {campaign.target.toLocaleString('en-IN')} goal
                  </span>
                </div>

                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D4A244] rounded-full transition-all duration-700"
                    style={{ width: `${campaign.percentage}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs font-semibold text-slate-600 pt-1">
                  <span>{campaign.percentage}% Funded</span>
                  <span>{campaign.donorsCount} Donors</span>
                  <span>{campaign.daysLeft} Days Left</span>
                </div>
              </div>

              <button
                onClick={() => onOpenDonate(campaign.title)}
                className="w-full py-3.5 bg-[#D4A244] hover:bg-[#C49132] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all text-center flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-slate-950" />
                <span>SUPPORT THIS CAMPAIGN</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100% Tax Exempt & Digitally Audited Ledger</span>
              </div>

              {/* Recent Donors Wall */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="font-bold text-xs text-slate-900 uppercase font-display tracking-wider">
                  Recent Verified Contributions
                </h4>
                <div className="space-y-2.5">
                  {campaign.recentDonors.map((d, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{d.name}</div>
                        <div className="text-[10px] text-slate-400">{d.date} • {d.time}</div>
                      </div>
                      <div className="font-bold text-emerald-600 font-mono">{d.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailsPage;
