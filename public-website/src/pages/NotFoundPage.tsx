import React from 'react';
import { SkyLogo } from '../components/SkyLogo';
import { Home } from 'lucide-react';

interface NotFoundPageProps {
  onGoHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onGoHome }) => {
  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-[#050E1C] via-[#08152B] to-[#040C18] text-white px-4 text-center py-20 relative overflow-hidden">
      {/* Background Krishna Aura Glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 40%, rgba(245, 158, 11, 0.3) 0%, transparent 60%)`
        }}
      />

      <div className="max-w-md mx-auto space-y-6 relative z-10">
        <div className="flex justify-center">
          <SkyLogo variant="icon" size="lg" />
        </div>

        <div className="text-7xl sm:text-9xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#F5BD55] via-[#D4A244] to-[#8C651A] drop-shadow-[0_0_35px_rgba(212,162,68,0.3)]">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white">
            Oops! Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            The page you are looking for doesn't exist or has been moved to a new destination.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={onGoHome}
            className="px-8 py-3.5 bg-gradient-to-r from-[#D4A244] via-[#F5BD55] to-[#C49132] hover:from-[#E5B869] hover:to-[#D4A244] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(212,162,68,0.4)] transition-all flex items-center justify-center gap-2 mx-auto"
          >
            <Home className="w-4 h-4" />
            <span>GO BACK HOME</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
