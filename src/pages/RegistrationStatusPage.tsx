import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  User, 
  Home, 
  Tag,
  Shield,
  ArrowRight
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
    if (!teamId) return 'Draft in progress';
    const t = teams.find(team => team.id === teamId);
    return t ? t.name : 'Allocated';
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--brand-gold)] text-xs font-bold uppercase tracking-wider">
          <Search className="w-3.5 h-3.5 text-[var(--brand-orange)]" />
          <span>Official Verification Desk</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)]">
          Registration <span className="gold-gradient-text">Status Lookup</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Enter your unique Registration ID (e.g. GSPL-2026-001) or Full Name to check approval status, category, and squad allocation.
        </p>
      </div>

      {/* Search Input */}
      <div className="luxury-card p-2 flex items-center gap-2">
        <Search className="w-5 h-5 text-[var(--text-subtle)] ml-3 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
          placeholder="Enter Registration ID or Name..."
          className="flex-1 bg-transparent px-2 py-3 text-sm text-[var(--text-main)] placeholder-[var(--text-subtle)] focus:outline-none font-medium"
        />
        <button
          onClick={() => handleSearch(query)}
          className="luxury-btn-primary text-xs uppercase tracking-wider !py-2.5 !px-5"
        >
          Search
        </button>
      </div>

      {/* Result Output */}
      {hasSearched && (
        <div>
          {searchedRecord ? (
            <div className="luxury-card p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] block">
                    Verified Society Entry
                  </span>
                  <h3 className="text-xl font-bold text-[var(--text-main)]">
                    {searchedRecord.full_name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] block">
                    ID
                  </span>
                  <span className="font-mono text-xs font-bold text-[var(--brand-gold)]">
                    {searchedRecord.id}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Status</span>
                  <span className="text-xs font-bold text-emerald-500 mt-1 block">
                    {searchedRecord.status}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Category</span>
                  <span className="text-xs font-bold text-[var(--brand-gold)] mt-1 block">
                    Cat. {searchedRecord.category || 'Unassigned'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Residence</span>
                  <span className="text-xs font-bold text-[var(--text-main)] mt-1 block">
                    Wing {searchedRecord.wing} - {searchedRecord.flat_number}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Squad Assignment</span>
                  <span className="text-sm font-bold text-[var(--text-main)] mt-0.5 block">
                    {getTeamName(searchedRecord.assigned_team_id)}
                  </span>
                </div>
                <Shield className="w-5 h-5 text-[var(--brand-orange)]" />
              </div>

            </div>
          ) : (
            <div className="luxury-card p-10 text-center space-y-3">
              <XCircle className="w-8 h-8 text-[var(--brand-red)] mx-auto opacity-70" />
              <h3 className="text-base font-bold text-[var(--text-main)]">No registration record found</h3>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                No entry matched "{query}". Please check the spelling or submit a new entry if you have not registered yet.
              </p>
              <div className="pt-2">
                <Link to="/register" className="luxury-btn-primary text-xs uppercase tracking-wider">
                  Go to Registration
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
