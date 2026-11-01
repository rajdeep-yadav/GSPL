import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Menu, 
  X, 
  ShieldCheck, 
  Flame, 
  Radio, 
  ChevronRight 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <motion.nav 
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#090909]/95 backdrop-blur-xl border-b border-[#27272a]/80 shadow-2xl shadow-black/80' 
          : 'bg-[#090909]/70 backdrop-blur-md border-b border-white/[0.06]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand with hover animation */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <motion.div 
              whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
              transition={{ duration: 0.4 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF5722] via-[#FF7938] to-[#E53935] flex items-center justify-center shadow-lg shadow-[#FF5722]/35 border border-white/20"
            >
              <Trophy className="w-6 h-6 text-white drop-shadow-md" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-wider text-white">GSPL</span>
                <span className="shimmer-badge bg-[#FF5722]/15 border border-[#FF5722]/40 text-[#FFAA45] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                  2026
                </span>
              </div>
              <p className="text-[10px] tracking-widest text-[#A1A1AA] uppercase font-bold group-hover:text-white transition-colors">
                Gokul Shrishti Premier League
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1 bg-[#141414]/80 p-1.5 rounded-2xl border border-white/[0.05] shadow-inner">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition-colors"
                >
                  {active && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute inset-0 bg-gradient-to-r from-[#FF5722] to-[#E53935] rounded-xl shadow-md shadow-[#FF5722]/30"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 ${active ? 'text-white' : 'text-[#A1A1AA] hover:text-white'}`}>
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Action CTA & Admin Portal */}
          <div className="hidden md:flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/register"
                className="relative overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#E53935] text-white font-black text-xs tracking-wider uppercase shadow-xl shadow-[#FF5722]/30 hover:shadow-[#FF5722]/50 transition-all flex items-center gap-2 border border-white/20"
              >
                <Flame className="w-4 h-4 fill-white animate-pulse" />
                <span>Join League</span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/admin"
                className="px-3.5 py-2.5 rounded-xl border border-white/10 hover:border-[#FF5722]/60 bg-[#161616] text-[#A1A1AA] hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-[#FF7938]" />
                <span>Admin Suite</span>
              </Link>
            </motion.div>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/admin"
              className="p-2.5 rounded-xl bg-[#141414] text-[#FF7938] border border-white/10"
              title="Admin Portal"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-[#161616] text-[#A1A1AA] hover:text-white border border-white/10"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Animated Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-b border-[#27272a] bg-[#090909]/98 backdrop-blur-2xl px-5 pt-3 pb-6 space-y-2"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold ${
                  isActive(link.path)
                    ? 'bg-gradient-to-r from-[#FF5722]/20 to-transparent text-[#FF7938] border-l-4 border-[#FF5722]'
                    : 'text-[#A1A1AA] hover:bg-[#141414] hover:text-white'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10">
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#E53935] text-white font-black text-sm tracking-wide uppercase shadow-lg shadow-[#FF5722]/40"
              >
                <Flame className="w-5 h-5 fill-white" />
                <span>Register Player Now</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
