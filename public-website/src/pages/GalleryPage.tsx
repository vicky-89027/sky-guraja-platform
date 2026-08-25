import React, { useState, useEffect } from 'react';
import {
  Camera,
  Eye,
  X,
  Download,
  Share2,
  Sparkles,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2
} from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'ALANKARAM' | 'VIGRAHAMS' | 'RALLIES' | 'FESTIVALS' | 'COMMUNITY' | 'BANNERS' | 'BRAND';
  description: string;
  imageSrc: string;
  date: string;
  location: string;
}

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  // Slideshow State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const galleryItems: GalleryItem[] = [
    {
      id: 'g-1',
      title: 'Sri Krishna Swamy in Golden Arch (Prabhavali) Alankaram',
      category: 'ALANKARAM',
      description: 'Divine darshanam of Sri Krishna adorned with fragrant jasmine malas, golden mukut, pearl harams, diamond chest ornament, and sacred peacock feather insignia in Guraja.',
      imageSrc: '/images/gallery/krishna_swamy_golden_arch.jpg',
      date: 'Janmashtami Special Darshanam',
      location: 'Sri Krishna Mandiram, Guraja'
    },
    {
      id: 'g-2',
      title: 'Guraja Village Women Joyous Vasantotsavam & Holi Celebration',
      category: 'FESTIVALS',
      description: 'Village women and community elders celebrating with traditional gulal colors and devotional songs in Guraja streets during spring festival celebrations.',
      imageSrc: '/images/gallery/guraja_women_holi_vasantotsavam.jpg',
      date: 'Vasantotsavam Festival',
      location: 'Guraja Village Streets'
    },
    {
      id: 'g-3',
      title: 'Youth Chariot Procession on Village Tractor with Sri Krishna Idol',
      category: 'RALLIES',
      description: 'Active youth volunteers driving the decorated flower chariot (ratham) carrying the sacred Sri Krishna idol through Guraja village hamlets.',
      imageSrc: '/images/gallery/youth_tractor_ratham_procession.png',
      date: 'Grama Shobha Yatra',
      location: 'Village Temple Road, Guraja'
    },
    {
      id: 'g-4',
      title: 'Sri Krishna Yadav Youth Guraja Committee Volunteers & Leads',
      category: 'COMMUNITY',
      description: 'Core youth committee members wearing traditional green turbans and kanduvas gathered in front of the festive deity chariot in Guraja.',
      imageSrc: '/images/gallery/guraja_youth_volunteers_group.png',
      date: 'Youth Seva Brigade',
      location: 'Sri Krishna Mandiram Premises, Guraja'
    },
    {
      id: 'g-5',
      title: 'Sri Radha Krishna Deity Murti with Jasmine & Rose Garlands',
      category: 'VIGRAHAMS',
      description: 'Beautiful Sri Radha Krishna vigrahams adorned with jasmine malas, yellow chrysanthemums, coconuts, and sacred offerings on the festival altar.',
      imageSrc: '/images/gallery/radha_krishna_murti_alankaram.jpg',
      date: 'Festive Alankaram',
      location: 'Guraja Village Temple Altar'
    },
    {
      id: 'g-6',
      title: 'Village Night Utsavam & Sound System Procession Rally',
      category: 'RALLIES',
      description: 'Youth rally with high-power lights and sound system carrying Sri Krishna banners through Guraja streets with community youth participation.',
      imageSrc: '/images/gallery/guraja_night_utsav_sound_rally.png',
      date: 'Night Utsavam & Rally',
      location: 'Main Street, Guraja'
    },
    {
      id: 'g-7',
      title: 'Guraja Youth Procession Rally with Custom Pink Sri Krishna Tees',
      category: 'RALLIES',
      description: 'Energetic youth rally through Guraja village with volunteers wearing matching custom pink Sri Krishna T-shirts, holding deity banners.',
      imageSrc: '/images/gallery/guraja_youth_procession_rally.png',
      date: 'Youth Cultural Utsav Rally',
      location: 'Guraja Main Road'
    },
    {
      id: 'g-8',
      title: 'Sri Krishna Janmashtami & Balakrishna Makhan Chori Banner',
      category: 'BANNERS',
      description: 'Grand Janmashtami festival greetings poster by Sri Krishna Yadav Youth Guraja featuring Sri Radha Krishna, Balakrishna makhan handi, and youth icons.',
      imageSrc: '/images/gallery/radha_krishna_janmashtami_banner.jpg',
      date: 'Janmashtami Celebrations',
      location: 'Sri Krishna Yadav Youth - Guraja'
    },
    {
      id: 'g-9',
      title: 'Sri Devi Sharannavaratri Mahotsavam & Vijayadashami Banner',
      category: 'FESTIVALS',
      description: 'Official Vijayadashami greetings from Sri Krishna Yadav Youth Guraja depicting Goddess Sri Kanaka Durga Devi seated gracefully upon her royal tiger mount.',
      imageSrc: '/images/gallery/devi_navaratri_guraja_banner.jpg',
      date: 'Dasara Navaratri Utsavam',
      location: 'Guraja, Krishna District, AP'
    },
    {
      id: 'g-10',
      title: 'Village Chariot (Ratham) Utsavam with Banana Trees & Horn',
      category: 'FESTIVALS',
      description: 'Village procession vehicle decorated with green banana tree stalks, speaker horn, and sacred deity photo accompanied by Guraja elders and youth devotees.',
      imageSrc: '/images/gallery/village_chariot_utsavam_procession.jpg',
      date: 'Grama Devata & Krishna Utsavam',
      location: 'Village Temple Environs, Guraja'
    },
    {
      id: 'g-11',
      title: 'Sri Krishna Yadav Youth - Guraja Special Celebration Banner',
      category: 'BANNERS',
      description: 'Youth cultural and birthday celebration poster by Sri Krishna Yadav Youth - Guraja featuring Actor Suriya, Chhatrapati Shivaji Maharaj, and Balakrishna.',
      imageSrc: '/images/gallery/suriya_birthday_guraja_banner.jpg',
      date: 'Youth Cultural Celebration',
      location: 'Sri Krishna Yadav Youth - Guraja'
    },
    {
      id: 'g-12',
      title: 'Marble Sri Krishna Idol in Radiant Flower Mala Alankaram',
      category: 'VIGRAHAMS',
      description: 'Auspicious white marble Sri Krishna idol adorned with Dutch roses, yellow chrysanthemums, and holy peacock feather crown, holding a golden-belled flute.',
      imageSrc: '/images/gallery/marble_krishna_alankaram.jpg',
      date: 'Guraja Youth Seva Utsavam',
      location: 'Yadav Youth Bhavan Altar, Guraja'
    },
    {
      id: 'g-13',
      title: 'Sanctum Altar with Golden Kavachams & Holy Offerings',
      category: 'ALANKARAM',
      description: 'Sri Radha Krishna sanctum decorated with traditional mango leaves, banana fruits, fresh floral garlands, and gold-clad deity idols.',
      imageSrc: '/images/gallery/temple_sanctum_darshanam.png',
      date: 'Annual Temple Festival',
      location: 'Village Temple Sanctum, Guraja'
    },
    {
      id: 'g-14',
      title: 'Sacred Puja Altar with Traditional Deepams & Pushpalankaram',
      category: 'ALANKARAM',
      description: 'Devotional puja setup featuring glowing brass deepams (oil lamps), sacred red hibiscus & marigold flower garlands, and fresh coconut offerings.',
      imageSrc: '/images/gallery/puja_altar_deepam.jpg',
      date: 'Special Deepotsavam & Sankalpa Puja',
      location: 'Guraja Community Center'
    },
    {
      id: 'g-15',
      title: 'Sri Krishna with Gomata (Holy Cow) Vigraham',
      category: 'VIGRAHAMS',
      description: 'Intricately detailed sculpted idol depicting Sri Krishna playing his sacred bansuri flute standing gracefully alongside Mother Gomata.',
      imageSrc: '/images/gallery/krishna_flute_gomata.jpg',
      date: 'Gopashtami Celebration',
      location: 'Sri Krishna Youth Secretariat, Guraja'
    },
    {
      id: 'g-16',
      title: 'Official SKY Brand Identity & Youth Monogram Concept',
      category: 'BRAND',
      description: 'The official visual identity of Sri Krishna Yadav Youth Guraja uniting the royal gold S-K-Y monogram, Mayur Pankh, and Bansuri under the motto: Unity, Culture, Seva, Youth Power, Progress.',
      imageSrc: '/images/gallery/sky_official_brand_concept.jpg',
      date: 'Official Organization Branding',
      location: 'Guraja, Krishna District, AP'
    }
  ];

  // Auto-play slideshow every 4.5 seconds
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryItems.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying, galleryItems.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryItems.length);
  };

  const categories = [
    { id: 'ALL', label: `All Photos (${galleryItems.length})` },
    { id: 'ALANKARAM', label: 'Temple Alankaram' },
    { id: 'RALLIES', label: 'Youth Rallies' },
    { id: 'FESTIVALS', label: 'Festivals & Utsavams' },
    { id: 'COMMUNITY', label: 'Youth Volunteers' },
    { id: 'BANNERS', label: 'Celebration Banners' },
    { id: 'VIGRAHAMS', label: 'Sacred Vigrahams' },
    { id: 'BRAND', label: 'Brand Concept' }
  ];

  const filtered = selectedCategory === 'ALL'
    ? galleryItems
    : galleryItems.filter((g) => g.category === selectedCategory);

  const activeSlideData = galleryItems[currentSlide];

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-500/15 text-amber-300 text-xs font-mono font-bold rounded-full border border-amber-500/40 uppercase">
          <Camera className="w-3.5 h-3.5" />
          <span>Official Visual Archives & Community Moments</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
          Photo Gallery & Slideshow
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Explore our sacred temple darshanams, Janmashtami utsavams, youth tractor rallies, Vasantotsavam celebrations, and official posters from Guraja.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 1. INTERACTIVE FULL-WIDTH SLIDESHOW CAROUSEL                              */}
      {/* ========================================================================= */}
      <section className="relative rounded-3xl overflow-hidden bg-[#0B1B36] border-2 border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.15)] group">
        {/* Slideshow Display Area */}
        <div className="relative h-[380px] sm:h-[480px] md:h-[540px] w-full overflow-hidden bg-black flex items-center justify-center">
          <img
            key={activeSlideData.id}
            src={activeSlideData.imageSrc}
            alt={activeSlideData.title}
            className="w-full h-full object-contain object-center transition-all duration-700 ease-in-out"
          />

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#061224] via-transparent to-black/40 pointer-events-none" />

          {/* Top Left Slide Number & Category */}
          <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
            <span className="text-[11px] font-mono font-bold text-amber-300 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/40 shadow">
              Slide {currentSlide + 1} of {galleryItems.length}
            </span>
            <span className="text-[11px] font-mono font-extrabold text-emerald-300 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/40 shadow uppercase">
              {activeSlideData.category}
            </span>
          </div>

          {/* Top Right Maximize / Lightbox Action */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-slate-300 hover:text-white hover:bg-black/80 transition-all shadow"
              title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={() => setActiveItem(activeSlideData)}
              className="p-2.5 rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-lg font-bold"
              title="Open Fullscreen Lightbox"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Left / Right Nav Arrows */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-amber-500 text-white hover:text-slate-950 border border-white/20 hover:border-amber-400 transition-all shadow-2xl z-10 transform active:scale-95"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-amber-500 text-white hover:text-slate-950 border border-white/20 hover:border-amber-400 transition-all shadow-2xl z-10 transform active:scale-95"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Bottom Slide Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 bg-gradient-to-t from-[#061224] via-[#061224]/90 to-transparent space-y-2 z-10">
            <h2 className="text-base sm:text-2xl font-black text-white font-display tracking-tight leading-snug">
              {activeSlideData.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl line-clamp-2 leading-relaxed">
              {activeSlideData.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-1 border-t border-white/10 font-mono">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activeSlideData.location}</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{activeSlideData.date}</span>
                </span>
              </div>

              <button
                onClick={() => setActiveItem(activeSlideData)}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Full HD</span>
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnail Navigation Strip */}
        <div className="p-3 bg-[#061224] border-t border-white/10 flex items-center gap-2.5 overflow-x-auto">
          {galleryItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentSlide(idx);
                setIsPlaying(false);
              }}
              className={`relative flex-shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                currentSlide === idx
                  ? 'border-amber-400 scale-105 shadow-md ring-2 ring-amber-500/40'
                  : 'border-white/10 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={item.imageSrc} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CATEGORY FILTERABLE PHOTO GRID                                         */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wide">
              Browse All Photographs & Archives
            </h2>
            <p className="text-xs text-slate-400">Click any photo to open full-resolution view and download</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedCategory === c.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-[#0B1B36] text-slate-300 border-white/10 hover:border-amber-500/30'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group cursor-pointer bg-[#0B1B36] border border-white/10 hover:border-amber-500/50 rounded-3xl overflow-hidden shadow-xl transition-all hover:-translate-y-1.5 flex flex-col justify-between"
            >
              {/* Image Box */}
              <div className="relative h-72 w-full overflow-hidden bg-[#061224]">
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B36] via-transparent to-transparent opacity-85" />

                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/40 shadow">
                    {item.category}
                  </span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                  <div className="p-3 rounded-full bg-amber-500 text-slate-950 shadow-2xl transform scale-90 group-hover:scale-100 transition-transform">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-2">
                <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>Guraja, AP</span>
                  </span>
                  <span className="text-emerald-400 font-semibold">{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LIGHTBOX FULL-SCREEN MODAL                                             */}
      {/* ========================================================================= */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="bg-[#0B1B36] border border-amber-500/40 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="p-4 bg-[#061224] border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                  Sri Krishna Yadav Youth Guraja • Official Photo Archive
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white font-display">
                  {activeItem.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Box */}
            <div className="overflow-y-auto p-4 sm:p-6 bg-black/60 flex items-center justify-center">
              <img
                src={activeItem.imageSrc}
                alt={activeItem.title}
                className="max-h-[58vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            </div>

            {/* Description & Action Bar */}
            <div className="p-5 bg-[#0B1B36] border-t border-white/10 space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeItem.description}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 border-t border-white/5 pt-3">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{activeItem.location}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{activeItem.date}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={activeItem.imageSrc}
                    download
                    className="px-4 py-2 bg-[#16335F] hover:bg-[#1E437C] text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Photo</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
