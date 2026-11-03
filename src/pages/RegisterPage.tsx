import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight,
  User,
  Home,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';
import { BuildingWing, CricketFrequency, TShirtSize } from '../types';

export const RegisterPage: React.FC = () => {
  const { addRegistration } = useApp();

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [cricketFrequency, setCricketFrequency] = useState<CricketFrequency>('Regularly');
  const [wing, setWing] = useState<BuildingWing>('A');
  const [flatNumber, setFlatNumber] = useState('');
  const [tshirtSize, setTshirtSize] = useState<TShirtSize>('L');
  const [captaincyInterest, setCaptaincyInterest] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please provide your full legal or society name.');
      toast.error('Full Name is required');
      return;
    }
    if (!age || age < 10 || age > 75) {
      setError('Please provide a valid participant age between 10 and 75.');
      toast.error('Age must be between 10 and 75');
      return;
    }
    if (!flatNumber.trim()) {
      setError('Please enter your society flat number.');
      toast.error('Flat number is required');
      return;
    }
    if (!termsAccepted) {
      setError('You must accept the tournament terms & participation agreement.');
      toast.error('Accept terms and conditions to proceed');
      return;
    }

    setLoading(true);
    try {
      const regId = await addRegistration({
        full_name: fullName.trim(),
        age: Number(age),
        cricket_frequency: cricketFrequency,
        wing,
        flat_number: flatNumber.trim(),
        tshirt_size: tshirtSize,
        captaincy_interest: captaincyInterest,
        terms_accepted: termsAccepted,
        terms_version: 'v1.0-2026'
      });

      setSubmittedId(regId);
      toast.success(`Registration Confirmed: ${regId}`);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5A1F', '#F5C042', '#E02424']
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration. Please try again.');
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--brand-gold)] text-xs font-bold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-[var(--brand-orange)]" />
          <span>Official Player Entry</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)]">
          Player <span className="gold-gradient-text">Registration</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)] max-w-lg mx-auto">
          No account or login required. Complete this official entry form to participate in Gokul Shrishti Premier League 2026.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {submittedId ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="luxury-card p-8 sm:p-12 text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[var(--text-main)]">Registration Successfully Recorded!</h2>
              <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
                Save your unique registration tracking ID below to check review status and team assignment.
              </p>
            </div>

            <div className="bg-[var(--bg-elevated)] border border-[var(--brand-gold)]/40 p-4 rounded-xl max-w-sm mx-auto">
              <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block tracking-widest">
                Your Unique GSPL Tracking ID
              </span>
              <span className="text-2xl font-black font-mono fire-gradient-text">
                {submittedId}
              </span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={`/registration-status?id=${submittedId}`}
                className="w-full sm:w-auto luxury-btn-primary text-xs uppercase tracking-wider"
              >
                <span>Track Status Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => {
                  setSubmittedId(null);
                  setFullName('');
                  setAge('');
                  setFlatNumber('');
                  setTermsAccepted(false);
                }}
                className="w-full sm:w-auto luxury-btn-secondary text-xs uppercase tracking-wider"
              >
                Submit Another Entry
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="luxury-card p-6 sm:p-10 space-y-8">
            
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Field 1: Full Name */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[var(--brand-orange)]" />
                <span>1. Full Name *</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rajdeep Yadav"
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] placeholder-[var(--text-subtle)] focus:outline-none focus:border-[var(--brand-gold)] transition text-sm font-medium"
              />
            </div>

            {/* Field 2 & 4 & 5: Age, Wing, Flat Number */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider text-[var(--text-muted)]">
                  2. Age (Years) *
                </label>
                <input
                  type="number"
                  min="10"
                  max="75"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 25"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] placeholder-[var(--text-subtle)] focus:outline-none focus:border-[var(--brand-gold)] transition text-sm font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider text-[var(--text-muted)]">
                  4. Building Wing *
                </label>
                <select
                  value={wing}
                  onChange={(e) => setWing(e.target.value as BuildingWing)}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-gold)] transition text-sm font-medium"
                >
                  <option value="A">Wing A</option>
                  <option value="B">Wing B</option>
                  <option value="C">Wing C</option>
                  <option value="D">Wing D</option>
                  <option value="E">Wing E</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-[var(--brand-orange)]" />
                  <span>5. Flat Number *</span>
                </label>
                <input
                  type="text"
                  required
                  value={flatNumber}
                  onChange={(e) => setFlatNumber(e.target.value)}
                  placeholder="e.g. 402"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] placeholder-[var(--text-subtle)] focus:outline-none focus:border-[var(--brand-gold)] transition text-sm font-medium"
                />
              </div>
            </div>

            {/* Field 3: Cricket Frequency */}
            <div className="space-y-3">
              <label className="text-xs uppercase font-bold tracking-wider text-[var(--text-muted)] block">
                3. How often do you play cricket? (Used for fair category drafting) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['Regularly', 'Occasionally', 'Rarely / First time'] as CricketFrequency[]).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setCricketFrequency(freq)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      cricketFrequency === freq
                        ? 'border-[var(--brand-orange)] bg-[var(--brand-orange)]/10 text-[var(--text-main)] shadow-sm'
                        : 'border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:border-[var(--border-subtle)]'
                    }`}
                  >
                    <span className="text-xs font-bold block">{freq}</span>
                    <span className="text-[10px] text-[var(--text-subtle)] mt-1">
                      {freq === 'Regularly' ? 'Suggested Cat. A' : freq === 'Occasionally' ? 'Suggested Cat. B' : 'Suggested Cat. C'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Field 6 & 7: T-shirt Size & Captaincy Interest */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider text-[var(--text-muted)]">
                  6. Official T-Shirt Size *
                </label>
                <div className="flex gap-2">
                  {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as TShirtSize[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setTshirtSize(sz)}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition border ${
                        tshirtSize === sz
                          ? 'border-[var(--brand-gold)] bg-[var(--brand-gold)]/15 text-[var(--brand-gold)]'
                          : 'border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider text-[var(--text-muted)]">
                  7. Interested in Captaincy? *
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCaptaincyInterest(true)}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition border ${
                      captaincyInterest
                        ? 'border-[var(--brand-orange)] bg-[var(--brand-orange)]/15 text-[var(--brand-orange)]'
                        : 'border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                    }`}
                  >
                    Yes, Nominate Me
                  </button>
                  <button
                    type="button"
                    onClick={() => setCaptaincyInterest(false)}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition border ${
                      !captaincyInterest
                        ? 'border-[var(--border-color)] bg-[var(--bg-elevated)] text-[var(--text-main)]'
                        : 'border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                    }`}
                  >
                    No, Squad Player
                  </button>
                </div>
              </div>
            </div>

            {/* Field 8: Terms acceptance */}
            <div className="pt-2">
              <label className="flex items-start gap-3 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-[var(--brand-orange)] focus:ring-[var(--brand-orange)] border-[var(--border-color)] bg-[var(--bg-secondary)]"
                />
                <span className="text-xs text-[var(--text-muted)] leading-relaxed">
                  8. I accept the <span className="text-[var(--text-main)] font-semibold">GSPL Tournament Terms & Bylaws</span>. I agree to abide by the box cricket rules, accept random draft assignment in good sportsmanship, and treat all community participants with mutual respect.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full luxury-btn-primary uppercase tracking-wider text-xs py-3.5 shadow-lg"
            >
              {loading ? (
                <span>Recording Entry...</span>
              ) : (
                <>
                  <Flame className="w-4 h-4 fill-white" />
                  <span>Submit Player Registration</span>
                </>
              )}
            </button>

          </form>
        )}
      </AnimatePresence>

    </div>
  );
};
