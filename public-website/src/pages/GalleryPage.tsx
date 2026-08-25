import React, { useState } from 'react';
import { Camera, Eye, X, MapPin, Calendar } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activePhoto, setActivePhoto] = useState<any | null>(null);

  const photos = [
    {
      id: 'p1',
      title: 'Sri Krishna Swamy in Golden Arch (Prabhavali) Alankaram',
      category: 'EVENTS',
      image: '/images/gallery/krishna_swamy_golden_arch.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80',
      location: 'Sri Krishna Mandiram, Guraja'
    },
    {
      id: 'p2',
      title: 'Guraja Village Women Joyous Vasantotsavam & Holi Celebration',
      category: 'COMMUNITY',
      image: '/images/gallery/guraja_women_holi_vasantotsavam.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=600&q=80',
      location: 'Guraja Village Streets'
    },
    {
      id: 'p3',
      title: 'Youth Chariot Procession on Village Tractor with Sri Krishna Idol',
      category: 'EVENTS',
      image: '/images/gallery/youth_tractor_ratham_procession.png',
      fallbackImage: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=600&q=80',
      location: 'Main Road, Guraja'
    },
    {
      id: 'p4',
      title: 'Annadanam Community Feast & Prasad Distribution Seva',
      category: 'ACTIVITIES',
      image: '/images/gallery/annadanam_prasad_distribution.png',
      fallbackImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
      location: 'Yadav Youth Bhavan, Guraja'
    },
    {
      id: 'p5',
      title: 'Youth Study Hall & Digital Library Inauguration',
      category: 'CAMPAIGNS',
      image: '/images/gallery/youth_study_hall_library.png',
      fallbackImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80',
      location: 'Yadav Youth Study Hall, Guraja'
    },
    {
      id: 'p6',
      title: 'Village RO Drinking Water Plant & Green Surroundings',
      category: 'CAMPAIGNS',
      image: '/images/gallery/guraja_ro_plant_field.png',
      fallbackImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
      location: 'Drinking Water RO Center, Guraja'
    },
    {
      id: 'p7',
      title: 'Medical Camp Doctors & Free Health Diagnostics',
      category: 'ACTIVITIES',
      image: '/images/gallery/medical_camp_doctors.png',
      fallbackImage: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80',
      location: 'Health Sub-Center, Guraja'
    },
    {
      id: 'p8',
      title: 'Youth Sports & Volleyball League Tournament',
      category: 'ACTIVITIES',
      image: '/images/gallery/youth_sports_cricket_tournament.png',
      fallbackImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
      location: 'Guraja High School Grounds'
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
            Photographs of our community festivals, development projects, and youth initiatives in Guraja.
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
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src = p.fallbackImage;
                  }}
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
