import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Calendar, 
  AlertCircle, 
  Search, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Edit3, 
  Flame, 
  Sun, 
  Moon, 
  Trash2, 
  X,
  Crown,
  FileSpreadsheet,
  RefreshCw,
  ExternalLink,
  Mail,
  BarChart3,
  User,
  Download,
  PhoneCall,
  Info,
  LogOut,
  KeyRound,
  Grid,
  TrendingUp,
  ShieldAlert,
  ChevronRight,
  Sparkles
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

// Admin SIDs with management privilege
const ADMIN_SIDS = ['SID-1001', 'SID-ADMIN'];

const DEPARTMENT_LEADS = {
  "Annakut Setup/Windup": { lead: "Reena Patel", phone: "07700 900111" },
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

  // Initial sample assignments
  shifts[0].assignedVolunteers = ['sub-1', 'sub-2'];
  shifts[0].leadVolunteerId = 'sub-1';
  shifts[1].assignedVolunteers = ['sub-3'];
  shifts[15].assignedVolunteers = ['sub-2'];
  shifts[30].assignedVolunteers = ['sub-4'];

  return shifts;
};

const initialSubmissions = [
  {
    id: 'sub-1',
    sid: 'SID-1001',
    fullName: 'Jay Patel (Admin)',
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
  const [activeTab, setActiveTab] = useState('portal'); // Default tab is Sevak Portal
  const [darkMode, setDarkMode] = useState(false);

  // Rota & Sevaks state
  const [shifts, setShifts] = useState(generateInitialShifts);
  const [submissions, setSubmissions] = useState(initialSubmissions);

  // Sync / Microsoft Form state
  const [msFormUrl, setMsFormUrl] = useState('https://forms.office.com/r/BAPS-Luton-Diwali-2026');
  const [lastSynced, setLastSynced] = useState(new Date().toLocaleTimeString());
  const [isSyncing, setIsSyncing] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  // Sevak Portal Authentication State
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

  // RAG & Calendar Gaps filters
  const [ragGapDeptFilter, setRagGapDeptFilter] = useState('ALL');
  const [ragGapDayFilter, setRagGapDayFilter] = useState('diwali');

  // Modal Editing State
  const [editingShift, setEditingShift] = useState(null);

  // Computed property to check if current logged-in user is an Admin
  const isAdminLoggedIn = useMemo(() => {
    if (!loggedInSevak) return false;
    return ADMIN_SIDS.includes(loggedInSevak.sid.toUpperCase());
  }, [loggedInSevak]);

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
      }
    } catch (e) {
      alert('Invalid JSON format. Please paste a valid JSON array.');
    }
  };

  const handlePortalLogin = (e) => {
    e.preventDefault();
    const cleanSid = portalSidInput.trim().toUpperCase();
    const found = submissions.find(s => s.sid.toUpperCase() === cleanSid);

    if (found) {
      setLoggedInSevak(found);
      setPortalMessage('');
      setActiveTab('portal');
    } else {
      setPortalMessage('Invalid Sevak ID (SID). Please check your personalized SID provided in your email.');
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

  const handleDeleteShiftFromMasterRota = (shiftId) => {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return;

    if (confirm(`Are you sure you want to completely remove "${shift.title}" from the Master Rota?`)) {
      // Unassign all volunteers from this shift
      setSubmissions(prev => 
        prev.map(sub => ({
          ...sub,
          assignedShifts: sub.assignedShifts.filter(id => id !== shiftId),
          status: sub.assignedShifts.filter(id => id !== shiftId).length === 0 ? 'Pending' : sub.status
        }))
      );

      // Remove shift from shifts array
      setShifts(prev => prev.filter(s => s.id !== shiftId));
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
      
      {/* Background Decorative Rings */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-25 dark:opacity-15">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-amber-400 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-orange-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-red-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="fixed top-6 left-6 pointer-events-none z-0 text-amber-500/20 dark:text-amber-400/10 hidden lg:block">
        <RangoliArt className="w-48 h-48 animate-spin-slow" />
      </div>

      {/* Header */}
      <header className={`border-b ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-amber-200'} sticky top-0 z-30 backdrop-blur-md shadow-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 rounded-2xl text-white shadow-lg shadow-orange-500/20 relative">
              <Flame className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base lg:text-xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                BAPS Luton Diwali & Annakut 2026
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                Sevak Management Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <button
                onClick={handleSyncMicrosoftForm}
                title="Sync Microsoft Form"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  isSyncing 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Sync Responses</span>
              </button>
            )}

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

        {/* Dynamic Navigation Bar: Shows Admin Options only if an Admin SID is logged in */}
        {loggedInSevak && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/80 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-1.5 bg-amber-100/60 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-amber-200/50 dark:border-slate-800 overflow-x-auto w-full sm:w-auto">
              {/* Sevak Portal (Available for all logged in users) */}
              <button
                onClick={() => setActiveTab('portal')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                  activeTab === 'portal' 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                Sevak Rota Schedule
              </button>

              {/* Admin Tabs - ONLY visible to ADMIN SIDs */}
              {isAdminLoggedIn && (
                <>
                  <button
                    onClick={() => setActiveTab('form')}
                    className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                      activeTab === 'form' 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md' 
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Volunteer Form
                  </button>

                  <button
                    onClick={() => setActiveTab('allocation')}
                    className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                      activeTab === 'allocation' 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md' 
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Volunteer Allocation
                  </button>

                  <button
                    onClick={() => setActiveTab('masterRota')}
                    className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                      activeTab === 'masterRota' 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md' 
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    Master Rota
                  </button>

                  <button
                    onClick={() => setActiveTab('ragGaps')}
                    className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                      activeTab === 'ragGaps' 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md' 
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    RAG & Gaps
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* SECTION 1: SEVAK PORTAL (Default Link Landing View for Everyone) */}
        {activeTab === 'portal' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {!loggedInSevak ? (
              <div className={`p-6 sm:p-10 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white/90 border-amber-200'} shadow-xl space-y-6 text-center relative overflow-hidden backdrop-blur-md`}>
                <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30">
                  <KeyRound className="w-8 h-8" />
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Personal Sevak Schedule Portal
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                    Please enter your unique Sevak ID (SID) to view your individual Diwali & Annakut seva duties.
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
                      placeholder="Enter Your SID (e.g. SID-1001)"
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
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    View My Rota Schedule
                  </button>
                </form>

                <div className="pt-4 border-t border-amber-100 dark:border-slate-800 text-xs text-slate-400 space-y-2">
                  <p className="font-semibold text-slate-500">Quick Test SIDs:</p>
                  <div className="flex flex-wrap justify-center gap-2 font-mono text-[11px]">
                    <button onClick={() => setPortalSidInput('SID-1001')} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                      SID-1001 (Admin Access)
                    </button>
                    <button onClick={() => setPortalSidInput('SID-1002')} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-bold">
                      SID-1002 (Regular Sevak)
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Sevak Logged-in Header */}
                <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-xl space-y-4`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                          {loggedInSevak.mandal}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-orange-500 text-white shadow-sm">
                          {loggedInSevak.sid}
                        </span>
                        {isAdminLoggedIn && (
                          <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                            <Crown className="w-3 h-3" /> Admin Authorized
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
                        Jay Swaminarayan, {loggedInSevak.fullName}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {loggedInSevak.phone} • {loggedInSevak.email || 'No email registered'}
                      </p>
                    </div>

                    <button
                      onClick={() => { setLoggedInSevak(null); setPortalSidInput(''); setActiveTab('portal'); }}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </div>

                  {/* Confirmed Duty Rota Slots */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                      <span>Allocated Duties ({loggedInSevak.assignedShifts.length})</span>
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" /> Confirmed Rota
                      </span>
                    </h3>

                    {loggedInSevak.assignedShifts.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 text-center space-y-2">
                        <p className="font-bold">Your seva duties are currently being prepared.</p>
                        <p className="text-[11px] text-slate-500">Please check back shortly or speak with your Mandal coordinator.</p>
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
                              className={`p-4 sm:p-5 rounded-2xl border ${
                                isLead 
                                  ? 'bg-amber-500/10 border-amber-500/40' 
                                  : darkMode ? 'bg-slate-800 border-slate-700' : 'bg-amber-50/50 border-amber-200'
                              } space-y-3`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                                  {shift.department}
                                </span>
                                {isLead && (
                                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                                    <Crown className="w-3 h-3" /> Team Lead
                                  </span>
                                )}
                              </div>

                              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
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
                              </div>

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

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleSendEmailNotification(loggedInSevak)}
                      className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" /> Email My Schedule
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: VOLUNTEER FORM (Inside Admin) */}
        {isAdminLoggedIn && activeTab === 'form' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-xl space-y-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    Microsoft Form Integration & Sync
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage responses submitted via the official Microsoft Form link.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Live Form URL
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
                      className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open Form
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
                  <div className="font-bold flex items-center gap-2 text-amber-900 dark:text-amber-200">
                    <RefreshCw className="w-4 h-4 text-amber-600" /> Sync Status
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">Last Synced: <strong className="font-mono">{lastSynced}</strong></div>
                </div>

                <button
                  onClick={() => setShowImportModal(true)}
                  className="w-full py-3 px-4 bg-slate-800 text-white text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Download className="w-4 h-4" /> Import Excel Response Data (JSON)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: VOLUNTEER ALLOCATION (Enhanced Phone View) */}
        {}
        {isAdminLoggedIn && activeTab === 'allocation' && (
          <div className="space-y-6">
            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3`}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, SID, phone..."
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
                  <option value="Pending">Pending Only</option>
                  <option value="Assigned">Assigned Only</option>
                </select>
              </div>

              <div className="text-xs font-bold text-slate-500 self-end sm:self-center">
                {filteredSubmissions.length} Volunteers
              </div>
            </div>

            {/* Mobile-Optimized Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSubmissions.map(sub => (
                <div
                  key={sub.id}
                  className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'
                  } shadow-sm space-y-3 relative`}
                >
                  {/* Top Bar - Clear Mobile Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-orange-500 text-white tracking-wider">
                          {sub.sid}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          sub.assignedShifts.length > 0 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        }`}>
                          {sub.assignedShifts.length > 0 ? `${sub.assignedShifts.length} Shifted` : 'Pending'}
                        </span>
                      </div>

                      {/* Prominent Clear Name for Mobile */}
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                        {sub.fullName}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-2">
                        <span>{sub.phone}</span>
                        <span>•</span>
                        <span className="truncate max-w-[150px]">{sub.mandal}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteVolunteer(sub.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Allocated Shifts List */}
                  <div className="space-y-1.5">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Current Allocations ({sub.assignedShifts.length})
                    </span>
                    {sub.assignedShifts.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No shifts allocated.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {sub.assignedShifts.map(sId => {
                          const shift = shifts.find(s => s.id === sId);
                          if (!shift) return null;
                          const dayObj = DAYS.find(d => d.id === shift.day);
                          return (
                            <div key={sId} className="flex items-center justify-between p-2 rounded-xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs">
                              <div className="truncate pr-2">
                                <strong className="text-slate-900 dark:text-slate-100 block truncate">{shift.department}</strong>
                                <span className="text-[11px] text-slate-500 font-medium">
                                  {dayObj?.label.split(' ')[0]} ({shift.timeSlot})
                                </span>
                              </div>
                              <button
                                onClick={() => unassignVolunteerFromShift(sub.id, shift.id)}
                                className="text-slate-400 hover:text-rose-500 p-1 rounded-lg"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Add Shift Dropdown */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      + Allocate New Rota Duty
                    </label>
                    <select
                      onChange={e => {
                        if (e.target.value) {
                          assignVolunteerToShift(sub.id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold border outline-none ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
                      }`}
                    >
                      <option value="">-- Select Shift to Assign --</option>
                      {shifts.map(s => {
                        const dayObj = DAYS.find(d => d.id === s.day);
                        return (
                          <option key={s.id} value={s.id}>
                            {s.department} | {dayObj?.label.split(' ')[0]} | {s.timeSlot}
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

        {/* SECTION 4: MASTER ROTA (With Individual Shift Deletion) */}
        {}
        {isAdminLoggedIn && activeTab === 'masterRota' && (
          <div className="space-y-6">
            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm flex flex-wrap items-center justify-between gap-3`}>
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
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

                <select
                  value={selectedDayFilter}
                  onChange={e => setSelectedDayFilter(e.target.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
                  }`}
                >
                  <option value="ALL">All Days</option>
                  {DAYS.map(d => (
                    <option key={d.id} value={d.id}>{d.label}</option>
                  ))}
                </select>
              </div>

              <div className="text-xs font-semibold text-slate-500">
                {filteredMasterShifts.length} Active Shift Cards
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
                          title="Edit Shift Capacity"
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete Individual Shift Button */}
                        <button
                          onClick={() => handleDeleteShiftFromMasterRota(shift.id)}
                          title="Delete Shift Completely from Master Rota"
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {dayObj ? dayObj.label : shift.day}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>{shift.timeSlot}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          Assigned ({shift.assignedVolunteers.length}/{shift.requiredVolunteers})
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
                          <p className="text-[11px] text-slate-400 italic">No volunteers assigned.</p>
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
                                    title="Toggle Team Lead"
                                    className={`p-1 rounded-md ${
                                      isLead ? 'bg-amber-500 text-white' : 'text-slate-300 hover:text-amber-500'
                                    }`}
                                  >
                                    <Crown className="w-3 h-3" />
                                  </button>
                                  <span className="font-medium truncate">{sub.fullName}</span>
                                </div>

                                <button
                                  onClick={() => unassignVolunteerFromShift(sub.id, shift.id)}
                                  className="text-slate-400 hover:text-rose-500 p-1"
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

        {/* SECTION 5: RAG ANALYTICS & CALENDAR GAPS */}
        {isAdminLoggedIn && activeTab === 'ragGaps' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm space-y-1`}>
                <div className="text-[10px] font-bold uppercase text-slate-400">Total Shifts Needed</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{totalCapacityStats.totalReq}</div>
              </div>

              <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm space-y-1`}>
                <div className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Allocated Shifts</div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{totalCapacityStats.totalAssigned}</div>
              </div>

              <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm space-y-1`}>
                <div className="text-[10px] font-bold uppercase text-rose-500">Unfilled Gaps</div>
                <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{totalCapacityStats.gaps}</div>
              </div>

              <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm space-y-1`}>
                <div className="text-[10px] font-bold uppercase text-amber-600">Total Sevaks</div>
                <div className="text-2xl font-black text-amber-600">{submissions.length}</div>
              </div>
            </div>

            {/* Department RAG Breakdown */}
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm space-y-6`}>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500" /> Department Capacity Matrix
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {departmentMetrics.map(item => (
                  <div key={item.department} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{item.department}</span>
                      <span className="text-slate-500 font-medium">{item.totalAssigned} / {item.totalRequired}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className={`h-full ${item.rag === 'GREEN' ? 'bg-emerald-500' : item.rag === 'AMBER' ? 'bg-amber-500' : 'bg-rose-500'}`}
                        style={{ width: `${Math.min(100, item.percentage)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Edit Shift Modal */}
      {editingShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-amber-200 text-slate-800'} shadow-2xl space-y-4`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold">Edit Shift Capacity</h3>
              <button onClick={() => setEditingShift(null)} className="p-1 text-slate-400">
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
                  className="w-full px-3 py-2 rounded-xl text-xs font-medium border"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Required Volunteers</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={editingShift.requiredVolunteers}
                  onChange={e => setEditingShift({ ...editingShift, requiredVolunteers: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 rounded-xl text-xs font-medium border"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingShift(null)}
                  className="px-4 py-2 text-xs font-bold bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-amber-500 text-white rounded-xl"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JSON Data Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-amber-200 text-slate-800'} shadow-2xl space-y-4`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold">Import Responses (JSON)</h3>
              <button onClick={() => setShowImportModal(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              rows={6}
              value={importJsonText}
              onChange={e => setImportJsonText(e.target.value)}
              placeholder='Paste JSON array here...'
              className="w-full p-3 rounded-xl text-xs font-mono border outline-none"
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
                className="px-4 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
