import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ShieldAlert, 
  FileSpreadsheet, 
  User, 
  Home, 
  Tag 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PlayerRegistration } from '../types';

export const RegistrationStatusPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { registrations, teams } = useApp();

  const [query, setQuery] = useState(searchParams.get('id') || '');
  const [searchedRecord, setSearchedRecord] = useState<PlayerRegistration | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      setQuery(idFromUrl);
      handleSearch(idFromUrl);
    }
  }, [searchParams, registrations]);

  const handleSearch = (searchTerm: string) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setSearchedRecord(null);
      setHasSearched(false);
      return;
    }

    const found = registrations.find(
      r => r.id.toLowerCase() === term || r.full_name.toLowerCase().includes(term)
    );

    setSearchedRecord(found || null);
    setHasSearched(true);
  };

  const getTeamName = (teamId?: string | null) => {
    if (!teamId) return 'Not Yet Allocated';
    const t = teams.find(team => team.id === teamId);
    return t ? t.name : 'Allocated';
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#191919] border border-[#27272a] text-[#A1A1AA] text-xs font-semibold uppercase tracking-wider">
            <Search className="w-3.5 h-3.5 text-[#FF7938]" />
            Official Verification Desk
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Registration <span className="text-gradient-fire">Status Lookup</span>
          </h1>
          <p className="text-sm text-[#A1A1AA]">
            Enter your unique Registration ID (e.g. GSPL-2026-001) or Full Name to check review status, categorized bracket, and team allocation.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-[#121212] border border-[#27272a] rounded-2xl p-3 flex items-center gap-2 shadow-xl">
          <Search className="w-5 h-5 text-[#A1A1AA] ml-2 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="Enter Registration ID or Full Name..."
            className="w-full bg-transparent text-white text-sm outline-none placeholder-[#71717A] py-1"
          />
          <button
            onClick={() => handleSearch(query)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#E53935] text-white font-bold text-xs shadow-md shadow-[#FF5722]/30 hover:opacity-90 transition shrink-0"
          >
            Check Status
          </button>
        </div>

        {/* Results Card */}
        {hasSearched && searchedRecord && (
          <div className="bg-[#121212] border border-[#27272a] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in duration-300">
            
            {/* Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#27272a] gap-4">
              <div>
                <span className="text-xs font-mono text-[#FF7938] font-bold uppercase tracking-wider">
                  {searchedRecord.id}
                </span>
                <h2 className="text-2xl font-black text-white">{searchedRecord.full_name}</h2>
              </div>

              <div className="flex items-center gap-2">
                {searchedRecord.status === 'Approved' && (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approved & Verified</span>
                  </span>
                )}
                {searchedRecord.status === 'Pending' && (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                    <Clock className="w-4 h-4" />
                    <span>Under Review</span>
                  </span>
                )}
                {searchedRecord.status === 'Rejected' && (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
                    <XCircle className="w-4 h-4" />
                    <span>Registration Declined</span>
                  </span>
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#191919] p-4 rounded-xl border border-[#27272a]">
                <span className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider block">Wing & Flat</span>
                <span className="text-base font-extrabold text-white mt-1 block">
                  Wing {searchedRecord.wing} - {searchedRecord.flat_number}
                </span>
              </div>

              <div className="bg-[#191919] p-4 rounded-xl border border-[#27272a]">
                <span className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider block">Player Category</span>
                <span className="text-base font-extrabold text-[#FF7938] mt-1 block">
                  Category {searchedRecord.category}
                </span>
              </div>

              <div className="bg-[#191919] p-4 rounded-xl border border-[#27272a]">
                <span className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider block">Jersey Size</span>
                <span className="text-base font-extrabold text-white mt-1 block">
                  {searchedRecord.tshirt_size}
                </span>
              </div>

              <div className="bg-[#191919] p-4 rounded-xl border border-[#27272a]">
                <span className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider block">Captaincy Interest</span>
                <span className="text-base font-extrabold text-white mt-1 block">
                  {searchedRecord.captaincy_interest ? 'Yes (Candidate)' : 'No'}
                </span>
              </div>
            </div>

            {/* Team Allocation Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#191919] to-[#141414] border border-[#27272a] flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-[#A1A1AA] tracking-wider block">
                  Allocated Tournament Team
                </span>
                <span className="text-xl font-black text-white mt-0.5 block">
                  {getTeamName(searchedRecord.assigned_team_id)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Synced to Excel</span>
              </div>
            </div>

          </div>
        )}

        {hasSearched && !searchedRecord && (
          <div className="bg-[#121212] border border-[#27272a] rounded-2xl p-8 text-center space-y-3">
            <ShieldAlert className="w-8 h-8 text-[#FF5722] mx-auto" />
            <h3 className="text-lg font-bold text-white">No Record Found</h3>
            <p className="text-sm text-[#A1A1AA] max-w-sm mx-auto">
              We couldn't locate any registration matching &ldquo;{query}&rdquo;. Please verify your ID or register as a participant.
            </p>
            <div className="pt-2">
              <Link
                to="/register"
                className="inline-block px-5 py-2.5 rounded-xl bg-[#FF5722] text-white text-xs font-bold shadow-lg shadow-[#FF5722]/30"
              >
                Go to Registration Form
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
