import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ShieldCheck, 
  Flame, 
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About GSPL', path: '/#about' },
    { name: 'Gallery', path: '/#gallery' },
    { name: 'Teams & Squads', path: '/teams' },
    { name: 'Fixtures & Scores', path: '/fixtures' },
    { name: 'Standings', path: '/points-table' },
    { name: 'Statistics', path: '/statistics' },
    { name: 'Registration Status', path: '/registration-status' },
  ];

  const isActive = (path: string) => {
    if (path.startsWith('/#')) return false;
    return location.pathname === path;
  };

  return (
    <motion.nav 
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[var(--glass-nav)] backdrop-blur-xl border-b border-[var(--border-color)] shadow-xl' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5 sm:gap-3.5 group">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-[var(--border-color)] bg-black shadow-md shrink-0">
              <img 
                src="/gspl-logo.jpg" 
                alt="GSPL Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-black text-xl sm:text-2xl tracking-wider text-[var(--text-main)]">GSPL</span>
                <span className="bg-gradient-to-r from-[var(--brand-orange)]/15 to-[var(--brand-gold)]/20 border border-[var(--brand-gold)]/40 text-[var(--brand-gold)] text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                  Season 2
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] tracking-wider text-[var(--text-muted)] uppercase font-semibold">
                Gokul Shrishti
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1 px-3 py-1.5 rounded-full bg-[var(--bg-elevated)]/60 backdrop-blur-md border border-[var(--border-subtle)]">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-3 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors"
                >
                  {active && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute inset-0 bg-gradient-to-r from-[var(--brand-orange)] to-[var(--brand-red)] rounded-full shadow-md"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className={`relative z-10 transition-colors ${active ? 'text-white font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)] hover:border-[var(--brand-gold)] transition-colors shadow-sm"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <Link
              to="/register"
              className="luxury-btn-primary text-xs uppercase tracking-wider !py-2.5 !px-4"
            >
              <Flame className="w-4 h-4 fill-white" />
              <span>Register</span>
            </Link>

            <Link
              to="/admin"
              className="luxury-btn-secondary text-xs font-semibold !py-2.5 !px-3.5"
            >
              <ShieldCheck className="w-4 h-4 text-[var(--brand-gold)]" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile Fast Action Controls (Touch Friendly) */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)] active:scale-95 transition"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <Link
              to="/register"
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[var(--brand-orange)] to-[var(--brand-red)] text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm active:scale-95 transition"
            >
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>Join</span>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Navigation Menu"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)] active:scale-95 transition"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Fullscreen Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-x-0 top-16 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] px-4 pt-3 pb-8 space-y-2 shadow-2xl overflow-y-auto max-h-[calc(100vh-4rem)]"
          >
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-semibold transition active:scale-98 ${
                    isActive(link.path)
                      ? 'bg-gradient-to-r from-[var(--brand-orange)] to-[var(--brand-red)] text-white font-bold'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-[var(--border-color)] space-y-2.5">
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="w-full luxury-btn-primary text-xs uppercase tracking-wider py-3.5 flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4 fill-white" />
                <span>Player Registration (No Login)</span>
              </Link>
              
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="w-full luxury-btn-secondary text-xs uppercase tracking-wider py-3 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[var(--brand-gold)]" />
                <span>Committee Admin Dashboard</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
