import React from 'react';

interface SkyLogoProps {
  variant?: 'icon' | 'full' | 'horizontal' | 'compact' | 'receipt';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const SkyLogo: React.FC<SkyLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = ''
}) => {
  const sizeMap = {
    sm: { img: 'w-10 h-10', text: 'text-xs', sub: 'text-[9px]' },
    md: { img: 'w-12 h-12 sm:w-14 sm:h-14', text: 'text-sm sm:text-base', sub: 'text-[10px]' },
    lg: { img: 'w-24 h-24', text: 'text-xl', sub: 'text-xs' },
    xl: { img: 'w-44 h-44 sm:w-56 sm:h-56', text: 'text-2xl sm:text-4xl', sub: 'text-xs sm:text-sm' }
  };

  const currentSize = sizeMap[size];

  // Official transparent master monogram
  const MonogramImg = (
    <img
      src="/images/sky_official_monogram.png"
      alt="Sri Krishna Yadav Youth Guraja Official Monogram"
      className={`${currentSize.img} object-contain drop-shadow-[0_0_25px_rgba(245,158,11,0.55)] flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}
    />
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {MonogramImg}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center space-y-4 ${className}`}>
        <div className="relative group">
          <div className="absolute -inset-6 bg-amber-500/25 rounded-full blur-3xl group-hover:bg-amber-500/40 transition-all pointer-events-none" />
          <div className="relative">{MonogramImg}</div>
        </div>

        <div>
          {/* Main Title with Horizontal Royal Lines */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-[2px] w-8 sm:w-16 bg-gradient-to-r from-transparent via-amber-400 to-amber-500 rounded-full" />
            <h1
              className={`${currentSize.text} font-black tracking-[0.18em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#FFFBEB] via-[#FBBF24] to-[#D97706] font-display`}
            >
              Sri Krishna Yadav
            </h1>
            <div className="h-[2px] w-8 sm:w-16 bg-gradient-to-l from-transparent via-amber-400 to-amber-500 rounded-full" />
          </div>

          {/* Subtitle with Lotus Motif */}
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-[10px] text-amber-400">❖</span>
            <span
              className={`${currentSize.sub} font-extrabold tracking-[0.35em] text-amber-300 uppercase font-display`}
            >
              YOUTH GURAJA
            </span>
            <span className="text-[10px] text-amber-400">❖</span>
          </div>

          {/* 5 Core Pillars */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-3 text-[9px] sm:text-[11px] text-amber-200/80 font-mono tracking-wider uppercase font-semibold">
            <span>Unity</span>
            <span className="text-amber-500">•</span>
            <span>Culture</span>
            <span className="text-amber-500">•</span>
            <span>Seva</span>
            <span className="text-amber-500">•</span>
            <span>Youth Power</span>
            <span className="text-amber-500">•</span>
            <span>Progress</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'receipt') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img
          src="/images/sky_official_monogram.png"
          alt="SKY Logo"
          className="w-16 h-16 object-contain flex-shrink-0 drop-shadow-sm"
        />
        <div className="text-left">
          <div className="font-serif font-black text-slate-900 tracking-wider text-base uppercase leading-tight">
            SRI KRISHNA YADAV
          </div>
          <div className="text-xs font-bold text-amber-700 tracking-[0.25em] uppercase font-sans">
            YOUTH GURAJA
          </div>
          <div className="text-[9px] text-slate-500 font-mono tracking-wider pt-0.5">
            Unity • Youth • Service • Community • Progress
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {MonogramImg}
        <div className="text-left">
          <div className="font-serif font-black text-sm uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFFBEB] via-[#FBBF24] to-[#D97706]">
            SRI KRISHNA YADAV
          </div>
          <div className="text-[9px] font-extrabold tracking-[0.25em] text-amber-300 uppercase font-sans">
            YOUTH GURAJA
          </div>
        </div>
      </div>
    );
  }

  // Default Horizontal Variant
  return (
    <div className={`flex items-center gap-3 group ${className}`}>
      {MonogramImg}
      <div className="text-left">
        <div className="flex items-center gap-1.5">
          <h2
            className={`${currentSize.text} font-black tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400 font-serif leading-none`}
          >
            Sri Krishna Yadav
          </h2>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <span
            className={`${currentSize.sub} font-black tracking-[0.25em] text-amber-300 uppercase font-sans`}
          >
            YOUTH GURAJA
          </span>
        </div>
      </div>
    </div>
  );
};

export default SkyLogo;
