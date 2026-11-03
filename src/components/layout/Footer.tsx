import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] text-[var(--text-muted)] pt-14 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand & Tagline with official logo */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-[var(--border-color)] bg-black shadow-md">
                <img src="/gspl-logo.jpg" alt="GSPL 2026 Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-black text-xl tracking-wider text-[var(--text-main)]">GSPL 2026</span>
            </div>
            <p className="text-xs uppercase tracking-widest text-[var(--brand-orange)] font-bold">
              ONE SOCIETY. ONE LEAGUE. ONE CHAMPION.
            </p>
            <p className="text-sm leading-relaxed">
              Official box cricket championship portal for Gokul Shrishti society. Promoting athletic excellence, community bonding, and competitive spirit.
            </p>
          </div>

          {/* Col 2: Tournament Navigation */}
          <div>
            <h4 className="text-[var(--text-main)] text-sm font-semibold uppercase tracking-wider mb-4 border-l-2 border-[var(--brand-orange)] pl-2">
              Tournament Hub
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/fixtures" className="hover:text-[var(--brand-orange)] transition">Fixtures & Live Score</Link></li>
              <li><Link to="/teams" className="hover:text-[var(--brand-orange)] transition">Teams & Squads</Link></li>
              <li><Link to="/points-table" className="hover:text-[var(--brand-orange)] transition">Points Table</Link></li>
              <li><Link to="/statistics" className="hover:text-[var(--brand-orange)] transition">Orange & Purple Cap</Link></li>
              <li><Link to="/awards" className="hover:text-[var(--brand-orange)] transition">Tournament Honors</Link></li>
            </ul>
          </div>

          {/* Col 3: Players & Rules */}
          <div>
            <h4 className="text-[var(--text-main)] text-sm font-semibold uppercase tracking-wider mb-4 border-l-2 border-[var(--brand-orange)] pl-2">
              Registration & Rules
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="hover:text-[var(--brand-orange)] transition">Player Online Registration</Link></li>
              <li><Link to="/registration-status" className="hover:text-[var(--brand-orange)] transition">Check Registration Status</Link></li>
              <li><Link to="/about" className="hover:text-[var(--brand-orange)] transition">Box Cricket Rules & Bylaws</Link></li>
              <li><Link to="/news" className="hover:text-[var(--brand-orange)] transition">Committee Announcements</Link></li>
              <li><Link to="/gallery" className="hover:text-[var(--brand-orange)] transition">Event Photo Gallery</Link></li>
            </ul>
          </div>

          {/* Col 4: Location & Admin */}
          <div>
            <h4 className="text-[var(--text-main)] text-sm font-semibold uppercase tracking-wider mb-4 border-l-2 border-[var(--brand-orange)] pl-2">
              Tournament Arena
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[var(--brand-orange)] shrink-0 mt-0.5" />
                <span>Gokul Shrishti Central Turf Arena, Wings A/B/C Common Quadrangle</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[var(--brand-orange)] shrink-0" />
                <span>gspl.committee@society.internal</span>
              </div>
              <div className="pt-2">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-elevated)] hover:border-[var(--brand-orange)] text-[var(--text-main)] transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand-orange)]" />
                  <span>Committee Admin Portal</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--border-color)] pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-muted)] gap-4">
          <p>© 2026 Gokul Shrishti Premier League. All society rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Organized with</span>
            <Heart className="w-3.5 h-3.5 text-[var(--brand-red)] fill-current" />
            <span>by GSPL Sports Committee</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
