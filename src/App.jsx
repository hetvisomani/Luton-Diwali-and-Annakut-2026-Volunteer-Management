import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  AlertCircle, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Edit3, 
  Flame, 
  Sparkles, 
  Sun, 
  Moon, 
  Trash2, 
  Save, 
  X,
  Crown,
  FileSpreadsheet,
  RefreshCw,
  ExternalLink,
  Mail,
  Smartphone,
  BarChart3,
  Check,
  ChevronRight,
  User,
  Download,
  CalendarDays,
  Layers,
  ArrowRight,
  ShieldCheck,
  Send,
  Sparkle,
  PhoneCall,
  MessageSquare,
  Building2,
  Info,
  LogOut,
  QrCode,
  Share2,
  KeyRound,
  Grid,
  TrendingUp
} from 'lucide-react';

const DEPARTMENTS = [
  "Annakut Setup/Windup",
  "AV",
  "Catering/Food stalls",
  "Finance",
  "Housekeeping",
  "Mandir Shop",
  "Outreach",
  "Parking",
  "Photography/Videography",
  "Security",
  "Sabha Vyavestha",
  "Sampark",
  "Welcome",
  "Flow management",
  "Volunteer management"
];

const TIME_SLOTS = [
  "9am to 1pm",
  "1pm to 5pm",
  "5pm to 10pm"
];

const DAYS = [
  { id: 'diwali', label: 'Diwali Day', date: '08/11/2026' },
  { id: 'setup_windup', label: 'Annakut Setup / Preparation', date: '09/11/2026' },
  { id: 'annakut', label: 'Annakut / New Year Day', date: '10/11/2026' }
];

const MANDALS = [
  "Sanyukta Mandal (ages 36+)",
  "Sanyukta Mahila Mandal (ages 36+)",
  "Yuvak Mandal (ages 22-35)",
  "Yuvati Mandal (ages 22-35)",
  "Kishore Mandal (year 9 - age 21)",
  "Kishori Mandal (year 9 - age 21)"
];

const DEPARTMENT_LEADS = {
  "Annakut Setup/Windup": { lead: "Bhavesh Patel", phone: "07700 900111" },
  "AV": { lead: "Ketan Shah", phone: "07700 900222" },
  "Catering/Food stalls": { lead: "Dhiren Amin", phone: "07700 900333" },
  "Finance": { lead: "Sanjay Mehta", phone: "07700 900444" },
  "Housekeeping": { lead: "Mahesh Joshi", phone: "07700 900555" },
  "Mandir Shop": { lead: "Rakesh Patel", phone: "07700 900666" },
  "Outreach": { lead: "Anil Kumar", phone: "07700 900777" },
  "Parking": { lead: "Jiten Patel", phone: "07700 900888" },
  "Photography/Videography": { lead: "Pravin Tailor", phone: "07700 900999" },
  "Security": { lead: "Dipak Bhagat", phone: "07700 900123" },
  "Sabha Vyavestha": { lead: "Hitesh Trivedi", phone: "07700 900234" },
  "Sampark": { lead: "Nitin Sharma", phone: "07700 900345" },
  "Welcome": { lead: "Jayesh Patel", phone: "07700 900456" },
  "Flow management": { lead: "Amit Parikh", phone: "07700 900567" },
  "Volunteer management": { lead: "Harish Dave", phone: "07700 900678" }
};

const generateInitialShifts = () => {
  const shifts = [];
  let idCounter = 1;

  DEPARTMENTS.forEach(dept => {
    DAYS.forEach(dayObj => {
      TIME_SLOTS.forEach(slot => {
        shifts.push({
          id: `shift-${idCounter++}`,
          department: dept,
          day: dayObj.id,
          title: `${dept} - ${slot}`,
          timeSlot: slot,
          requiredVolunteers: 5,
          assignedVolunteers: [],
          leadVolunteerId: null,
          location: `${dept} Zone`,
          isUrgent: false
        });
      });
    });
  });

  // Sample assignments
  shifts[0].assignedVolunteers = ['sub-1', 'sub-2'];
  shifts[0].leadVolunteerId = 'sub-1';
  shifts[1].assignedVolunteers = ['sub-3'];
  shifts[15].assignedVolunteers = ['sub-2']; // Monday setup shift
  shifts[30].assignedVolunteers = ['sub-4'];

  return shifts;
};

