import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ShieldCheck, Heart, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#090909] border-t border-[#1f1f23] text-[#A1A1AA] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF5722] to-[#E53935] flex items-center justify-center shadow-lg shadow-[#FF5722]/30">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-xl tracking-wider text-white">GSPL 2026</span>
            </div>
            <p className="text-xs uppercase tracking-widest text-[#FF7938] font-bold">
              ONE SOCIETY. ONE LEAGUE. ONE CHAMPION.
            </p>
            <p className="text-sm leading-relaxed">
              Official box cricket championship portal for Gokul Shrishti society. Promoting athletic excellence, community bonding, and competitive spirit.
            </p>
          </div>

          {/* Col 2: Tournament Navigation */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4 border-l-2 border-[#FF5722] pl-2">
              Tournament Hub
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/fixtures" className="hover:text-white transition">Fixtures & Live Score</Link></li>
              <li><Link to="/teams" className="hover:text-white transition">Teams & Squads</Link></li>
              <li><Link to="/points-table" className="hover:text-white transition">Points Table</Link></li>
              <li><Link to="/statistics" className="hover:text-white transition">Orange & Purple Cap</Link></li>
              <li><Link to="/awards" className="hover:text-white transition">Tournament Honors</Link></li>
            </ul>
          </div>

          {/* Col 3: Players & Rules */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4 border-l-2 border-[#FF5722] pl-2">
              Registration & Rules
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="hover:text-white transition">Player Online Registration</Link></li>
              <li><Link to="/registration-status" className="hover:text-white transition">Check Registration Status</Link></li>
              <li><Link to="/about" className="hover:text-white transition">Box Cricket Rules & Bylaws</Link></li>
              <li><Link to="/news" className="hover:text-white transition">Committee Announcements</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition">Event Photo Gallery</Link></li>
            </ul>
          </div>

          {/* Col 4: Location & Admin */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4 border-l-2 border-[#FF5722] pl-2">
              Tournament Arena
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF7938] shrink-0 mt-1" />
                <span>Gokul Shrishti Society Central Quadrangle Arena, Wing B-C Grounds</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FF7938] shrink-0" />
                <span>organizers@gspl.cricket</span>
              </div>
              <div className="pt-2">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#191919] border border-[#27272a] hover:border-[#FF5722]/50 text-xs font-medium text-white transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF7938]" />
                  <span>Committee Access</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1a1a1e] flex flex-col sm:flex-row items-center justify-between text-xs text-[#71717A] gap-4">
          <p>© 2026 Gokul Shrishti Premier League. Built with high-performance sports stack.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for Box Cricket Champions</span>
            <Heart className="w-3.5 h-3.5 text-[#FF5722] fill-[#FF5722] mx-1 inline" />
            <span>by GSPL Tech</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
