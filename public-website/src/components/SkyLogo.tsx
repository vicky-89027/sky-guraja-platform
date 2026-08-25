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
    sm: { icon: 32, text: 'text-xs', sub: 'text-[9px]' },
    md: { icon: 44, text: 'text-base', sub: 'text-[11px]' },
    lg: { icon: 72, text: 'text-xl', sub: 'text-xs' },
    xl: { icon: 110, text: 'text-2xl sm:text-3xl', sub: 'text-sm' }
  };

  const currentSize = sizeMap[size];

  // The official vector emblem:
  // Circular Gold Ring + Monogram S, K, Y + Peacock Feather (Mayur Pankh) + Golden Flute (Bansuri) with pearls
  const Emblem = (
    <svg
      width={currentSize.icon}
      height={currentSize.icon}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0 drop-shadow-[0_0_15px_rgba(245,158,11,0.45)]"
    >
      <defs>
        <linearGradient id="pubGold1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="30%" stopColor="#F59E0B" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>

        <linearGradient id="pubGold2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="40%" stopColor="#FBBF24" />
          <stop offset="80%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>

        <linearGradient id="pubFeatherOuter" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="50%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        <radialGradient id="pubFeatherEye" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0369A1" />
          <stop offset="40%" stopColor="#0284C7" />
          <stop offset="70%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#047857" />
        </radialGradient>

        <filter id="pubGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Golden Circular Frame with Crescent Gap */}
      <circle
        cx="92"
        cy="96"
        r="78"
        stroke="url(#pubGold1)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="440 60"
        transform="rotate(-25 92 96)"
      />

      {/* Inner Decorative Accent Ring */}
      <circle
        cx="92"
        cy="96"
        r="70"
        stroke="url(#pubGold2)"
        strokeWidth="1.5"
        strokeOpacity="0.6"
        fill="none"
        strokeDasharray="4 8"
      />

      {/* --- Monogram Letters: S, K, Y --- */}
      {/* Letter 'S' */}
      <path
        d="M 68 62 C 50 62 40 74 40 88 C 40 102 52 110 68 116 C 84 122 92 130 92 144 C 92 162 76 172 58 172 C 44 172 34 164 30 156"
        stroke="url(#pubGold1)"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />

      {/* Letter 'K' */}
      <path
        d="M 88 50 L 88 152"
        stroke="url(#pubGold1)"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path
        d="M 142 56 L 88 106 L 146 160"
        stroke="url(#pubGold2)"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Letter 'Y' */}
      <path
        d="M 124 100 L 152 100 Q 158 140 134 168 Q 112 190 84 186"
        stroke="url(#pubGold1)"
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />

      {/* --- Golden Flute (Bansuri) Across Monogram --- */}
      <g transform="rotate(-18 120 135)">
        <rect
          x="35"
          y="132"
          width="118"
          height="12"
          rx="6"
          fill="url(#pubGold2)"
          stroke="#522703"
          strokeWidth="1.5"
          filter="url(#pubGlow)"
        />
        <circle cx="58" cy="138" r="2.2" fill="#3D1A04" />
        <circle cx="70" cy="138" r="2.2" fill="#3D1A04" />
        <circle cx="82" cy="138" r="2.2" fill="#3D1A04" />
        <circle cx="94" cy="138" r="2.2" fill="#3D1A04" />
        <circle cx="106" cy="138" r="2.2" fill="#3D1A04" />
        <circle cx="118" cy="138" r="2.2" fill="#3D1A04" />

        <rect x="42" y="132" width="3" height="12" fill="#FFF2B2" />
        <rect x="138" y="132" width="3" height="12" fill="#FFF2B2" />

        {/* Hanging Tassels & Pearls */}
        <path
          d="M 140 144 Q 142 162 140 172 M 140 152 Q 146 164 148 174 M 140 156 Q 134 166 132 174"
          stroke="url(#pubGold1)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="140" cy="148" r="3" fill="#FFFBEB" />
        <circle cx="140" cy="172" r="2" fill="#F59E0B" />
        <circle cx="148" cy="174" r="2" fill="#F59E0B" />
        <circle cx="132" cy="174" r="2" fill="#F59E0B" />
      </g>

      {/* --- Krishna's Sacred Peacock Feather (Mayur Pankh) --- */}
      <g transform="translate(116, 12) rotate(15)">
        <path
          d="M 28 58 Q 42 30 38 12 Q 32 -2 18 4 Q 4 12 6 36 Q 8 52 28 58 Z"
          fill="url(#pubFeatherOuter)"
          stroke="url(#pubGold1)"
          strokeWidth="1.5"
        />
        <ellipse cx="22" cy="24" rx="12" ry="16" fill="#0284C7" />
        <ellipse cx="22" cy="24" rx="7" ry="9" fill="url(#pubFeatherEye)" />
        <circle cx="22" cy="24" r="4.5" fill="#0C4A6E" />
        <circle cx="20" cy="22" r="1.5" fill="#BAE6FD" opacity="0.8" />
        <path
          d="M 24 58 Q 23 30 22 2"
          stroke="url(#pubGold1)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{Emblem}</div>;
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center space-y-4 ${className}`}>
        <div className="relative group">
          <div className="absolute -inset-4 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/30 transition-all" />
          <div className="relative">{Emblem}</div>
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
        {Emblem}
        <div className="text-left">
          <div className="font-black text-slate-900 tracking-wider text-sm uppercase font-display leading-tight">
            SRI KRISHNA YADAV
          </div>
          <div className="text-[10px] font-bold text-amber-800 tracking-widest uppercase">
            YOUTH GURAJA
          </div>
          <div className="text-[8px] text-slate-500 font-mono">
            Unity • Culture • Community Service
          </div>
        </div>
      </div>
    );
  }

  // Horizontal Variant
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {Emblem}
      <div className="text-left">
        <div className="flex items-center gap-1.5">
          <h2
            className={`${currentSize.text} font-black tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400 font-display leading-none`}
          >
            Sri Krishna Yadav
          </h2>
          <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded">
            SKY
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className={`${currentSize.sub} font-extrabold tracking-[0.25em] text-amber-400 uppercase font-display`}
          >
            YOUTH GURAJA
          </span>
        </div>
      </div>
    </div>
  );
};

export default SkyLogo;