const initialSubmissions = [
  {
    id: 'sub-1',
    sid: 'SID-1001',
    fullName: 'Jay Patel',
    phone: '07123456789',
    email: 'jay.patel@example.com',
    mandal: 'Yuvak Mandal (ages 22-35)',
    preferredDepartments: ['Housekeeping', 'Parking', 'Annakut Setup/Windup'],
    availability: {
      diwali: ['9am to 1pm', '1pm to 5pm'],
      setup_windup: ['5pm to 10pm'],
      annakut: ['5pm to 10pm']
    },
    customAvailability: { diwali: '', setup_windup: '', annakut: '' },
    status: 'Assigned',
    assignedShifts: ['shift-1']
  },
  {
    id: 'sub-2',
    sid: 'SID-1002',
    fullName: 'Priya Shah',
    phone: '07987654321',
    email: 'priya.shah@example.com',
    mandal: 'Yuvati Mandal (ages 22-35)',
    preferredDepartments: ['Welcome', 'Catering/Food stalls', 'Annakut Setup/Windup'],
    availability: {
      diwali: ['9am to 1pm', '1pm to 5pm'],
      setup_windup: ['9am to 1pm', '1pm to 5pm'],
      annakut: ['1pm to 5pm']
    },
    customAvailability: { diwali: '', setup_windup: '', annakut: '' },
    status: 'Assigned',
    assignedShifts: ['shift-1', 'shift-16']
  },
  {
    id: 'sub-3',
    sid: 'SID-1003',
    fullName: 'Anil Kumar',
    phone: '07111222333',
    email: 'anil.k@example.com',
    mandal: 'Sanyukta Mandal (ages 36+)',
    preferredDepartments: ['Security', 'Parking'],
    availability: {
      diwali: ['1pm to 5pm'],
      setup_windup: ['5pm to 10pm'],
      annakut: ['9am to 1pm', '1pm to 5pm']
    },
    customAvailability: { diwali: '', setup_windup: '', annakut: '' },
    status: 'Assigned',
    assignedShifts: ['shift-2']
  },
  {
    id: 'sub-4',
    sid: 'SID-1004',
    fullName: 'Neha Sharma',
    phone: '07444555666',
    email: 'neha.s@example.com',
    mandal: 'Kishori Mandal (year 9 - age 21)',
    preferredDepartments: ['Mandir Shop', 'Welcome'],
    availability: {
      diwali: ['5pm to 10pm'],
      setup_windup: ['9am to 1pm'],
      annakut: ['All Day']
    },
    customAvailability: { diwali: '', setup_windup: '', annakut: '' },
    status: 'Pending',
    assignedShifts: []
  }
];

