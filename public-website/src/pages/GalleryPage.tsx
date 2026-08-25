import React, { useState } from 'react';
import { Eye, MapPin } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activePhoto, setActivePhoto] = useState<any | null>(null);

  const photos = [
    {
      id: 'p1',
      title: 'Sri Krishna Swamy in Golden Arch (Prabhavali) Alankaram',
      category: 'EVENTS',
      image: '/images/gallery/krishna_swamy_golden_arch.jpg',
      location: 'Sri Krishna Mandiram, Guraja'
    },
    {
      id: 'p2',
      title: 'Guraja Village Women Joyous Vasantotsavam & Holi Celebration',
      category: 'COMMUNITY',
      image: '/images/gallery/guraja_women_holi_vasantotsavam.jpg',
      location: 'Guraja Village Streets'
    },
    {
      id: 'p3',
      title: 'Youth Chariot Procession on Village Tractor with Sri Krishna Idol',
      category: 'EVENTS',
      image: '/images/gallery/youth_tractor_ratham_procession.png',
      location: 'Main Road, Guraja'
    },
    {
      id: 'p4',
      title: 'Guraja Youth Committee & Volunteers Gathering',
      category: 'COMMUNITY',
      image: '/images/gallery/guraja_youth_volunteers_group.png',
      location: 'Yadav Youth Bhavan, Guraja'
    },
    {
      id: 'p5',
      title: 'Radha Krishna Janmashtami Celebration Official Banner',
      category: 'CAMPAIGNS',
      image: '/images/gallery/radha_krishna_janmashtami_banner.jpg',
      location: 'Main Junction, Guraja'
    },
    {
      id: 'p6',
      title: 'Devi Navaratri Mahotsavam & Dussehra Youth Seva Banner',
      category: 'CAMPAIGNS',
      image: '/images/gallery/devi_navaratri_guraja_banner.jpg',
      location: 'Sri Krishna Mandir Center, Guraja'
    },
    {
      id: 'p7',
      title: 'Marble Sri Krishna Mandir Murti Alankaram with Peacock Feather',
      category: 'EVENTS',
      image: '/images/gallery/marble_krishna_alankaram.jpg',
      location: 'Garbhagudi, Sri Krishna Mandiram'
    },
    {
      id: 'p8',
      title: 'Guraja Youth Heritage Motorcycle & Flag Procession Rally',
      category: 'ACTIVITIES',
      image: '/images/gallery/guraja_youth_procession_rally.png',
      location: 'Guraja Village High Road'
    },
    {
      id: 'p9',
      title: 'Guraja Night Utsavam & High-Power Sound Lighting Rally',
      category: 'ACTIVITIES',
      image: '/images/gallery/guraja_night_utsav_sound_rally.png',
      location: 'Guraja Temple Square'
    },
    {
      id: 'p10',
      title: 'Radha Krishna Divine Murti Sanctum Darshanam with Flowers',
      category: 'EVENTS',
      image: '/images/gallery/radha_krishna_murti_alankaram.jpg',
      location: 'Sanctum Sanctorum, Guraja'
    },
    {
      id: 'p11',
      title: 'Village Chariot (Ratham) Utsavam Devotional Procession',
      category: 'EVENTS',
      image: '/images/gallery/village_chariot_utsavam_procession.jpg',
      location: 'Guraja Main Temple Street'
    },
    {
      id: 'p12',
      title: 'Community Social Welfare & Birthday Charity Drive',
      category: 'COMMUNITY',
      image: '/images/gallery/suriya_birthday_guraja_banner.jpg',
      location: 'Guraja Community Center'
    },
    {
      id: 'p13',
      title: 'Temple Sanctum Darshanam with Sacred Deepam Lighting',
      category: 'EVENTS',
      image: '/images/gallery/temple_sanctum_darshanam.png',
      location: 'Sri Krishna Mandiram, Guraja'
    },
    {
      id: 'p14',
      title: 'Holy Puja Altar & Harati Deepam at Village Mandir',
      category: 'EVENTS',
      image: '/images/gallery/puja_altar_deepam.jpg',
      location: 'Puja Altar, Guraja'
    },
    {
      id: 'p15',
      title: 'Sri Krishna with Divine Flute & Gomata Iconography',
      category: 'CULTURAL',
      image: '/images/gallery/krishna_flute_gomata.jpg',
      location: 'Cultural Hall, Guraja'
    },
    {
      id: 'p16',
      title: 'SKY Sri Krishna Yadav Youth Guraja Official Emblem',
      category: 'COMMUNITY',
      image: '/images/gallery/sky_official_brand_concept.jpg',
      location: 'Yadav Youth Bhavan, Guraja'
    }
  ];

  const categories = [
    { id: 'ALL', label: 'All' },
    { id: 'EVENTS', label: 'Events' },
    { id: 'CAMPAIGNS', label: 'Campaigns' },
    { id: 'COMMUNITY', label: 'Community' },
    { id: 'ACTIVITIES', label: 'Activities' }
  ];

  const filtered = selectedCategory === 'ALL'
    ? photos
    : photos.filter((p) => p.category === selectedCategory);

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-900">
      {/* Dark Header Banner */}
      <div className="bg-gradient-to-b from-[#050E1C] via-[#08152B] to-[#040C18] text-white py-14 px-4 text-center border-b border-amber-500/20">
        <div className="max-w-4xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
            MOMENTS OF SERVICE & FAITH
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
            GALLERY
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Real photographs of our community festivals, temple alankaram, and youth initiatives in Guraja.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12 space-y-8">
        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#D4A244] text-slate-950 shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <div
              key={p.id}
              onClick={() => setActivePhoto(p)}
              className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Eye className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 space-y-1">
                <h3 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2">
                  {p.title}
                </h3>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                  <MapPin className="w-3 h-3 text-[#D4A244]" />
                  <span>{p.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setActivePhoto(null)}>
          <div className="max-w-3xl w-full bg-[#08152B] border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center text-white pb-2 border-b border-white/10">
              <h4 className="font-bold text-sm text-white truncate max-w-lg">{activePhoto.title}</h4>
              <button onClick={() => setActivePhoto(null)} className="p-1 text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="h-96 w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <img src={activePhoto.image} alt={activePhoto.title} className="max-h-full max-w-full object-contain" />
            </div>
            <div className="text-xs text-amber-300 font-mono text-center">{activePhoto.location}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
