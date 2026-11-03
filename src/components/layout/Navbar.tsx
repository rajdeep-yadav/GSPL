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
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

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
    { name: 'About', path: '/#about' },
    { name: 'Gallery', path: '/#gallery' },
    { name: 'Teams', path: '/teams' },
    { name: 'Fixtures', path: '/fixtures' },
    { name: 'Standings', path: '/points-table' },
    { name: 'Stats', path: '/statistics' },
    { name: 'Status', path: '/registration-status' },
  ];

  const isActive = (path: string) => {
    if (path.startsWith('/#')) return false;
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--glass-nav)] backdrop-blur-md border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Clean Brand Identity */}
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-[var(--border-color)] bg-black shadow-md shrink-0">
              <img 
                src="/gspl-logo.jpg" 
                alt="GSPL Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[var(--text-main)] leading-none">
                  GSPL
                </span>
                <span className="text-[10px] font-bold text-[var(--brand-gold)] uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--brand-gold)]/10 border border-[var(--brand-gold)]/20 leading-none">
                  Season 2
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-[var(--text-muted)] font-medium mt-1 tracking-wide leading-none">
                Gokul Shristi Premier League
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[var(--brand-orange)] to-[var(--brand-red)] text-white shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action Area */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)] hover:border-[var(--brand-gold)] transition-colors shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            <Link
              to="/register"
              className="luxury-btn-primary text-xs uppercase tracking-wider !py-2 !px-4"
            >
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>Register</span>
            </Link>

            <Link
              to="/admin"
              className="luxury-btn-secondary text-xs font-semibold !py-2 !px-3.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile Fast Action Controls */}
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
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[var(--brand-orange)] to-[var(--brand-red)] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm active:scale-95 transition"
            >
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>Join</span>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)] active:scale-95 transition"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 pt-2 pb-6 space-y-2 shadow-2xl"
          >
            <div className="grid grid-cols-2 gap-1.5 pb-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-center transition ${
                    isActive(link.path)
                      ? 'bg-gradient-to-r from-[var(--brand-orange)] to-[var(--brand-red)] text-white'
                      : 'text-[var(--text-muted)] bg-[var(--bg-card)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="w-full luxury-btn-primary text-xs uppercase tracking-wider py-3 flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4 fill-white" />
                <span>Player Registration (No Login)</span>
              </Link>
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="w-full luxury-btn-secondary text-xs uppercase tracking-wider py-2.5 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[var(--brand-gold)]" />
                <span>Committee Admin Console</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
