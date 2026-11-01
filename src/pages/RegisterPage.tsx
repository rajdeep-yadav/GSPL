import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { BuildingWing, CricketFrequency, TShirtSize } from '../types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { addRegistration, settings } = useApp();

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
      return;
    }
    if (!age || age < 10 || age > 75) {
      setError('Please provide a valid participant age between 10 and 75.');
      return;
    }
    if (!flatNumber.trim()) {
      setError('Please enter your society flat number.');
      return;
    }
    if (!termsAccepted) {
      setError('You must accept the tournament terms & participation agreement.');
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
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to submit registration');
    } finally {
      setLoading(false);
    }
  };

  if (!settings.registration_open) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#121212] border border-[#27272a] rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">Registration Closed</h2>
          <p className="text-sm text-[#A1A1AA]">
            Online entries for Gokul Shrishti Premier League are currently locked for squad allotment.
          </p>
          <Link
            to="/registration-status"
            className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-[#191919] border border-[#27272a] hover:border-[#FF5722] text-sm font-semibold text-white transition"
          >
            Check Existing Registration Status
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Banner */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5722]/10 border border-[#FF5722]/30 text-[#FF7938] text-xs font-bold uppercase tracking-widest">
            <Flame className="w-4 h-4 fill-[#FF7938]" />
            Official Resident Registration 2026
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Step Up to the <span className="text-gradient-fire">Crease</span>
          </h1>
          <p className="text-[#A1A1AA] text-sm sm:text-base max-w-xl mx-auto">
            Box cricket tournament entry form for Gokul Shrishti. Every submission is instantly synced into the verified tournament records.
          </p>
        </div>

        {/* Success Modal / State */}
        {submittedId ? (
          <div className="bg-[#121212] border border-[#FF5722]/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl shadow-[#FF5722]/10">
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white">Registration Received!</h2>
              <p className="text-[#A1A1AA] text-sm">
                Your entry has been validated and recorded into the GSPL Master Register and live Excel workbook.
              </p>
            </div>

            <div className="inline-block bg-[#191919] border border-[#27272a] rounded-2xl p-6 text-center max-w-xs mx-auto">
              <p className="text-xs uppercase tracking-widest text-[#A1A1AA] font-bold mb-1">Your Registration ID</p>
              <p className="text-3xl font-mono font-black text-[#FF7938] tracking-wider">{submittedId}</p>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 font-semibold mt-3">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Synchronized to Excel Online</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                to={`/registration-status?id=${submittedId}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#E53935] text-white font-bold text-sm shadow-lg shadow-[#FF5722]/30 flex items-center justify-center gap-2"
              >
                <span>Track Status</span>
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
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#191919] border border-[#27272a] hover:border-[#FF5722] text-sm font-semibold text-[#A1A1AA] hover:text-white transition"
              >
                Register Another Resident
              </button>
            </div>
          </div>
        ) : (
          /* The Form */
          <div className="bg-[#121212] border border-[#27272a] rounded-3xl p-6 sm:p-10 shadow-2xl relative">
            
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Name & Age */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
                    1. Full Name <span className="text-[#FF5722]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rajdeep Yadav"
                    className="w-full px-4 py-3 rounded-xl bg-[#191919] border border-[#27272a] focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] text-white text-sm outline-none transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
                    2. Age <span className="text-[#FF5722]">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={10}
                    max={75}
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 26"
                    className="w-full px-4 py-3 rounded-xl bg-[#191919] border border-[#27272a] focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] text-white text-sm outline-none transition"
                  />
                </div>
              </div>

              {/* Row 2: Cricket Frequency */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
                  3. How often do you play cricket? <span className="text-[#FF5722]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Regularly', desc: 'I play cricket very often (Category A)' },
                    { label: 'Occasionally', desc: 'I play cricket sometimes (Category B)' },
                    { label: 'Rarely / First time', desc: 'I am a beginner (Category C)' }
                  ].map((item) => (
                    <div
                      key={item.label}
                      onClick={() => setCricketFrequency(item.label as CricketFrequency)}
                      className={`cursor-pointer p-4 rounded-xl border text-left transition-all ${
                        cricketFrequency === item.label
                          ? 'bg-[#FF5722]/10 border-[#FF5722] shadow-sm shadow-[#FF5722]/30'
                          : 'bg-[#191919] border-[#27272a] hover:border-[#3f3f46]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white">{item.label}</span>
                        {cricketFrequency === item.label && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5722]" />
                        )}
                      </div>
                      <p className="text-xs text-[#A1A1AA]">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 3: Wing and Flat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
                    4. Building Wing <span className="text-[#FF5722]">*</span>
                  </label>
                  <select
                    value={wing}
                    onChange={(e) => setWing(e.target.value as BuildingWing)}
                    className="w-full px-4 py-3 rounded-xl bg-[#191919] border border-[#27272a] focus:border-[#FF5722] text-white text-sm outline-none transition"
                  >
                    <option value="A">Wing A</option>
                    <option value="B">Wing B</option>
                    <option value="C">Wing C</option>
                    <option value="Other">Other / Row House</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
                    5. Flat Number <span className="text-[#FF5722]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={flatNumber}
                    onChange={(e) => setFlatNumber(e.target.value)}
                    placeholder="e.g. 502 or 74"
                    className="w-full px-4 py-3 rounded-xl bg-[#191919] border border-[#27272a] focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] text-white text-sm outline-none transition"
                  />
                </div>
              </div>

              {/* Row 4: T-Shirt Size */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
                  6. Tournament Jersey T-Shirt Size <span className="text-[#FF5722]">*</span>
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as TShirtSize[]).map((sz) => (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => setTshirtSize(sz)}
                      className={`py-3 rounded-xl text-xs font-extrabold transition-all ${
                        tshirtSize === sz
                          ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/30 scale-105'
                          : 'bg-[#191919] text-[#A1A1AA] border border-[#27272a] hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 5: Captaincy Interest */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
                  7. Are you interested in Captaincy? <span className="text-[#FF5722]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setCaptaincyInterest(true)}
                    className={`cursor-pointer p-3.5 rounded-xl border flex items-center justify-between transition ${
                      captaincyInterest
                        ? 'bg-[#FF5722]/10 border-[#FF5722] text-white'
                        : 'bg-[#191919] border-[#27272a] text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-semibold">Yes, I am interested in leading a team</span>
                    <input
                      type="radio"
                      name="captaincy"
                      checked={captaincyInterest}
                      onChange={() => setCaptaincyInterest(true)}
                      className="accent-[#FF5722]"
                    />
                  </div>

                  <div
                    onClick={() => setCaptaincyInterest(false)}
                    className={`cursor-pointer p-3.5 rounded-xl border flex items-center justify-between transition ${
                      !captaincyInterest
                        ? 'bg-[#FF5722]/10 border-[#FF5722] text-white'
                        : 'bg-[#191919] border-[#27272a] text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-semibold">No, play as squad member only</span>
                    <input
                      type="radio"
                      name="captaincy"
                      checked={!captaincyInterest}
                      onChange={() => setCaptaincyInterest(false)}
                      className="accent-[#FF5722]"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-[#71717A] italic">
                  * Expressing captaincy interest does not guarantee appointment. Captains are finalized by the Tournament Committee.
                </p>
              </div>

              {/* Row 6: Terms and Agreement */}
              <div className="bg-[#191919] border border-[#27272a] rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#FF7938]" />
                  <span>8. GSPL Participation Agreement & Bylaws</span>
                </div>
                <div className="text-xs text-[#A1A1AA] max-h-28 overflow-y-auto pr-2 space-y-1.5 leading-relaxed">
                  <p>1. <strong>Residency:</strong> Participant confirms bonafide residency within Gokul Shrishti society premises.</p>
                  <p>2. <strong>Categorization & Allocation:</strong> Players acknowledge categorization (A, B, C) and random non-auction team allotment designed to guarantee balanced competition.</p>
                  <p>3. <strong>Discipline:</strong> Umpire decisions and tournament committee committee rulings are absolute and final.</p>
                  <p>4. <strong>Safety & Box Rules:</strong> Players agree to box cricket guidelines (underarm/overarm limits, net boundaries, protective gear).</p>
                </div>
                <label className="flex items-center gap-3 pt-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 rounded text-[#FF5722] focus:ring-[#FF5722] bg-[#121212] border-[#3f3f46] accent-[#FF5722]"
                  />
                  <span className="text-xs text-white font-medium">
                    I have read and explicitly agree to the GSPL Tournament Bylaws and Committee Terms.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#E53935] text-white font-extrabold text-base tracking-wide shadow-xl shadow-[#FF5722]/30 hover:shadow-[#FF5722]/50 active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Submit & Synchronize to GSPL Register</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-[#A1A1AA] pt-1">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Forms style sync: instantly reflected in Central Excel workbook</span>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
