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
          ? 'bg-[var(--bg-secondary)]/95 backdrop-blur-xl border-b border-[var(--border-color)] shadow-2xl' 
          : 'bg-[var(--bg-main)]/80 backdrop-blur-md border-b border-[var(--border-color)]/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand with GSPL shield emblem */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="relative w-12 h-12 rounded-xl overflow-hidden border border-[var(--border-color)] shadow-md bg-black"
            >
              <img 
                src="/gspl-logo.jpg" 
                alt="GSPL Logo" 
                className="w-full h-full object-cover" 
              />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-wider text-[var(--text-main)]">GSPL</span>
                <span className="bg-[var(--brand-orange)]/15 border border-[var(--brand-orange)]/40 text-[var(--brand-orange)] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                  2026
                </span>
              </div>
              <p className="text-[10px] tracking-widest text-[var(--text-muted)] uppercase font-bold group-hover:text-[var(--brand-orange)] transition-colors">
                Gokul Shrishti Premier League
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1 bg-[var(--bg-elevated)] p-1.5 rounded-2xl border border-[var(--border-color)]">
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
                      className="absolute inset-0 bg-gradient-to-r from-[var(--brand-orange)] to-[var(--brand-red)] rounded-xl shadow-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 ${active ? 'text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Action CTA & Admin Portal & Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-main)] hover:border-[var(--brand-orange)] transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/register"
                className="gspl-btn-primary text-xs uppercase tracking-wider px-4 py-2.5"
              >
                <Flame className="w-4 h-4 fill-white" />
                <span>Join League</span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/admin"
                className="gspl-btn-secondary text-xs font-bold px-3.5 py-2.5"
              >
                <ShieldCheck className="w-4 h-4 text-[var(--brand-orange)]" />
                <span>Admin Suite</span>
              </Link>
            </motion.div>
          </div>

          {/* Mobile controls */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-main)]"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
            <Link
              to="/admin"
              className="p-2.5 rounded-xl bg-[var(--bg-elevated)] text-[var(--brand-orange)] border border-[var(--border-color)]"
              title="Admin Portal"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-main)] border border-[var(--border-color)]"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 pt-2 pb-6 space-y-2"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive(link.path)
                    ? 'bg-gradient-to-r from-[var(--brand-orange)] to-[var(--brand-red)] text-white'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-main)]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-[var(--border-color)]">
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="w-full gspl-btn-primary text-xs uppercase tracking-wider py-3"
              >
                <Flame className="w-4 h-4 fill-white" />
                <span>Join League (Register)</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
