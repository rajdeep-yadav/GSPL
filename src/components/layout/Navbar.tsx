import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ShieldCheck, 
  Flame, 
  Sun,
  Moon,
  ChevronRight
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
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[var(--glass-nav)] backdrop-blur-xl border-b border-[var(--border-color)] shadow-xl' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Official GSPL Logo Brand */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ duration: 0.25 }}
              className="relative w-12 h-12 rounded-xl overflow-hidden border border-[var(--border-color)] bg-black shadow-lg"
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
                <span className="bg-gradient-to-r from-[var(--brand-orange)]/15 to-[var(--brand-gold)]/20 border border-[var(--brand-gold)]/40 text-[var(--brand-gold)] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                  2026
                </span>
              </div>
              <p className="text-[10px] tracking-wider text-[var(--text-muted)] uppercase font-semibold group-hover:text-[var(--brand-gold)] transition-colors">
                Gokul Shrishti Premier League
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
                  className="relative px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors"
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

          {/* Action Area: Theme Toggle & Join League & Admin */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)] hover:border-[var(--brand-gold)] transition-colors shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/register"
                className="luxury-btn-primary text-xs uppercase tracking-wider !py-2.5 !px-5"
              >
                <Flame className="w-4 h-4 fill-white" />
                <span>Register</span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/admin"
                className="luxury-btn-secondary text-xs font-semibold !py-2.5 !px-4"
              >
                <ShieldCheck className="w-4 h-4 text-[var(--brand-gold)]" />
                <span>Admin</span>
              </Link>
            </motion.div>
          </div>

          {/* Mobile hamburger & theme controls */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)] shadow-sm"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
            <Link
              to="/admin"
              className="p-2.5 rounded-xl bg-[var(--bg-card)] text-[var(--brand-gold)] border border-[var(--border-color)]"
              title="Admin Portal"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-5 pt-3 pb-6 space-y-2 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive(link.path)
                    ? 'bg-gradient-to-r from-[var(--brand-orange)] to-[var(--brand-red)] text-white'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-[var(--border-color)]">
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="w-full luxury-btn-primary text-xs uppercase tracking-wider py-3"
              >
                <Flame className="w-4 h-4 fill-white" />
                <span>Player Registration</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
