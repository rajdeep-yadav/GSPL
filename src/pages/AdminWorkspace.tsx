import React, { useState } from 'react';
import { 
  Users, 
  Shuffle, 
  ShieldAlert, 
  Calendar, 
  DollarSign, 
  CheckSquare, 
  Settings, 
  FileSpreadsheet, 
  Radio, 
  Layers, 
  Plus, 
  Trash2, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Eye,
  LogOut,
  Flame,
  Award,
  Bell
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { downloadRegistrationsExcel, downloadRegistrationsCSV } from '../services/excelService';
import { PlayerRegistration, Team, AdminRole, CricketFrequency, BuildingWing, TShirtSize, PlayerCategory } from '../types';

export const AdminWorkspace: React.FC = () => {
  const { 
    registrations, 
    updateRegistrationStatus, 
    updatePlayerCategory,
    assignPlayerToTeam,
    teams,
    updateTeam,
    addTeam,
    setTeamCaptain,
    runRandomAllocation,
    resetAllocations,
    matches,
    recordDelivery,
    undoLastDelivery,
    updateMatchStatus,
    finances,
    addTransaction,
    deleteTransaction,
    tasks,
    addTask,
    updateTaskStatus,
    announcements,
    addAnnouncement,
    settings,
    updateSettings,
    admins,
    currentAdmin,
    setCurrentAdmin,
    lastExcelSync,
    triggerManualExcelSync
  } = useApp();

  // Active workspace tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'registrations' | 'captains' | 'allocation' | 'teams' | 'scoring' | 'finances' | 'tasks' | 'settings'
  >('overview');

  // Filter & Search states
  const [regSearch, setRegSearch] = useState('');
  const [regStatusFilter, setRegStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [regCategoryFilter, setRegCategoryFilter] = useState<'All' | 'A' | 'B' | 'C' | 'Unassigned'>('All');
  const [allocationMsg, setAllocationMsg] = useState<string | null>(null);

  // Scoring controls
  const [selectedMatchId, setSelectedMatchId] = useState<string>(matches[1]?.id || matches[0]?.id || '');
  const [strikerName, setStrikerName] = useState('Rahul Mehta');
  const [nonStrikerName, setNonStrikerName] = useState('Rajdeep Yadav');
  const [bowlerName, setBowlerName] = useState('Vikram Desai');

  // Finance modal / form
  const [finType, setFinType] = useState<'Expense' | 'Income'>('Expense');
  const [finTitle, setFinTitle] = useState('');
  const [finAmount, setFinAmount] = useState<number | ''>('');
  const [finCategory, setFinCategory] = useState<any>('Equipment');
  const [finPaidBy, setFinPaidBy] = useState('');
  const [finMethod, setFinMethod] = useState<'UPI' | 'Cash' | 'Bank Transfer'>('UPI');

  // Task form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [taskAssignee, setTaskAssignee] = useState('Tournament Admin');

  // New Team form
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamShort, setNewTeamShort] = useState('');
  const [newTeamColor, setNewTeamColor] = useState('#FF5722');

  const selectedMatch = matches.find(m => m.id === selectedMatchId);

  // Filtered registrations
  const filteredRegs = registrations.filter(r => {
    const matchesSearch = r.full_name.toLowerCase().includes(regSearch.toLowerCase()) || 
                          r.id.toLowerCase().includes(regSearch.toLowerCase()) ||
                          r.flat_number.includes(regSearch);
    const matchesStatus = regStatusFilter === 'All' || r.status === regStatusFilter;
    const matchesCategory = regCategoryFilter === 'All' || r.category === regCategoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Captaincy candidates
  const captainCandidates = registrations.filter(r => r.captaincy_interest && r.status === 'Approved');

  // Finances calculations
  const totalIncome = finances.filter(f => f.type === 'Income').reduce((sum, f) => sum + f.amount, 0);
  const totalExpense = finances.filter(f => f.type === 'Expense').reduce((sum, f) => sum + f.amount, 0);
  const netBalance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-[#090909] text-white flex flex-col md:flex-row">
      
      {/* 1. PERSISTENT UNIFIED SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#121212] border-r border-[#27272a] shrink-0 p-4 space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          
          {/* Workspace Brand */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF5722] to-[#E53935] flex items-center justify-center font-black text-white shadow-lg">
              GS
            </div>
            <div>
              <span className="font-black text-sm tracking-wide text-white block">GSPL WORKSPACE</span>
              <span className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider">
                Admin Shell v2.4
              </span>
            </div>
          </div>

          {/* Current Admin Role Badge */}
          <div className="bg-[#191919] p-3 rounded-xl border border-[#27272a] space-y-1">
            <div className="flex items-center justify-between text-[10px] text-[#A1A1AA] uppercase font-bold">
              <span>Active Admin</span>
              <span className="text-emerald-400">Online</span>
            </div>
            <p className="text-xs font-bold text-white truncate">{currentAdmin?.name || 'Super Admin'}</p>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#FF5722]/20 text-[#FF7938] font-bold inline-block">
              {currentAdmin?.role || 'Super Admin'}
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            <p className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-[#71717A] mb-2">
              Management Modules
            </p>

            {[
              { id: 'overview', name: 'Dashboard Overview', icon: Layers },
              { id: 'registrations', name: 'Registrations & Players', icon: Users, badge: registrations.filter(r => r.status === 'Pending').length },
              { id: 'captains', name: 'Captain Selection', icon: Award },
              { id: 'allocation', name: 'Random Allocation', icon: Shuffle },
              { id: 'teams', name: 'Teams & Squads', icon: ShieldAlert },
              { id: 'scoring', name: 'Live Scoring Engine', icon: Radio },
              { id: 'finances', name: 'Budget & Finances', icon: DollarSign },
              { id: 'tasks', name: 'Committee Tasks', icon: CheckSquare, badge: tasks.filter(t => t.status !== 'Completed').length },
              { id: 'settings', name: 'Tournament Settings', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/30'
                      : 'text-[#A1A1AA] hover:bg-[#191919] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </div>
                  {Boolean(tab.badge && tab.badge > 0) && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-white/20 text-white">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Excel Sync status & Quick Export */}
        <div className="space-y-3 pt-4 border-t border-[#1f1f23]">
          <div className="bg-[#191919] p-3 rounded-xl border border-[#27272a] text-xs space-y-2">
            <div className="flex items-center justify-between text-[10px] text-[#A1A1AA] uppercase font-bold">
              <span>Excel Live Sync</span>
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-[11px] text-[#A1A1AA]">
              Synced: <span className="text-white font-mono">{lastExcelSync || 'Just now'}</span>
            </p>
            <button
              onClick={() => triggerManualExcelSync()}
              className="w-full py-1.5 rounded-lg bg-[#27272a] hover:bg-[#323238] text-[11px] font-bold text-white flex items-center justify-center gap-1.5 transition"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Sync Workbook Now</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => downloadRegistrationsExcel(registrations)}
              className="py-1.5 px-2 rounded-lg bg-[#191919] border border-[#27272a] hover:border-emerald-500/50 text-[10px] font-bold text-white flex items-center justify-center gap-1 transition"
            >
              <Download className="w-3 h-3 text-emerald-400" />
              <span>.XLSX</span>
            </button>
            <button
              onClick={() => downloadRegistrationsCSV(registrations)}
              className="py-1.5 px-2 rounded-lg bg-[#191919] border border-[#27272a] hover:border-emerald-500/50 text-[10px] font-bold text-white flex items-center justify-center gap-1 transition"
            >
              <Download className="w-3 h-3 text-cyan-400" />
              <span>.CSV</span>
            </button>
          </div>
        </div>

      </aside>

      {/* 2. MAIN ADMIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto max-h-screen">
        
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#27272a] gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              {activeTab === 'overview' && 'Tournament Control Dashboard'}
              {activeTab === 'registrations' && 'Resident Registrations & Categorization'}
              {activeTab === 'captains' && 'Captain Nomination & Selection'}
              {activeTab === 'allocation' && 'Balanced Random Allocation Engine'}
              {activeTab === 'teams' && 'Franchise Squad Management'}
              {activeTab === 'scoring' && 'Live Box Cricket Scoring Deck'}
              {activeTab === 'finances' && 'Committee Accounts & Budget Tracker'}
              {activeTab === 'tasks' && 'Organizing Committee Tasks'}
              {activeTab === 'settings' && 'Tournament Configuration & Rules'}
            </h1>
            <p className="text-xs text-[#A1A1AA] mt-1">
              Gokul Shrishti Premier League 2026 Central Database State
            </p>
          </div>

          {/* Quick role switcher for multi-admin verification */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#71717A] uppercase font-bold">Switch Account:</span>
            <select
              value={currentAdmin?.id || ''}
              onChange={(e) => {
                const found = admins.find(a => a.id === e.target.value);
                setCurrentAdmin(found || null);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#191919] border border-[#27272a] text-xs font-bold text-white outline-none"
            >
              {admins.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.role})
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* =========================================================================
            TAB 1: OVERVIEW DASHBOARD
        ========================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metric Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#121212] border border-[#27272a] p-5 rounded-2xl space-y-2">
                <span className="text-xs uppercase font-extrabold text-[#A1A1AA] tracking-wider">Total Registrations</span>
                <p className="text-3xl font-mono font-black text-white">{registrations.length}</p>
                <p className="text-[11px] text-emerald-400 font-semibold">
                  {registrations.filter(r => r.status === 'Approved').length} Approved • {registrations.filter(r => r.status === 'Pending').length} Pending
                </p>
              </div>

              <div className="bg-[#121212] border border-[#27272a] p-5 rounded-2xl space-y-2">
                <span className="text-xs uppercase font-extrabold text-[#A1A1AA] tracking-wider">Teams & Squads</span>
                <p className="text-3xl font-mono font-black text-[#FF7938]">{teams.length}</p>
                <p className="text-[11px] text-[#A1A1AA]">
                  {registrations.filter(r => r.assigned_team_id).length} players allocated
                </p>
              </div>

              <div className="bg-[#121212] border border-[#27272a] p-5 rounded-2xl space-y-2">
                <span className="text-xs uppercase font-extrabold text-[#A1A1AA] tracking-wider">Net Finance Reserve</span>
                <p className="text-3xl font-mono font-black text-emerald-400">₹{netBalance.toLocaleString()}</p>
                <p className="text-[11px] text-[#A1A1AA]">
                  Income: ₹{totalIncome.toLocaleString()} | Spent: ₹{totalExpense.toLocaleString()}
                </p>
              </div>

              <div className="bg-[#121212] border border-[#27272a] p-5 rounded-2xl space-y-2">
                <span className="text-xs uppercase font-extrabold text-[#A1A1AA] tracking-wider">Active Match Status</span>
                <p className="text-3xl font-mono font-black text-white">
                  {matches.filter(m => m.status === 'Live').length > 0 ? 'Live In Arena' : 'No Live Match'}
                </p>
                <p className="text-[11px] text-[#FF5722] font-semibold">
                  {matches.filter(m => m.status === 'Completed').length} / {matches.length} Matches Concluded
                </p>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-[#121212] border border-[#27272a] rounded-3xl p-6 space-y-4">
              <h3 className="text-lg font-black text-white">Recommended Admin Workflows</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('registrations')}
                  className="p-4 rounded-2xl bg-[#191919] border border-[#27272a] hover:border-[#FF5722] text-left transition"
                >
                  <Users className="w-5 h-5 text-[#FF7938] mb-2" />
                  <p className="text-sm font-bold text-white">Review Pending Entries</p>
                  <p className="text-xs text-[#A1A1AA] mt-1">Review {registrations.filter(r => r.status === 'Pending').length} new resident submissions</p>
                </button>

                <button
                  onClick={() => setActiveTab('allocation')}
                  className="p-4 rounded-2xl bg-[#191919] border border-[#27272a] hover:border-[#FF5722] text-left transition"
                >
                  <Shuffle className="w-5 h-5 text-emerald-400 mb-2" />
                  <p className="text-sm font-bold text-white">Run Random Category Draft</p>
                  <p className="text-xs text-[#A1A1AA] mt-1">Distribute Category A, B, C evenly across captains</p>
                </button>

                <button
                  onClick={() => setActiveTab('scoring')}
                  className="p-4 rounded-2xl bg-[#191919] border border-[#27272a] hover:border-[#FF5722] text-left transition"
                >
                  <Radio className="w-5 h-5 text-red-400 mb-2" />
                  <p className="text-sm font-bold text-white">Open Live Scoring Console</p>
                  <p className="text-xs text-[#A1A1AA] mt-1">Record ball-by-ball deliveries for match #{selectedMatch?.match_number || 1}</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: REGISTRATIONS & CATEGORIZATION
        ========================================================================== */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">
            
            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <input
                type="text"
                placeholder="Search by name, ID, or flat number..."
                value={regSearch}
                onChange={(e) => setRegSearch(e.target.value)}
                className="w-full sm:w-80 px-4 py-2.5 rounded-xl bg-[#121212] border border-[#27272a] text-xs text-white outline-none focus:border-[#FF5722]"
              />

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={regStatusFilter}
                  onChange={(e) => setRegStatusFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-[#121212] border border-[#27272a] text-xs text-white outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <select
                  value={regCategoryFilter}
                  onChange={(e) => setRegCategoryFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-[#121212] border border-[#27272a] text-xs text-white outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="A">Category A (Regular)</option>
                  <option value="B">Category B (Occasional)</option>
                  <option value="C">Category C (Beginner)</option>
                </select>
              </div>
            </div>

            {/* Registrations Table */}
            <div className="bg-[#121212] border border-[#27272a] rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#191919] border-b border-[#27272a] text-[10px] uppercase font-bold text-[#A1A1AA]">
                      <th className="py-3 px-4">Reg ID</th>
                      <th className="py-3 px-4">Resident Name</th>
                      <th className="py-3 px-3">Age</th>
                      <th className="py-3 px-3">Wing/Flat</th>
                      <th className="py-3 px-3">Cricket Freq</th>
                      <th className="py-3 px-3">T-Shirt</th>
                      <th className="py-3 px-3">Captaincy?</th>
                      <th className="py-3 px-3 text-center">Category</th>
                      <th className="py-3 px-3 text-center">Review Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f1f23]">
                    {filteredRegs.map(reg => (
                      <tr key={reg.id} className="hover:bg-[#181818] transition">
                        <td className="py-3 px-4 font-mono font-bold text-[#FF7938]">{reg.id}</td>
                        <td className="py-3 px-4 font-bold text-white">{reg.full_name}</td>
                        <td className="py-3 px-3 font-mono text-[#A1A1AA]">{reg.age}</td>
                        <td className="py-3 px-3 text-white font-medium">Wing {reg.wing} - {reg.flat_number}</td>
                        <td className="py-3 px-3 text-[#A1A1AA]">{reg.cricket_frequency}</td>
                        <td className="py-3 px-3 font-bold text-white">{reg.tshirt_size}</td>
                        <td className="py-3 px-3">
                          {reg.captaincy_interest ? (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                              Interested
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#71717A]">No</span>
                          )}
                        </td>

                        {/* Category selection */}
                        <td className="py-3 px-3 text-center">
                          <select
                            value={reg.category}
                            onChange={(e) => updatePlayerCategory(reg.id, e.target.value as PlayerCategory)}
                            className="bg-[#191919] border border-[#27272a] rounded px-2 py-1 text-[11px] font-bold text-[#FF7938] outline-none"
                          >
                            <option value="A">Cat A</option>
                            <option value="B">Cat B</option>
                            <option value="C">Cat C</option>
                            <option value="Unassigned">Unassigned</option>
                          </select>
                        </td>

                        {/* Status badge */}
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            reg.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            reg.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {reg.status}
                          </span>
                        </td>

                        {/* Admin Action Buttons */}
                        <td className="py-3 px-4 text-right space-x-1">
                          {reg.status !== 'Approved' && (
                            <button
                              onClick={() => updateRegistrationStatus(reg.id, 'Approved')}
                              className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 font-bold text-[10px] transition"
                            >
                              Approve
                            </button>
                          )}
                          {reg.status !== 'Rejected' && (
                            <button
                              onClick={() => updateRegistrationStatus(reg.id, 'Rejected')}
                              className="px-2.5 py-1 rounded bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 font-bold text-[10px] transition"
                            >
                              Reject
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 3: CAPTAIN SELECTION
        ========================================================================== */}
        {activeTab === 'captains' && (
          <div className="space-y-6">
            <div className="bg-[#121212] border border-[#27272a] rounded-3xl p-6 space-y-4">
              <h3 className="text-lg font-black text-white">Captain Candidates & Team Appointments</h3>
              <p className="text-xs text-[#A1A1AA]">
                Players who expressed interest in captaincy and have approved registration status. Assign one captain per franchise team.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {teams.map(team => (
                  <div key={team.id} className="bg-[#191919] border border-[#27272a] p-4 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{team.name} ({team.short_code})</span>
                      <span className="text-[10px] text-[#A1A1AA] uppercase font-bold">Appointed Captain</span>
                    </div>

                    <select
                      value={team.captain_id || ''}
                      onChange={(e) => {
                        const selectedCandidate = captainCandidates.find(c => c.id === e.target.value);
                        if (selectedCandidate) {
                          setTeamCaptain(team.id, selectedCandidate.id, selectedCandidate.full_name);
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-[#121212] border border-[#27272a] text-xs font-bold text-[#FF7938] outline-none"
                    >
                      <option value="">-- Choose Team Captain --</option>
                      {captainCandidates.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.full_name} (Wing {c.wing}-{c.flat_number}, Cat {c.category})
                        </option>
                      ))}
                    </select>

                    <p className="text-[10px] text-[#71717A]">
                      Current Leader: <strong className="text-white">{team.captain_name || 'None Assigned'}</strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: RANDOM ALLOCATION ENGINE
        ========================================================================== */}
        {activeTab === 'allocation' && (
          <div className="space-y-6">
            <div className="bg-[#121212] border border-[#27272a] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-white">Non-Auction Balanced Random Allocation</h3>
                  <p className="text-xs text-[#A1A1AA] mt-1">
                    Evenly distributes Category A, B, and C players across all franchise teams with zero duplicate allocations.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      resetAllocations();
                      setAllocationMsg('Player allocations cleared (captains preserved).');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#191919] border border-[#27272a] text-xs font-bold text-rose-400 hover:border-rose-500/50 transition"
                  >
                    Reset Allocations
                  </button>
                </div>
              </div>

              {allocationMsg && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                  <span>{allocationMsg}</span>
                  <button onClick={() => setAllocationMsg(null)} className="text-white hover:opacity-75 font-bold">×</button>
                </div>
              )}

              {/* Category pools summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#191919] p-4 rounded-2xl border border-[#27272a] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase">Category A (Regulars)</span>
                    <span className="text-lg font-mono font-black text-white">
                      {registrations.filter(r => r.category === 'A' && r.status === 'Approved').length}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const res = runRandomAllocation('A');
                      setAllocationMsg(res.details);
                    }}
                    className="w-full py-2 rounded-xl bg-[#FF5722] hover:bg-[#FF7938] text-white font-bold text-xs shadow-md transition"
                  >
                    Draft Category A
                  </button>
                </div>

                <div className="bg-[#191919] p-4 rounded-2xl border border-[#27272a] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400 uppercase">Category B (Occasional)</span>
                    <span className="text-lg font-mono font-black text-white">
                      {registrations.filter(r => r.category === 'B' && r.status === 'Approved').length}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const res = runRandomAllocation('B');
                      setAllocationMsg(res.details);
                    }}
                    className="w-full py-2 rounded-xl bg-[#FF5722] hover:bg-[#FF7938] text-white font-bold text-xs shadow-md transition"
                  >
                    Draft Category B
                  </button>
                </div>

                <div className="bg-[#191919] p-4 rounded-2xl border border-[#27272a] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-300 uppercase">Category C (Beginners)</span>
                    <span className="text-lg font-mono font-black text-white">
                      {registrations.filter(r => r.category === 'C' && r.status === 'Approved').length}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const res = runRandomAllocation('C');
                      setAllocationMsg(res.details);
                    }}
                    className="w-full py-2 rounded-xl bg-[#FF5722] hover:bg-[#FF7938] text-white font-bold text-xs shadow-md transition"
                  >
                    Draft Category C
                  </button>
                </div>
              </div>

              {/* Team squad rosters preview */}
              <div className="pt-4 space-y-4">
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  Live Franchise Squad Previews
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {teams.map(t => {
                    const squad = registrations.filter(r => r.assigned_team_id === t.id);
                    return (
                      <div key={t.id} className="bg-[#191919] p-4 rounded-2xl border border-[#27272a] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{t.name}</span>
                          <span className="text-[10px] font-mono text-[#FF7938] font-bold">{squad.length} Players</span>
                        </div>
                        <ul className="text-[11px] text-[#A1A1AA] space-y-1 max-h-36 overflow-y-auto pr-1">
                          {squad.map(p => (
                            <li key={p.id} className="flex items-center justify-between">
                              <span className="truncate">{p.full_name}</span>
                              <span className="text-[9px] font-bold text-[#FF5722] ml-1">Cat {p.category}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: TEAMS & SQUADS
        ========================================================================== */}
        {activeTab === 'teams' && (
          <div className="space-y-6">
            <div className="bg-[#121212] border border-[#27272a] rounded-3xl p-6 space-y-6">
              <h3 className="text-lg font-black text-white">Create & Configure Franchise Teams</h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#191919] border border-[#27272a]">
                <input
                  type="text"
                  placeholder="Team Name (e.g. Shrishti Titans)"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#121212] border border-[#27272a] text-xs text-white outline-none"
                />
                <input
                  type="text"
                  placeholder="Short Code (e.g. ST)"
                  value={newTeamShort}
                  onChange={(e) => setNewTeamShort(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#121212] border border-[#27272a] text-xs text-white outline-none"
                />
                <input
                  type="color"
                  value={newTeamColor}
                  onChange={(e) => setNewTeamColor(e.target.value)}
                  className="h-9 w-full rounded-xl bg-[#121212] border border-[#27272a] cursor-pointer"
                />
                <button
                  onClick={() => {
                    if (!newTeamName.trim() || !newTeamShort.trim()) return;
                    addTeam({
                      name: newTeamName.trim(),
                      short_code: newTeamShort.trim().toUpperCase(),
                      logo_url: '',
                      primary_color: newTeamColor,
                      secondary_color: '#121212',
                      description: 'Society Box Cricket Contender'
                    });
                    setNewTeamName('');
                    setNewTeamShort('');
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#E53935] text-white font-bold text-xs"
                >
                  Add Team
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teams.map(team => (
                  <div key={team.id} className="bg-[#191919] p-5 rounded-2xl border border-[#27272a] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white"
                          style={{ backgroundColor: team.primary_color }}
                        >
                          {team.short_code}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{team.name}</p>
                          <p className="text-[10px] text-[#A1A1AA]">Captain: {team.captain_name || 'Unassigned'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: LIVE SCORING ENGINE
        ========================================================================== */}
        {activeTab === 'scoring' && (
          <div className="space-y-6">
            <div className="bg-[#121212] border border-[#27272a] rounded-3xl p-6 sm:p-8 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-white">Live Box Cricket Scoring Console</h3>
                  <p className="text-xs text-[#A1A1AA]">Deliveries directly update spectator scoreboards and points table.</p>
                </div>

                <select
                  value={selectedMatchId}
                  onChange={(e) => setSelectedMatchId(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-[#191919] border border-[#27272a] text-xs font-bold text-[#FF7938] outline-none"
                >
                  {matches.map(m => (
                    <option key={m.id} value={m.id}>
                      Match #{m.match_number}: {m.team1_name} vs {m.team2_name} ({m.status})
                    </option>
                  ))}
                </select>
              </div>

              {selectedMatch && (
                <div className="space-y-6">
                  
                  {/* Current scoreboard banner */}
                  <div className="bg-[#191919] p-6 rounded-2xl border border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase text-[#FF7938]">
                        Match #{selectedMatch.match_number} • {selectedMatch.stage}
                      </span>
                      <h4 className="text-2xl font-black text-white mt-1">
                        {selectedMatch.team1_name} vs {selectedMatch.team2_name}
                      </h4>
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-mono font-black text-[#FF5722]">
                        {selectedMatch.current_innings === 2 ? 
                          `${selectedMatch.innings2?.runs || 0}/${selectedMatch.innings2?.wickets || 0} (${selectedMatch.innings2?.overs_bowled || 0} ov)` :
                          `${selectedMatch.innings1?.runs || 0}/${selectedMatch.innings1?.wickets || 0} (${selectedMatch.innings1?.overs_bowled || 0} ov)`}
                      </p>
                      <p className="text-xs text-[#A1A1AA]">
                        {selectedMatch.current_innings === 2 ? `Target: ${selectedMatch.innings2?.target || 0}` : '1st Innings in progress'}
                      </p>
                    </div>
                  </div>

                  {/* Pitch Participants */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Striker Batter"
                      value={strikerName}
                      onChange={(e) => setStrikerName(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-[#191919] border border-[#27272a] text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Non-Striker Batter"
                      value={nonStrikerName}
                      onChange={(e) => setNonStrikerName(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-[#191919] border border-[#27272a] text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Current Bowler"
                      value={bowlerName}
                      onChange={(e) => setBowlerName(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-[#191919] border border-[#27272a] text-xs text-white"
                    />
                  </div>

                  {/* Big Scoring Buttons */}
                  <div className="space-y-3">
                    <span className="text-xs uppercase font-extrabold text-[#A1A1AA] tracking-wider block">
                      Record Delivery Outcome
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
                      {[0, 1, 2, 3, 4, 6].map(runs => (
                        <button
                          key={runs}
                          onClick={() => {
                            const inn = selectedMatch.current_innings || 1;
                            const overs = inn === 1 ? (selectedMatch.innings1?.overs_bowled || 0) : (selectedMatch.innings2?.overs_bowled || 0);
                            const overNum = Math.floor(overs);
                            const ballNum = Math.round((overs - overNum) * 10) + 1;

                            recordDelivery({
                              match_id: selectedMatch.id,
                              innings_number: inn,
                              over_number: overNum,
                              ball_number: ballNum,
                              bowler_name: bowlerName,
                              batsman_name: strikerName,
                              non_striker_name: nonStrikerName,
                              runs_scored: runs,
                              is_wicket: false,
                              extra_runs: 0
                            });
                          }}
                          className="py-4 rounded-2xl bg-[#191919] hover:bg-[#FF5722] hover:text-white border border-[#27272a] font-mono font-black text-xl text-white transition active:scale-95 shadow-md"
                        >
                          {runs}
                        </button>
                      ))}

                      {/* Wicket */}
                      <button
                        onClick={() => {
                          const inn = selectedMatch.current_innings || 1;
                          const overs = inn === 1 ? (selectedMatch.innings1?.overs_bowled || 0) : (selectedMatch.innings2?.overs_bowled || 0);
                          const overNum = Math.floor(overs);
                          const ballNum = Math.round((overs - overNum) * 10) + 1;

                          recordDelivery({
                            match_id: selectedMatch.id,
                            innings_number: inn,
                            over_number: overNum,
                            ball_number: ballNum,
                            bowler_name: bowlerName,
                            batsman_name: strikerName,
                            non_striker_name: nonStrikerName,
                            runs_scored: 0,
                            is_wicket: true,
                            wicket_type: 'caught',
                            extra_runs: 0
                          });
                        }}
                        className="py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 font-extrabold text-sm text-white transition active:scale-95 shadow-md shadow-rose-600/30"
                      >
                        WICKET
                      </button>

                      {/* Wide */}
                      <button
                        onClick={() => {
                          const inn = selectedMatch.current_innings || 1;
                          const overs = inn === 1 ? (selectedMatch.innings1?.overs_bowled || 0) : (selectedMatch.innings2?.overs_bowled || 0);
                          const overNum = Math.floor(overs);
                          const ballNum = Math.round((overs - overNum) * 10);

                          recordDelivery({
                            match_id: selectedMatch.id,
                            innings_number: inn,
                            over_number: overNum,
                            ball_number: ballNum,
                            bowler_name: bowlerName,
                            batsman_name: strikerName,
                            non_striker_name: nonStrikerName,
                            runs_scored: 0,
                            is_wicket: false,
                            extra_type: 'wide',
                            extra_runs: 1
                          });
                        }}
                        className="py-4 rounded-2xl bg-amber-600 hover:bg-amber-500 font-extrabold text-sm text-white transition active:scale-95"
                      >
                        WIDE
                      </button>

                      {/* No Ball */}
                      <button
                        onClick={() => {
                          const inn = selectedMatch.current_innings || 1;
                          const overs = inn === 1 ? (selectedMatch.innings1?.overs_bowled || 0) : (selectedMatch.innings2?.overs_bowled || 0);
                          const overNum = Math.floor(overs);
                          const ballNum = Math.round((overs - overNum) * 10);

                          recordDelivery({
                            match_id: selectedMatch.id,
                            innings_number: inn,
                            over_number: overNum,
                            ball_number: ballNum,
                            bowler_name: bowlerName,
                            batsman_name: strikerName,
                            non_striker_name: nonStrikerName,
                            runs_scored: 0,
                            is_wicket: false,
                            extra_type: 'no-ball',
                            extra_runs: 1
                          });
                        }}
                        className="py-4 rounded-2xl bg-amber-600 hover:bg-amber-500 font-extrabold text-sm text-white transition active:scale-95"
                      >
                        NO BALL
                      </button>

                      {/* Undo Delivery */}
                      <button
                        onClick={() => undoLastDelivery(selectedMatch.id)}
                        className="col-span-2 sm:col-span-1 py-4 rounded-2xl bg-[#27272a] hover:bg-[#3f3f46] text-xs font-bold text-white transition active:scale-95"
                      >
                        UNDO
                      </button>
                    </div>
                  </div>

                  {/* Status switches */}
                  <div className="pt-4 border-t border-[#27272a] flex items-center gap-3">
                    <span className="text-xs text-[#A1A1AA]">Set Status:</span>
                    <button
                      onClick={() => updateMatchStatus(selectedMatch.id, 'Live')}
                      className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 font-bold text-xs"
                    >
                      Set Live
                    </button>
                    <button
                      onClick={() => updateMatchStatus(selectedMatch.id, 'Completed')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 font-bold text-xs"
                    >
                      Set Completed
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 7: FINANCES & BUDGET
        ========================================================================== */}
        {activeTab === 'finances' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#121212] border border-[#27272a] p-5 rounded-2xl">
                <span className="text-xs text-[#A1A1AA] uppercase font-bold">Total Inflow</span>
                <p className="text-2xl font-mono font-black text-emerald-400 mt-1">₹{totalIncome.toLocaleString()}</p>
              </div>
              <div className="bg-[#121212] border border-[#27272a] p-5 rounded-2xl">
                <span className="text-xs text-[#A1A1AA] uppercase font-bold">Total Expenditure</span>
                <p className="text-2xl font-mono font-black text-rose-400 mt-1">₹{totalExpense.toLocaleString()}</p>
              </div>
              <div className="bg-[#121212] border border-[#27272a] p-5 rounded-2xl">
                <span className="text-xs text-[#A1A1AA] uppercase font-bold">Net Committee Balance</span>
                <p className="text-2xl font-mono font-black text-white mt-1">₹{netBalance.toLocaleString()}</p>
              </div>
            </div>

            {/* Add transaction form */}
            <div className="bg-[#121212] border border-[#27272a] rounded-3xl p-6 space-y-4">
              <h3 className="text-lg font-black text-white">Record Transaction</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={finType}
                  onChange={(e) => setFinType(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-[#191919] border border-[#27272a] text-xs font-bold text-white outline-none"
                >
                  <option value="Expense">Expense</option>
                  <option value="Income">Income / Sponsorship</option>
                </select>

                <input
                  type="text"
                  placeholder="Title (e.g. Tennis balls box)"
                  value={finTitle}
                  onChange={(e) => setFinTitle(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#191919] border border-[#27272a] text-xs text-white outline-none"
                />

                <input
                  type="number"
                  placeholder="Amount (₹)"
                  value={finAmount}
                  onChange={(e) => setFinAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-[#191919] border border-[#27272a] text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={finCategory}
                  onChange={(e) => setFinCategory(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-[#191919] border border-[#27272a] text-xs text-white outline-none"
                >
                  <option value="Equipment">Equipment</option>
                  <option value="Ground and venue">Ground and venue</option>
                  <option value="Jerseys">Jerseys</option>
                  <option value="Trophies and medals">Trophies and medals</option>
                  <option value="Refreshments">Refreshments</option>
                  <option value="Decorations">Decorations</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sponsorship">Sponsorship</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>

                <input
                  type="text"
                  placeholder="Paid By / Disbursed By"
                  value={finPaidBy}
                  onChange={(e) => setFinPaidBy(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#191919] border border-[#27272a] text-xs text-white outline-none"
                />

                <button
                  onClick={() => {
                    if (!finTitle || !finAmount) return;
                    addTransaction({
                      type: finType,
                      title: finTitle,
                      amount: Number(finAmount),
                      category: finCategory,
                      date: new Date().toISOString().split('T')[0],
                      paid_by: finPaidBy || currentAdmin?.name || 'Tournament Admin',
                      payment_method: finMethod,
                      created_by_admin: currentAdmin?.name || 'Super Admin'
                    });
                    setFinTitle('');
                    setFinAmount('');
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#E53935] text-white font-bold text-xs"
                >
                  Save Entry
                </button>
              </div>

              {/* Transaction List */}
              <div className="pt-4 divide-y divide-[#1f1f23]">
                {finances.map(f => (
                  <div key={f.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white text-sm">{f.title}</p>
                      <p className="text-[#A1A1AA]">{f.category} • Paid by {f.paid_by} via {f.payment_method}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-mono font-black text-sm ${f.type === 'Income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {f.type === 'Income' ? '+' : '-'}₹{f.amount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => deleteTransaction(f.id)}
                        className="text-zinc-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 8: TASKS
        ========================================================================== */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="bg-[#121212] border border-[#27272a] rounded-3xl p-6 space-y-6">
              <h3 className="text-lg font-black text-white">Organizing Committee Task Board</h3>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Task title (e.g. Inspect crease white tape)"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-[#191919] border border-[#27272a] text-xs text-white outline-none"
                />
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-[#191919] border border-[#27272a] text-xs text-white outline-none"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
                <button
                  onClick={() => {
                    if (!taskTitle.trim()) return;
                    addTask({
                      title: taskTitle.trim(),
                      description: 'Task logged from unified admin workspace.',
                      assigned_to: taskAssignee,
                      priority: taskPriority,
                      status: 'To Do',
                      deadline: '2026-11-04'
                    });
                    setTaskTitle('');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FF5722] text-white font-bold text-xs"
                >
                  Create Task
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map(t => (
                  <div key={t.id} className="bg-[#191919] p-4 rounded-2xl border border-[#27272a] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.priority === 'Urgent' ? 'bg-red-500/20 text-red-400' :
                        t.priority === 'High' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-zinc-600/20 text-zinc-300'
                      }`}>
                        {t.priority}
                      </span>
                      <select
                        value={t.status}
                        onChange={(e) => updateTaskStatus(t.id, e.target.value as any)}
                        className="bg-[#121212] border border-[#27272a] rounded px-2 py-0.5 text-[10px] font-bold text-white outline-none"
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Review">Review</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <p className="font-bold text-white text-xs">{t.title}</p>
                    <p className="text-[10px] text-[#A1A1AA]">{t.description}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 9: TOURNAMENT SETTINGS
        ========================================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-[#121212] border border-[#27272a] rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-xl font-black text-white">Tournament Rules & Portal Configuration</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#191919] border border-[#27272a]">
                  <div>
                    <p className="font-bold text-white text-sm">Public Player Registration</p>
                    <p className="text-xs text-[#A1A1AA]">Accept new resident entries on the public website</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.registration_open}
                    onChange={(e) => updateSettings({ registration_open: e.target.checked })}
                    className="w-5 h-5 accent-[#FF5722]"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#191919] border border-[#27272a] space-y-3">
                  <p className="font-bold text-white text-sm">Box Cricket Ruleset</p>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-[#A1A1AA] block mb-1">Runs Per Boundary Net</label>
                      <input
                        type="number"
                        value={settings.box_cricket_rules.runs_per_boundary_net}
                        onChange={(e) => updateSettings({
                          box_cricket_rules: {
                            ...settings.box_cricket_rules,
                            runs_per_boundary_net: Number(e.target.value)
                          }
                        })}
                        className="w-full px-3 py-2 rounded-xl bg-[#121212] border border-[#27272a] text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[#A1A1AA] block mb-1">Max Overs Per Innings</label>
                      <input
                        type="number"
                        value={settings.max_overs}
                        onChange={(e) => updateSettings({ max_overs: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-[#121212] border border-[#27272a] text-white"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
