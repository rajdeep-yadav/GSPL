import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Trophy, 
  Menu, 
  X, 
  ShieldCheck, 
  Calendar, 
  BarChart2, 
  Users, 
  Award, 
  Flame 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Fixtures & Scores', path: '/fixtures' },
    { name: 'Teams', path: '/teams' },
    { name: 'Standings', path: '/points-table' },
    { name: 'Statistics', path: '/statistics' },
    { name: 'Register', path: '/register' },
    { name: 'Status Check', path: '/registration-status' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#090909]/90 backdrop-blur-md border-b border-[#27272a]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF5722] to-[#E53935] flex items-center justify-center shadow-lg shadow-[#FF5722]/30 group-hover:scale-105 transition-all">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-wider text-white">GSPL</span>
                <span className="bg-[#FF5722]/20 border border-[#FF5722]/40 text-[#FF7938] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                  2026
                </span>
              </div>
              <p className="text-[10px] tracking-widest text-[#A1A1AA] uppercase font-semibold">
                Gokul Shrishti Premier League
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-white bg-[#191919] border border-[#FF5722]/40 shadow-sm shadow-[#FF5722]/20'
                    : 'text-[#A1A1AA] hover:text-white hover:bg-[#121212]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action CTA & Admin Portal */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/register"
              className="relative group overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#E53935] text-white font-semibold text-sm shadow-lg shadow-[#FF5722]/25 hover:shadow-[#FF5722]/40 transition-all active:scale-95 flex items-center gap-2"
            >
              <Flame className="w-4 h-4 fill-white animate-pulse" />
              <span>Join Tournament</span>
            </Link>

            <Link
              to="/admin"
              className="px-3 py-2 rounded-xl border border-[#27272a] hover:border-[#FF5722]/50 bg-[#121212] text-[#A1A1AA] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-[#FF7938]" />
              <span>Admin Portal</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/admin"
              className="p-2 rounded-lg bg-[#121212] text-[#FF7938] border border-[#27272a]"
              title="Admin Portal"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-[#191919] text-[#A1A1AA] hover:text-white border border-[#27272a]"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden border-b border-[#27272a] bg-[#090909] px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-base font-medium ${
                isActive(link.path)
                  ? 'bg-[#191919] text-[#FF5722] border-l-4 border-[#FF5722]'
                  : 'text-[#A1A1AA] hover:bg-[#121212] hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-[#1f1f23]">
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#E53935] text-white font-bold text-center"
            >
              <Flame className="w-5 h-5" />
              Register Player Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