const RangoliArt = ({ className = "w-16 h-16 opacity-15" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="50" cy="50" r="45" strokeDasharray="4 2" />
    <circle cx="50" cy="50" r="35" />
    <circle cx="50" cy="50" r="20" />
    <path d="M50 5 L50 95 M5 50 L95 50" />
    <path d="M18 18 L82 82 M18 82 L82 18" />
    <path d="M50 20 Q65 35 50 50 Q35 35 50 20 Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M50 80 Q65 65 50 50 Q35 65 50 80 Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M20 50 Q35 65 50 50 Q35 35 20 50 Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M80 50 Q65 65 50 50 Q65 35 80 50 Z" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('portal'); // 'portal', 'form', 'allocation', 'masterRota', 'ragGaps'
  const [darkMode, setDarkMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);

  // Rota & Sevaks state
  const [shifts, setShifts] = useState(generateInitialShifts);
  const [submissions, setSubmissions] = useState(initialSubmissions);

  // Sync / Microsoft Form state
  const [msFormUrl, setMsFormUrl] = useState('https://forms.office.com/r/BAPS-Luton-Diwali-2026');
  const [lastSynced, setLastSynced] = useState(new Date().toLocaleTimeString());
  const [isSyncing, setIsSyncing] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  // Sevak Portal SID Login State
  const [portalSidInput, setPortalSidInput] = useState('');
  const [loggedInSevak, setLoggedInSevak] = useState(null);
  const [portalMessage, setPortalMessage] = useState('');

  // Master Rota Filters
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [selectedDayFilter, setSelectedDayFilter] = useState('ALL');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('ALL');

  // Allocation Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [mandalFilter, setMandalFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Combined RAG & Calendar Gaps filters
  const [ragGapDeptFilter, setRagGapDeptFilter] = useState('ALL');
  const [ragGapDayFilter, setRagGapDayFilter] = useState('diwali');

  // Edit Shift Modal State
  const [editingShift, setEditingShift] = useState(null);

  const handleSyncMicrosoftForm = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSynced(new Date().toLocaleTimeString());
    }, 1200);
  };

  const handleImportCSVData = () => {
    try {
      if (!importJsonText.trim()) return;
      const parsed = JSON.parse(importJsonText);
      if (Array.isArray(parsed)) {
        const formatted = parsed.map((item, idx) => ({
          id: `sub-import-${Date.now()}-${idx}`,
          sid: item.sid || `SID-${Math.floor(1000 + Math.random() * 9000)}`,
          fullName: item.fullName || item.Name || 'New Sevak',
          phone: item.phone || item.Phone || 'N/A',
          email: item.email || item.Email || '',
          mandal: item.mandal || 'Yuvak Mandal (ages 22-35)',
          preferredDepartments: item.preferredDepartments || ['No preference'],
          availability: item.availability || { diwali: ['All Day'], setup_windup: ['All Day'], annakut: ['All Day'] },
          customAvailability: { diwali: '', setup_windup: '', annakut: '' },
          status: 'Pending',
          assignedShifts: []
        }));
        setSubmissions(prev => [...formatted, ...prev]);
        setImportJsonText('');
        setShowImportModal(false);
        alert(`Successfully imported ${formatted.length} sevaks with personalized SIDs!`);
      }
    } catch (e) {
      alert('Invalid JSON format. Please paste a valid JSON array exported from Microsoft Excel.');
    }
  };

  const handlePortalLogin = (e) => {
    e.preventDefault();
    const cleanSid = portalSidInput.trim().toUpperCase();
    const found = submissions.find(s => s.sid.toUpperCase() === cleanSid);

    if (found) {
      setLoggedInSevak(found);
      setPortalMessage('');
    } else {
      setPortalMessage('Invalid Sevak ID (SID). Please check your personalized SID provided in your confirmation email.');
    }
  };

  const handleSendEmailNotification = (sevak) => {
    alert(`Automated email & SMS schedule summary dispatched to ${sevak.fullName} (SID: ${sevak.sid}).`);
  };

  const assignVolunteerToShift = (submissionId, shiftId) => {
    setShifts(prevShifts => 
      prevShifts.map(shift => {
        if (shift.id === shiftId && !shift.assignedVolunteers.includes(submissionId)) {
          return { ...shift, assignedVolunteers: [...shift.assignedVolunteers, submissionId] };
        }
        return shift;
      })
    );

    setSubmissions(prevSubs =>
      prevSubs.map(sub => {
        if (sub.id === submissionId && !sub.assignedShifts.includes(shiftId)) {
          return {
            ...sub,
            status: 'Assigned',
            assignedShifts: [...sub.assignedShifts, shiftId]
          };
        }
        return sub;
      })
    );
  };

  const unassignVolunteerFromShift = (submissionId, shiftId) => {
    setShifts(prevShifts =>
      prevShifts.map(shift => {
        if (shift.id === shiftId) {
          const updatedAssigned = shift.assignedVolunteers.filter(id => id !== submissionId);
          const updatedLead = shift.leadVolunteerId === submissionId ? null : shift.leadVolunteerId;
          return {
            ...shift,
            assignedVolunteers: updatedAssigned,
            leadVolunteerId: updatedLead
          };
        }
        return shift;
      })
    );

    setSubmissions(prevSubs =>
      prevSubs.map(sub => {
        if (sub.id === submissionId) {
          const updatedShifts = sub.assignedShifts.filter(id => id !== shiftId);
          return {
            ...sub,
            assignedShifts: updatedShifts,
            status: updatedShifts.length === 0 ? 'Pending' : 'Assigned'
          };
        }
        return sub;
      })
    );
  };

  const toggleLeadVolunteer = (shiftId, submissionId) => {
    setShifts(prevShifts =>
      prevShifts.map(shift => {
        if (shift.id === shiftId) {
          const newLead = shift.leadVolunteerId === submissionId ? null : submissionId;
          return { ...shift, leadVolunteerId: newLead };
        }
        return shift;
      })
    );
  };

  const handleDeleteVolunteer = (submissionId) => {
    if (confirm("Are you sure you want to permanently delete this volunteer record?")) {
      setShifts(prevShifts =>
        prevShifts.map(shift => ({
          ...shift,
          assignedVolunteers: shift.assignedVolunteers.filter(id => id !== submissionId),
          leadVolunteerId: shift.leadVolunteerId === submissionId ? null : shift.leadVolunteerId
        }))
      );
      setSubmissions(prevSubs => prevSubs.filter(sub => sub.id !== submissionId));
    }
  };

  const toggleUrgentFlag = (shiftId) => {
    setShifts(prevShifts =>
      prevShifts.map(s => s.id === shiftId ? { ...s, isUrgent: !s.isUrgent } : s)
    );
  };

  const handleSaveShiftEdit = (e) => {
    e.preventDefault();
    if (!editingShift) return;
    setShifts(prev => prev.map(s => s.id === editingShift.id ? editingShift : s));
    setEditingShift(null);
  };

  const departmentMetrics = useMemo(() => {
    return DEPARTMENTS.map(dept => {
      const deptShifts = shifts.filter(s => s.department === dept);
      const totalRequired = deptShifts.reduce((acc, s) => acc + s.requiredVolunteers, 0);
      const totalAssigned = deptShifts.reduce((acc, s) => acc + s.assignedVolunteers.length, 0);
      const percentage = totalRequired > 0 ? Math.round((totalAssigned / totalRequired) * 100) : 0;
      
      let rag = 'RED';
      if (percentage >= 85) rag = 'GREEN';
      else if (percentage >= 50) rag = 'AMBER';

      return {
        department: dept,
        totalRequired,
        totalAssigned,
        percentage,
        rag,
        shiftCount: deptShifts.length
      };
    });
  }, [shifts]);

  const totalCapacityStats = useMemo(() => {
    const totalReq = shifts.reduce((a, b) => a + b.requiredVolunteers, 0);
    const totalAssigned = shifts.reduce((a, b) => a + b.assignedVolunteers.length, 0);
    const pendingVolunteers = submissions.filter(s => s.status === 'Pending').length;
    const assignedVolunteersCount = submissions.filter(s => s.status === 'Assigned').length;

    return {
      totalReq,
      totalAssigned,
      gaps: Math.max(0, totalReq - totalAssigned),
      pendingVolunteers,
      assignedVolunteersCount,
      overallCoveragePct: totalReq > 0 ? Math.round((totalAssigned / totalReq) * 100) : 0
    };
  }, [shifts, submissions]);

  const filteredMasterShifts = useMemo(() => {
    return shifts.filter(s => {
      const matchesDept = selectedDeptFilter === 'ALL' || s.department === selectedDeptFilter;
      const matchesDay = selectedDayFilter === 'ALL' || s.day === selectedDayFilter;
      const matchesTime = selectedTimeFilter === 'ALL' || s.timeSlot === selectedTimeFilter;
      return matchesDept && matchesDay && matchesTime;
    });
  }, [shifts, selectedDeptFilter, selectedDayFilter, selectedTimeFilter]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      const matchesSearch = sub.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            sub.sid.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            sub.phone.includes(searchQuery) ||
                            sub.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMandal = mandalFilter === 'ALL' || sub.mandal === mandalFilter;
      const matchesStatus = statusFilter === 'ALL' || sub.status === statusFilter;
      return matchesSearch && matchesMandal && matchesStatus;
    });
  }, [submissions, searchQuery, mandalFilter, statusFilter]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-gradient-to-b from-amber-50/70 via-orange-50/40 to-amber-100/50 text-slate-800'} transition-colors duration-200 font-sans pb-20 sm:pb-8 relative overflow-x-hidden`}>
      
      <div className="fixed inset-0 pointer-events-none z-0 opacity-25 dark:opacity-15">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-amber-400 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-orange-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-red-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="fixed top-6 left-6 pointer-events-none z-0 text-amber-500/20 dark:text-amber-400/10 hidden lg:block">
        <RangoliArt className="w-48 h-48 animate-spin-slow" />
      </div>
      <div className="fixed bottom-6 right-6 pointer-events-none z-0 text-orange-500/20 dark:text-orange-400/10 hidden lg:block">
        <RangoliArt className="w-56 h-56" />
      </div>

      <header className={`border-b ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-amber-200'} sticky top-0 z-30 backdrop-blur-md shadow-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 rounded-2xl text-white shadow-lg shadow-orange-500/20 relative">
              <Flame className="w-6 h-6 animate-bounce" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-300 rounded-full border-2 border-white animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg lg:text-xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  BAPS Luton Diwali and Annakut 2026 Volunteer Management
                </h1>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Diwali, Setup & Annakut Rota System • BAPS Shri Swaminarayan Mandir, Luton
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleSyncMicrosoftForm}
              title="Sync with Microsoft Form Response Spreadsheet"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isSyncing 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'MS Form Sync'}</span>
            </button>

            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                isAdmin 
                  ? 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400' 
                  : 'bg-slate-100 border-slate-300 dark:bg-slate-800 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {isAdmin ? 'Admin View' : 'Sevak View'}
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative z-10">

        <div className="hidden sm:flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/80 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-1.5 bg-amber-100/60 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-amber-200/50 dark:border-slate-800">
            {/* 1) Sevak Portal */}
            <button
              onClick={() => setActiveTab('portal')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'portal' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              1) Sevak Portal
            </button>

            {/* 2) Volunteer form */}
            <button
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'form' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              2) Volunteer Form
            </button>

            {isAdmin && (
              <>
                {/* 3) Volunteer allocation */}
                <button
                  onClick={() => setActiveTab('allocation')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'allocation' 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md' 
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  3) Volunteer Allocation ({submissions.length})
                </button>

                {/* 4) Master Rota */}
                <button
                  onClick={() => setActiveTab('masterRota')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'masterRota' 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md' 
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  4) Master Rota
                </button>

                {/* 5) RAG Analytics & Calendar Gaps */}
                <button
                  onClick={() => setActiveTab('ragGaps')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'ragGaps' 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md' 
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  5) RAG Analytics & Calendar Gaps ({totalCapacityStats.gaps})
                </button>
              </>
            )}
          </div>
        </div>

        {/* TAB 1: SEVAK PORTAL (SID Login) */}
        {activeTab === 'portal' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {!loggedInSevak ? (
              <div className={`p-6 sm:p-10 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white/90 border-amber-200'} shadow-xl space-y-6 text-center relative overflow-hidden backdrop-blur-md`}>
                <div className="absolute top-4 right-4 pointer-events-none text-amber-500/10">
                  <RangoliArt className="w-28 h-28" />
                </div>

                <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30">
                  <KeyRound className="w-8 h-8" />
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Personal Sevak Schedule Portal
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                    Enter your personalized Sevak ID (SID) sent via your registration email to view your allocated seva duties for Diwali, Setup, and Annakut 2026.
                  </p>
                </div>

                <form onSubmit={handlePortalLogin} className="space-y-4 max-w-md mx-auto">
                  <div className="relative">
                    <KeyRound className="w-5 h-5 absolute left-4 top-3.5 text-amber-500" />
                    <input
                      type="text"
                      required
                      value={portalSidInput}
                      onChange={e => setPortalSidInput(e.target.value)}
                      placeholder="Enter Your SID (e.g., SID-1001)"
                      className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border text-xs sm:text-sm font-bold tracking-wider uppercase focus:ring-2 focus:ring-amber-500 outline-none transition-all ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-900'
                      }`}
                    />
                  </div>

                  {portalMessage && (
                    <p className="text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-800">
                      {portalMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Smartphone className="w-4 h-4" /> Access My Rota Schedule
                  </button>
                </form>

                <div className="pt-4 border-t border-amber-100 dark:border-slate-800 text-xs text-slate-400 space-y-2">
                  <p className="font-semibold text-slate-500 dark:text-slate-400">Demo Sevak SIDs for Testing:</p>
                  <div className="flex flex-wrap justify-center gap-2 font-mono text-[11px]">
                    <button onClick={() => setPortalSidInput('SID-1001')} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 font-bold">SID-1001 (Jay Patel)</button>
                    <button onClick={() => setPortalSidInput('SID-1002')} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 font-bold">SID-1002 (Priya Shah)</button>
                    <button onClick={() => setPortalSidInput('SID-1003')} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 font-bold">SID-1003 (Anil Kumar)</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Sevak Logged-in Header */}
                <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-xl space-y-4 relative overflow-hidden`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                          {loggedInSevak.mandal}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-orange-500 text-white shadow-sm">
                          {loggedInSevak.sid}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
                        Jay Swaminarayan, {loggedInSevak.fullName}!
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {loggedInSevak.phone} • {loggedInSevak.email || 'No email registered'}
                      </p>
                    </div>

                    <button
                      onClick={() => { setLoggedInSevak(null); setPortalSidInput(''); }}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Exit Portal
                    </button>
                  </div>

                  {/* Confirmed Rota Slots */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                      <span>Your Allocated Rota Slots ({loggedInSevak.assignedShifts.length})</span>
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" /> Confirmed
                      </span>
                    </h3>

                    {loggedInSevak.assignedShifts.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 text-center space-y-2">
                        <p className="font-bold">Your seva slots are currently being finalized by department leads.</p>
                        <p className="text-[11px] text-slate-500">Please check back shortly or contact your Mandal coordinator for updates.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {loggedInSevak.assignedShifts.map(shiftId => {
                          const shift = shifts.find(s => s.id === shiftId);
                          if (!shift) return null;
                          const isLead = shift.leadVolunteerId === loggedInSevak.id;
                          const deptContact = DEPARTMENT_LEADS[shift.department];
                          const dayObj = DAYS.find(d => d.id === shift.day);

                          return (
                            <div
                              key={shiftId}
                              className={`p-5 rounded-2xl border ${
                                isLead 
                                  ? 'bg-amber-500/10 border-amber-500/40' 
                                  : darkMode ? 'bg-slate-800 border-slate-700' : 'bg-amber-50/50 border-amber-200'
                              } space-y-3 relative`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                                  {shift.department}
                                </span>
                                {isLead && (
                                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-sm">
                                    <Crown className="w-3 h-3" /> Team Lead
                                  </span>
                                )}
                              </div>

                              <div className="text-base font-bold text-slate-900 dark:text-white">
                                {shift.title}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-amber-500" />
                                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                                    {dayObj ? `${dayObj.label} (${dayObj.date})` : shift.day}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-amber-500" />
                                  <span>{shift.timeSlot}</span>
                                </div>
                                <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
                                  <MapPin className="w-4 h-4 text-amber-500" />
                                  <span>{shift.location}</span>
                                </div>
                              </div>

                              {/* Department Lead Contact */}
                              {deptContact && (
                                <div className="pt-2 flex items-center justify-between text-xs bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-xl border border-amber-200/50 dark:border-slate-700/50">
                                  <div className="flex items-center gap-2">
                                    <User className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-slate-600 dark:text-slate-300">Dept Lead: <strong>{deptContact.lead}</strong></span>
                                  </div>
                                  <a
                                    href={`tel:${deptContact.phone.replace(/\s+/g, '')}`}
                                    className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 hover:underline"
                                  >
                                    <PhoneCall className="w-3 h-3" /> {deptContact.phone}
                                  </a>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSendEmailNotification(loggedInSevak)}
                      className="flex-1 py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" /> Email My Schedule
                    </button>
                  </div>
                </div>

                {/* Preferences Summary Card */}
                <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm space-y-4`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-500" />
                    Registered Preferences
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-1">Preferred Departments:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {loggedInSevak.preferredDepartments.map((dept, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                            {dept}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Diwali Day:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {loggedInSevak.availability.diwali?.join(', ') || 'None specified'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Mon Setup/Windup:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {loggedInSevak.availability.setup_windup?.join(', ') || 'None specified'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Annakut Day:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {loggedInSevak.availability.annakut?.join(', ') || 'None specified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VOLUNTEER FORM (Microsoft Form & Sync Setup) */}
        {activeTab === 'form' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className={`p-6 sm:p-8 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-xl space-y-6 backdrop-blur-md`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                    Microsoft Form & Response Sync
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Volunteers complete the official Microsoft Form. Responses with assigned SIDs sync into this management system.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Live Microsoft Form URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={msFormUrl}
                      onChange={e => setMsFormUrl(e.target.value)}
                      className={`flex-1 px-4 py-2.5 rounded-xl border text-xs font-mono outline-none ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
                      }`}
                    />
                    <a
                      href={msFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open Form
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                  <div className="font-bold flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-amber-600" />
                    Automated Background Response Sync Status
                  </div>
                  <div>Last Synced: <strong className="font-mono">{lastSynced}</strong></div>
                  <p className="text-[11px] text-slate-500">
                    Responses are automatically imported and assigned unique Sevak IDs (SIDs) for portal authentication.
                  </p>
                </div>

                <button
                  onClick={() => setShowImportModal(true)}
                  className="w-full py-3 px-4 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Download className="w-4 h-4" /> Import Excel Responses Data (JSON / CSV)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VOLUNTEER ALLOCATION (Allocation Roster & Sevak Management) */}
        {isAdmin && activeTab === 'allocation' && (
          <div className="space-y-6">
            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm flex flex-wrap items-center justify-between gap-3`}>
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, SID, phone, email..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
                    }`}
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
                  }`}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Pending">Pending Allocation Only</option>
                  <option value="Assigned">Assigned Only</option>
                </select>

                <select
                  value={mandalFilter}
                  onChange={e => setMandalFilter(e.target.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
                  }`}
                >
                  <option value="ALL">All Mandals</option>
                  {MANDALS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="text-xs font-semibold text-slate-500">
                {filteredSubmissions.length} Sevaks Listed
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSubmissions.map(sub => (
                <div
                  key={sub.id}
                  className={`p-5 rounded-3xl border ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'
                  } shadow-sm space-y-4 relative`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-orange-500 text-white">
                          {sub.sid}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {sub.fullName}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                        {sub.mandal} • {sub.phone}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        sub.assignedShifts.length > 0 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}>
                        {sub.assignedShifts.length > 0 ? `${sub.assignedShifts.length} Assigned` : 'Pending'}
                      </span>

                      <button
                        onClick={() => handleDeleteVolunteer(sub.id)}
                        title="Delete volunteer submission"
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Currently Allocated Shifts */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="block text-[11px] font-bold text-slate-500 uppercase">
                      Current Shift Allocations ({sub.assignedShifts.length})
                    </span>
                    {sub.assignedShifts.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No shifts allocated yet.</p>
                    ) : (
                      <div className="space-y-1">
                        {sub.assignedShifts.map(sId => {
                          const shift = shifts.find(s => s.id === sId);
                          if (!shift) return null;
                          const dayObj = DAYS.find(d => d.id === shift.day);
                          return (
                            <div key={sId} className="flex items-center justify-between p-2 rounded-xl bg-amber-50/60 dark:bg-slate-800 border border-amber-200/60 dark:border-slate-700 text-xs">
                              <div>
                                <strong className="text-slate-800 dark:text-slate-200">{shift.department}</strong>
                                <span className="text-slate-500 ml-1.5">
                                  ({dayObj?.label.split(' ')[0]} - {shift.timeSlot})
                                </span>
                              </div>
                              <button
                                onClick={() => unassignVolunteerFromShift(sub.id, shift.id)}
                                title="Remove shift allocation"
                                className="text-slate-400 hover:text-rose-500 p-1"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Add Shift Dropdown */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Allocate New Rota Shift
                    </label>
                    <select
                      onChange={e => {
                        if (e.target.value) {
                          assignVolunteerToShift(sub.id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-medium border outline-none ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
                      }`}
                    >
                      <option value="">-- Select Shift to Assign --</option>
                      {shifts.map(s => {
                        const dayObj = DAYS.find(d => d.id === s.day);
                        return (
                          <option key={s.id} value={s.id}>
                            {s.department} | {dayObj?.label.split(' ')[0]} | {s.timeSlot} ({s.assignedVolunteers.length}/{s.requiredVolunteers})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MASTER ROTA */}
        {isAdmin && activeTab === 'masterRota' && (
          <div className="space-y-6">
            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm flex flex-wrap items-center justify-between gap-3`}>
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Department Filter</label>
                  <select
                    value={selectedDeptFilter}
                    onChange={e => setSelectedDeptFilter(e.target.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
                    }`}
                  >
                    <option value="ALL">All Departments ({DEPARTMENTS.length})</option>
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Day Selection</label>
                  <select
                    value={selectedDayFilter}
                    onChange={e => setSelectedDayFilter(e.target.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
                    }`}
                  >
                    <option value="ALL">All 3 Days</option>
                    {DAYS.map(d => (
                      <option key={d.id} value={d.id}>{d.label} ({d.date})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Time Slot Filter</label>
                  <select
                    value={selectedTimeFilter}
                    onChange={e => setSelectedTimeFilter(e.target.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
                    }`}
                  >
                    <option value="ALL">All Time Slots</option>
                    {TIME_SLOTS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-500">
                Showing {filteredMasterShifts.length} Master Rota Shift Cards
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMasterShifts.map(shift => {
                const isFull = shift.assignedVolunteers.length >= shift.requiredVolunteers;
                const dayObj = DAYS.find(d => d.id === shift.day);

                return (
                  <div
                    key={shift.id}
                    className={`p-5 rounded-3xl border transition-all ${
                      shift.isUrgent 
                        ? 'border-rose-500/50 bg-rose-500/5' 
                        : darkMode 
                          ? 'bg-slate-900 border-slate-800' 
                          : 'bg-white border-amber-200'
                    } shadow-sm space-y-4 relative`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                          {shift.department}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                          {shift.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingShift(shift)}
                          title="Edit Rota Details"
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => toggleUrgentFlag(shift.id)}
                          title="Toggle Urgent Flag"
                          className={`p-1.5 rounded-lg transition-all ${
                            shift.isUrgent ? 'text-rose-600 bg-rose-500/10' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          <AlertCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {dayObj ? `${dayObj.label} (${dayObj.date})` : shift.day}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>{shift.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        <span>{shift.location}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          Assigned Sevaks ({shift.assignedVolunteers.length}/{shift.requiredVolunteers})
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isFull 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}>
                          {isFull ? 'Filled' : `${shift.requiredVolunteers - shift.assignedVolunteers.length} needed`}
                        </span>
                      </div>

                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {shift.assignedVolunteers.length === 0 ? (
                          <p className="text-[11px] text-slate-400 italic">No sevaks assigned yet.</p>
                        ) : (
                          shift.assignedVolunteers.map(subId => {
                            const sub = submissions.find(s => s.id === subId);
                            if (!sub) return null;
                            const isLead = shift.leadVolunteerId === sub.id;

                            return (
                              <div
                                key={subId}
                                className={`flex items-center justify-between p-2 rounded-xl text-xs border ${
                                  isLead 
                                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200' 
                                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                <div className="flex items-center gap-1.5 truncate">
                                  <button
                                    onClick={() => toggleLeadVolunteer(shift.id, sub.id)}
                                    title={isLead ? 'Remove Lead status' : 'Designate as Team Lead'}
                                    className={`p-1 rounded-md transition-all ${
                                      isLead ? 'bg-amber-500 text-white' : 'text-slate-300 hover:text-amber-500'
                                    }`}
                                  >
                                    <Crown className="w-3 h-3" />
                                  </button>
                                  <span className="font-medium truncate">
                                    {sub.fullName} <span className="text-[10px] opacity-60">({sub.sid})</span>
                                  </span>
                                </div>

                                <button
                                  onClick={() => unassignVolunteerFromShift(sub.id, shift.id)}
                                  className="text-slate-400 hover:text-rose-500 transition-all p-1"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: COMBINED RAG ANALYTICS & CALENDAR GAPS */}
        {isAdmin && activeTab === 'ragGaps' && (
          <div className="space-y-6">
            {/* Executive Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm space-y-1`}>
                <div className="text-[10px] font-bold uppercase text-slate-400">Total Shifts Needed</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{totalCapacityStats.totalReq}</div>
                <div className="text-[11px] text-slate-500">Across 3 event days</div>
              </div>

              <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm space-y-1`}>
                <div className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Allocated Shifts</div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{totalCapacityStats.totalAssigned}</div>
                <div className="text-[11px] text-slate-500">{totalCapacityStats.overallCoveragePct}% Overall Coverage</div>
              </div>

              <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm space-y-1`}>
                <div className="text-[10px] font-bold uppercase text-rose-500">Unfilled Gaps</div>
                <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{totalCapacityStats.gaps}</div>
                <div className="text-[11px] text-rose-500 font-semibold">Action required</div>
              </div>

              <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm space-y-1`}>
                <div className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">Registered Sevaks</div>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{submissions.length}</div>
                <div className="text-[11px] text-slate-500">{totalCapacityStats.pendingVolunteers} unassigned</div>
              </div>
            </div>

            {/* Department RAG Status Breakdown Matrix */}
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm space-y-6`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    Department RAG Allocation Matrix
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Red (&lt;50%), Amber (50-84%), Green (85%+) total capacity status
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="flex items-center gap-1 text-emerald-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Green (OK)</span>
                  <span className="flex items-center gap-1 text-amber-600"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Amber (Moderate)</span>
                  <span className="flex items-center gap-1 text-rose-600"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Red (Critical)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {departmentMetrics.map(item => (
                  <div key={item.department} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {item.department}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-medium">
                          {item.totalAssigned} / {item.totalRequired} Sevaks
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                          item.rag === 'GREEN' 
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                            : item.rag === 'AMBER'
                            ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                        }`}>
                          {item.percentage}%
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${
                          item.rag === 'GREEN' 
                            ? 'bg-emerald-500' 
                            : item.rag === 'AMBER'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, item.percentage)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Calendar Matrix Gaps Table */}
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm space-y-4`}>
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Grid className="w-5 h-5 text-amber-500" />
                  Interactive Calendar Time-Slot Gap Matrix
                </h3>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={ragGapDayFilter}
                    onChange={e => setRagGapDayFilter(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
                    }`}
                  >
                    {DAYS.map(d => (
                      <option key={d.id} value={d.id}>{d.label} ({d.date})</option>
                    ))}
                  </select>

                  <select
                    value={ragGapDeptFilter}
                    onChange={e => setRagGapDeptFilter(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
                    }`}
                  >
                    <option value="ALL">All Departments</option>
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Department</th>
                      {TIME_SLOTS.map(slot => (
                        <th key={slot} className="py-3 px-4 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase text-center">
                          {slot}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {DEPARTMENTS
                      .filter(d => ragGapDeptFilter === 'ALL' || d === ragGapDeptFilter)
                      .map(dept => (
                        <tr key={dept} className="hover:bg-amber-50/20 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-4 text-xs font-bold text-slate-800 dark:text-slate-200">
                            {dept}
                          </td>
                          {TIME_SLOTS.map(slot => {
                            const matchingShift = shifts.find(s => 
                              s.department === dept && 
                              s.day === ragGapDayFilter && 
                              s.timeSlot === slot
                            );

                            if (!matchingShift) return <td key={slot} className="py-3 px-4 text-center text-slate-300">-</td>;

                            const gaps = matchingShift.requiredVolunteers - matchingShift.assignedVolunteers.length;
                            const hasGap = gaps > 0;

                            return (
                              <td key={slot} className="py-3 px-4 text-center">
                                <button
                                  onClick={() => setEditingShift(matchingShift)}
                                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                                    hasGap 
                                      ? matchingShift.isUrgent
                                        ? 'bg-rose-500 text-white border-rose-600 shadow-md animate-pulse'
                                        : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
                                      : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                                  }`}
                                >
                                  {hasGap ? `${gaps} Needed` : 'Full'}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 border-t border-amber-200 dark:border-slate-800 backdrop-blur-md z-40 px-2 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('portal')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === 'portal' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'
          }`}
        >
          <Smartphone className="w-5 h-5" /> Portal
        </button>

        <button
          onClick={() => setActiveTab('form')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === 'form' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'
          }`}
        >
          <FileSpreadsheet className="w-5 h-5" /> Form
        </button>

        {isAdmin && (
          <>
            <button
              onClick={() => setActiveTab('allocation')}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                activeTab === 'allocation' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'
              }`}
            >
              <Users className="w-5 h-5" /> Allocation
            </button>

            <button
              onClick={() => setActiveTab('masterRota')}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                activeTab === 'masterRota' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'
              }`}
            >
              <Calendar className="w-5 h-5" /> Rota
            </button>

            <button
              onClick={() => setActiveTab('ragGaps')}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                activeTab === 'ragGaps' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'
              }`}
            >
              <BarChart3 className="w-5 h-5" /> RAG / Gaps
            </button>
          </>
        )}
      </div>

      {}
      {editingShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-amber-200 text-slate-800'} shadow-2xl space-y-4`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-500" />
                Edit Shift Capacity & Details
              </h3>
              <button onClick={() => setEditingShift(null)} className="p-1 rounded-lg text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveShiftEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Shift Title</label>
                <input
                  type="text"
                  value={editingShift.title}
                  onChange={e => setEditingShift({ ...editingShift, title: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-medium border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Required Sevaks Count</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={editingShift.requiredVolunteers}
                  onChange={e => setEditingShift({ ...editingShift, requiredVolunteers: parseInt(e.target.value) || 1 })}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-medium border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="urgentFlag"
                  checked={editingShift.isUrgent}
                  onChange={e => setEditingShift({ ...editingShift, isUrgent: e.target.checked })}
                  className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                />
                <label htmlFor="urgentFlag" className="text-xs font-bold text-rose-600">
                  Mark as URGENT Need
                </label>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingShift(null)}
                  className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-amber-200 text-slate-800'} shadow-2xl space-y-4`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold">Import Microsoft Form Responses (JSON / Excel)</h3>
              <button onClick={() => setShowImportModal(false)} className="p-1 rounded-lg text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              rows={6}
              value={importJsonText}
              onChange={e => setImportJsonText(e.target.value)}
              placeholder='Paste JSON array exported from Microsoft Excel Online... e.g. [{"sid":"SID-1005","fullName":"Ramesh Shah","phone":"07111222333"}]'
              className={`w-full p-3 rounded-xl text-xs font-mono border outline-none ${
                darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
              }`}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-600 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleImportCSVData}
                className="px-4 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl shadow-md"
              >
                Import Responses
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}