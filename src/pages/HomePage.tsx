import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Users, 
  ArrowRight, 
  Shield, 
  CheckCircle2, 
  Mail, 
  Camera, 
  HeartHandshake, 
  Clock, 
  Award,
  Sparkles,
  MapPin
} from 'lucide-react';
import { FireAtmosphereBackground } from '../components/ui/FireAtmosphereBackground';
import { useApp } from '../context/AppContext';

export const HomePage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative pb-24 overflow-hidden">
      {/* Living Atmospheric Live Rising Sparks Background */}
      <FireAtmosphereBackground />

      <div className="relative z-10 space-y-32">
        {/* ====================================================================
            1. CINEMATIC LUXURY HERO SECTION
            ==================================================================== */}
        <section className="min-h-[88vh] flex items-center justify-center pt-8 px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            {/* Tournament Crest & Official Tag */}
            <motion.div variants={itemVariants} className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[var(--brand-gold)] shadow-2xl shadow-[var(--brand-gold-glow)] bg-black">
                <img 
                  src="/gspl-logo.jpg" 
                  alt="GSPL Season 2 Official Logo" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[var(--brand-orange)] animate-ping" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-[var(--brand-gold)]">
                  Gokul Shrishti Premier League • Season 2
                </span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight uppercase leading-[1.05]">
                ONE SOCIETY. <br />
                <span className="fire-gradient-text">ONE LEAGUE.</span> <br />
                ONE CHAMPION.
              </h1>
              <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
                Welcome to Season 2 of Gokul Shrishti Premier League at Gokul Shrishti Garden. Transparent skill categorisation, balanced random drafts, legal-ball precision scoring, and live real-time tournament standings.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto luxury-btn-primary uppercase tracking-wider text-xs"
              >
                <Flame className="w-4 h-4 fill-white" />
                <span>Player Registration (No Login)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/registration-status"
                className="w-full sm:w-auto luxury-btn-secondary text-xs uppercase tracking-wider"
              >
                <Clock className="w-4 h-4 text-[var(--brand-gold)]" />
                <span>Check Status</span>
              </Link>
            </motion.div>

            {/* Society Highlights Bar */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10">
              <div className="luxury-card p-4 text-center">
                <span className="text-2xl font-black fire-gradient-text block">Wings A to E</span>
                <span className="text-xs text-[var(--text-muted)] font-medium">All Wings Residents</span>
              </div>
              <div className="luxury-card p-4 text-center">
                <span className="text-2xl font-black text-[var(--brand-gold)] block">Cat. A / B / C</span>
                <span className="text-xs text-[var(--text-muted)] font-medium">Fair Skill Balancing</span>
              </div>
              <div className="luxury-card p-4 text-center">
                <span className="text-2xl font-black fire-gradient-text block">Garden Arena</span>
                <span className="text-xs text-[var(--text-muted)] font-medium">Gokul Shrishti Garden</span>
              </div>
              <div className="luxury-card p-4 text-center">
                <span className="text-2xl font-black text-[var(--brand-gold)] block">Season 2</span>
                <span className="text-xs text-[var(--text-muted)] font-medium">Official 2026 Edition</span>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ====================================================================
            2. ABOUT US: HOW WE STARTED
            ==================================================================== */}
        <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="luxury-card p-8 sm:p-14 relative overflow-hidden border border-[var(--border-color)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--brand-gold)]">
                  <Shield className="w-4 h-4" />
                  <span>How We Started</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  From Society Garden Evenings <br />
                  <span className="fire-gradient-text">To Our Grand Season 2.</span>
                </h2>

                <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                  Gokul Shrishti Premier League (GSPL) began with a straightforward realization among residents in our Gokul Shrishti garden: society sports should never be restricted to a closed circle or stacked squads. Every resident across Wings A, B, C, D, and E—whether playing cricket regularly, occasionally after work, or picking up a bat for the first time—deserves an equal stage to play, celebrate, and compete.
                </p>

                <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                  Following the thrilling success of our inaugural edition, GSPL Season 2 brings an even higher standard of fair competition: structured categories (A, B, and C), algorithmic team distribution, legal-ball precision scoring, and live standings right here on our digital portal.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[var(--brand-gold)] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-main)]">Wings A, B, C, D & E</h4>
                      <p className="text-xs text-[var(--text-muted)]">Uniting every building wing under one community league banner.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[var(--brand-orange)] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-main)]">Gokul Shrishti Garden</h4>
                      <p className="text-xs text-[var(--text-muted)]">Our beloved home ground transformed into a box cricket arena.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="relative p-2.5 rounded-3xl bg-gradient-to-br from-[var(--brand-gold)]/40 via-[var(--brand-orange)]/30 to-[var(--brand-red)]/30 border border-[var(--border-color)] shadow-2xl">
                  <img 
                    src="/gspl-logo.jpg" 
                    alt="GSPL Season 2 Shield" 
                    className="w-full max-w-sm rounded-2xl shadow-inner object-cover"
                  />
                  <div className="absolute -bottom-4 -left-4 bg-[var(--bg-card)] border border-[var(--border-color)] px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-[var(--brand-gold)]" />
                    <div>
                      <span className="text-xs font-bold block text-[var(--text-main)]">Season 2 • 2026</span>
                      <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Gokul Shrishti Garden</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ====================================================================
            3. TOURNAMENT GALLERY (UPDATED PER REQUIREMENT)
            ==================================================================== */}
        <section id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="luxury-card p-10 sm:p-14 text-center border border-[var(--border-color)] space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] flex items-center justify-center mx-auto text-[var(--brand-gold)] shadow-inner">
              <Camera className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--brand-gold)]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Official Tournament Memories</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Tournament Gallery</h2>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] max-w-xl mx-auto">
              <p className="text-base font-semibold text-[var(--text-main)]">
                The images will be available after the event.
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-2">
                High-resolution photographs of the match days, captain meets, award ceremonies, and celebration moments at Gokul Shrishti Garden will be curated and published here once Season 2 concludes.
              </p>
            </div>
          </div>
        </section>

        {/* ====================================================================
            4. OFFICIAL SPONSORS: REVEALING SOON
            ==================================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="luxury-card p-8 sm:p-14 text-center border border-[var(--border-color)] relative overflow-hidden">
            
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--brand-gold)]">
                <HeartHandshake className="w-4 h-4" />
                <span>Partnership Opportunities</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase">
                Official Sponsors <br />
                <span className="gold-gradient-text">Revealing Soon</span>
              </h2>

              <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                The organizing committee is actively reviewing partnership proposals from local businesses, society entrepreneurs, and community benefactors. Official title and jersey sponsors will be announced shortly.
              </p>

              <div className="pt-4 border-t border-[var(--border-subtle)]">
                <p className="text-sm text-[var(--text-main)] font-semibold mb-4">
                  Feel free to contact in case you are looking to sponsor:
                </p>
                <div className="inline-flex flex-wrap items-center justify-center gap-4">
                  <a
                    href="mailto:gokulshristipremierleague@gmail.com"
                    className="luxury-btn-secondary text-xs uppercase tracking-wider !py-3 !px-6"
                  >
                    <Mail className="w-4 h-4 text-[var(--brand-gold)]" />
                    <span>gokulshristipremierleague@gmail.com</span>
                  </a>
                  <Link
                    to="/admin"
                    className="luxury-btn-primary text-xs uppercase tracking-wider !py-3 !px-6"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Committee Admin</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
};
