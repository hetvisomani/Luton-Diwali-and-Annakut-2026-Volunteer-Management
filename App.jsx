import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  addDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { 
  Calendar, Clock, MapPin, Users, Plus, CheckCircle, 
  XCircle, Filter, Shield, UserCheck, AlertTriangle, 
  Search, Sun, Moon, ChevronLeft, ChevronRight, User, 
  Settings, RefreshCw, Zap, Phone, Mail, Award, Check, Sparkles,
  ClipboardList, Wand2, AlertCircle, ArrowRight, Layers, FileSpreadsheet, CheckSquare
} from 'lucide-react';

// --- Firebase Configuration & Initialization ---
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : {
      apiKey: "demo-api-key",
      authDomain: "demo-project.firebaseapp.com",
      projectId: "demo-project",
      storageBucket: "demo-project.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:demo"
    };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'diwali-mandir-seva-app';

// Diwali Mandir Seva Departments
const SHIFT_ROLES = [
  'No preference',
  'Annakut setup/windup',
  'AV',
  'Catering /food stalls'/  'Shoe Stall / Footwear',
  'Traffic & Parking',
  'VIP & Reception',
  'Crowd Management & Security',
  'Cleanup & Maintenance'
];

// 2 Key Festival Days
const FESTIVAL_DAYS = [
  { key: '2026-11-08', label: 'Diwali Day (Day 1)', dateStr: 'Sun, Nov 8' },
  { key: '2026-11-09', label: 'Hindu New Year / Annakut (Day 2)', dateStr: 'Mon, Nov 9' }
];

const TIME_SLOTS = [
  '07:00 - 10:00',
  '10:00 - 13:00',
  '13:00 - 16:00',
  '16:00 - 19:00',
  '19:00 - 22:00'
];

// Seed Data for initial shifts
const SEED_SHIFTS = [
  {
    title: 'Annakut Display & Prasadam Setup',
    role: 'Prashad & Annakut',
    date: '2026-11-08',
    startTime: '07:00',
    endTime: '10:00',
    location: 'Main Shrine Hall',
    capacity: 12,
    status: 'Open',
    urgent: true,
    notes: 'Help arrange food offerings and pack mahaprasad boxes.',
    assignedVolunteers: [],
    checkedInVolunteers: []
  },
  {
    title: 'Diwali Evening Shoe Counter',
    role: 'Shoe Stall / Footwear',
    date: '2026-11-08',
    startTime: '16:00',
    endTime: '19:00',
    location: 'Outer Courtyard Counters',
    capacity: 15,
    status: 'Open',
    urgent: true,
    notes: 'Footwear organizing during peak evening crowd.',
    assignedVolunteers: [],
    checkedInVolunteers: []
  },
  {
    title: 'Diya Lighting & Decoration',
    role: 'Diya & Decoration',
    date: '2026-11-08',
    startTime: '13:00',
    endTime: '16:00',
    location: 'Temple Gardens & Walkway',
    capacity: 10,
    status: 'Open',
    urgent: false,
    notes: 'Oil filling and diya placement along main pathways.',
    assignedVolunteers: [],
    checkedInVolunteers: []
  },
  {
    title: 'Traffic & Parking Control - Peak',
    role: 'Traffic & Parking',
    date: '2026-11-08',
    startTime: '16:00',
    endTime: '19:00',
    location: 'Main Parking Lot',
    capacity: 12,
    status: 'Open',
    urgent: true,
    notes: 'Direct incoming vehicles safely into parking bays.',
    assignedVolunteers: [],
    checkedInVolunteers: []
  },
  {
    title: 'Annakut Grand Darshan Crowd Control',
    role: 'Crowd Management & Security',
    date: '2026-11-09',
    startTime: '10:00',
    endTime: '13:00',
    location: 'Main Prayer Hall Queue',
    capacity: 15,
    status: 'Open',
    urgent: true,
    notes: 'Manage queues and assist elderly visitors.',
    assignedVolunteers: [],
    checkedInVolunteers: []
  },
  {
    title: 'Kitchen Mahaprasad Preparation',
    role: 'Kitchen & Catering',
    date: '2026-11-09',
    startTime: '07:00',
    endTime: '10:00',
    location: 'Mandir Community Kitchen',
    capacity: 10,
    status: 'Open',
    urgent: false,
    notes: 'Food packing and serving support for New Year feast.',
    assignedVolunteers: [],
    checkedInVolunteers: []
  }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(true);
  const [activeTab, setActiveTab] = useState('manager'); // 'availabilityForm', 'manager', 'roster', 'gaps'
  const [darkMode, setDarkMode] = useState(false);

  // Firestore Data State
  const [shifts, setShifts] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Submission State (For Volunteers)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    preferences: [SHIFT_ROLES[0], SHIFT_ROLES[1]],
    availability: {
      '2026-11-08': ['16:00 - 19:00'],
      '2026-11-09': ['10:00 - 13:00']
    },
    notes: ''
  });

  // Filters & UI State
  const [filterRole, setFilterRole] = useState('All');
  const [filterDate, setFilterDate] = useState('2026-11-08');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);
  const [selectedShiftForDetails, setSelectedShiftForDetails] = useState(null);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState(null);

  const showToast = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth error:", err);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsubscribe();
  }, []);

  // Sync Shifts and Volunteer Submissions
  useEffect(() => {
    if (!user) return;

    const shiftsCol = collection(db, 'artifacts', appId, 'public', 'data', 'shifts');
    const submissionsCol = collection(db, 'artifacts', appId, 'public', 'data', 'submissions');

    const unsubShifts = onSnapshot(shiftsCol, (snapshot) => {
      const shiftList = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      if (shiftList.length === 0 && !snapshot.metadata.fromCache) {
        seedShiftsData();
      } else {
        setShifts(shiftList);
      }
      setLoading(false);
    });

    const unsubSubmissions = onSnapshot(submissionsCol, (snapshot) => {
      const subList = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      setSubmissions(subList);
    });

    return () => {
      unsubShifts();
      unsubSubmissions();
    };
  }, [user]);

  const seedShiftsData = async () => {
    try {
      const shiftsCol = collection(db, 'artifacts', appId, 'public', 'data', 'shifts');
      for (const s of SEED_SHIFTS) {
        await addDoc(shiftsCol, s);
      }
      showToast("Initial Diwali Seva shifts created!", "success");
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitAvailability = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast("Please enter your name and phone number.", "warning");
      return;
    }

    try {
      const subCol = collection(db, 'artifacts', appId, 'public', 'data', 'submissions');
      await addDoc(subCol, {
        ...formData,
        submittedAt: new Date().toISOString(),
        assignedShifts: []
      });
      showToast("Availability submitted! The Seva Team will assign your rota shifts soon.", "success");
      setFormData({
        name: '',
        phone: '',
        email: '',
        preferences: [SHIFT_ROLES[0]],
        availability: {},
        notes: ''
      });
      setActiveTab('manager');
    } catch (err) {
      console.error(err);
      showToast("Submission failed. Please try again.", "error");
    }
  };

  const handleAssignVolunteerToShift = async (submission, shift) => {
    if (!shift || !submission) return;

    const assigned = shift.assignedVolunteers || [];
    if (assigned.some(v => v.submissionId === submission.id)) {
      showToast(`${submission.name} is already assigned to this shift!`, "warning");
      return;
    }

    if (assigned.length >= shift.capacity) {
      showToast("Shift is at full capacity!", "warning");
      return;
    }

    try {
      const shiftRef = doc(db, 'artifacts', appId, 'public', 'data', 'shifts', shift.id);
      const updatedAssigned = [
        ...assigned, 
        {
          submissionId: submission.id,
          name: submission.name,
          phone: submission.phone,
          email: submission.email
        }
      ];

      await updateDoc(shiftRef, {
        assignedVolunteers: updatedAssigned,
        status: updatedAssigned.length >= shift.capacity ? 'Filled' : 'Open'
      });

      // Update submission record
      const subRef = doc(db, 'artifacts', appId, 'public', 'data', 'submissions', submission.id);
      const currentAssignedShifts = submission.assignedShifts || [];
      await updateDoc(subRef, {
        assignedShifts: [...currentAssignedShifts, { shiftId: shift.id, title: shift.title, role: shift.role, time: `${shift.startTime}-${shift.endTime}` }]
      });

      showToast(`Assigned ${submission.name} to ${shift.title}!`, "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to assign volunteer.", "error");
    }
  };

  const handleRemoveVolunteerFromShift = async (shiftId, submissionId) => {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return;

    try {
      const updatedAssigned = (shift.assignedVolunteers || []).filter(v => v.submissionId !== submissionId);
      const shiftRef = doc(db, 'artifacts', appId, 'public', 'data', 'shifts', shiftId);
      await updateDoc(shiftRef, {
        assignedVolunteers: updatedAssigned,
        status: updatedAssigned.length >= shift.capacity ? 'Filled' : 'Open'
      });

      if (submissionId) {
        const sub = submissions.find(s => s.id === submissionId);
        if (sub) {
          const updatedShifts = (sub.assignedShifts || []).filter(s => s.shiftId !== shiftId);
          await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'submissions', submissionId), {
            assignedShifts: updatedShifts
          });
        }
      }

      showToast("Volunteer removed from shift.", "info");
    } catch (err) {
      console.error(err);
      showToast("Could not remove volunteer.", "error");
    }
  };

  const handleRunAutoMatch = async () => {
    let matchCount = 0;

    for (const sub of submissions) {
      const preferredRoles = sub.preferences || [];
      const avail = sub.availability || {};

      for (const dateKey of Object.keys(avail)) {
        const times = avail[dateKey];
        if (!times || times.length === 0) continue;

        // Find candidate shifts
        for (const targetRole of preferredRoles) {
          const candidateShifts = shifts.filter(s => 
            s.date === dateKey && 
            s.role === targetRole && 
            (s.assignedVolunteers || []).length < s.capacity &&
            !(s.assignedVolunteers || []).some(v => v.submissionId === sub.id)
          );

          if (candidateShifts.length > 0) {
            const shiftToAssign = candidateShifts[0];
            await handleAssignVolunteerToShift(sub, shiftToAssign);
            matchCount++;
            break; 
          }
        }
      }
    }

    if (matchCount > 0) {
      showToast(`Auto-assigned ${matchCount} volunteer slots based on preferences!`, "success");
    } else {
      showToast("No new matching gaps could be automatically filled.", "info");
    }
  };

  const gapAnalysis = useMemo(() => {
    const analysis = [];

    FESTIVAL_DAYS.forEach(day => {
      TIME_SLOTS.forEach(slot => {
        const [start] = slot.split(' - ');
        
        SHIFT_ROLES.forEach(role => {
          const matchingShifts = shifts.filter(s => s.date === day.key && s.role === role && s.startTime === start);
          const totalNeeded = matchingShifts.reduce((acc, curr) => acc + curr.capacity, 0);
          const totalAssigned = matchingShifts.reduce((acc, curr) => acc + (curr.assignedVolunteers?.length || 0), 0);
          const gap = totalNeeded - totalAssigned;

          if (totalNeeded > 0 || gap > 0) {
            analysis.push({
              date: day.key,
              dayLabel: day.label,
              slot,
              role,
              needed: totalNeeded,
              assigned: totalAssigned,
              gap: Math.max(0, gap),
              shifts: matchingShifts
            });
          }
        });
      });
    });

    return analysis;
  }, [shifts]);

  const totalGapCount = useMemo(() => {
    return gapAnalysis.reduce((acc, curr) => acc + curr.gap, 0);
  }, [gapAnalysis]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-orange-50/40 text-slate-800'} transition-colors duration-200`}>
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all ${
          notification.type === 'error' ? 'bg-red-500 text-white border-red-600' :
          notification.type === 'warning' ? 'bg-amber-500 text-white border-amber-600' :
          notification.type === 'success' ? 'bg-emerald-600 text-white border-emerald-700' :
          'bg-orange-600 text-white border-orange-700'
        }`}>
          {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 shrink-0" />}
          {notification.type === 'success' && <CheckCircle className="w-5 h-5 shrink-0" />}
          {notification.type === 'error' && <XCircle className="w-5 h-5 shrink-0" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Header Bar */}
      <header className={`sticky top-0 z-30 border-b ${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-amber-200'} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-amber-500 to-orange-600 p-2 rounded-xl text-white shadow-md shadow-orange-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg leading-tight tracking-tight">Diwali Mandir Seva Portal</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse mr-1"></span>
                  Diwali & New Year 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">60+ Sevak Scheduling, Availability & Gap Manager</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                isAdmin ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Coordinator Mode' : 'Sevak Mode'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container & Tab Navigation */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2 bg-slate-200/60 dark:bg-slate-800 p-1 rounded-2xl w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('availabilityForm')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'availabilityForm' ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Sevak Signup Form (Shareable)
            </button>

            {isAdmin && (
              <>
                <button
                  onClick={() => setActiveTab('manager')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                    activeTab === 'manager' ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Management & Auto-Assign ({submissions.length})
                </button>

                <button
                  onClick={() => setActiveTab('gaps')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                    activeTab === 'gaps' ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  Gaps & Department Needs ({totalGapCount})
                </button>

                <button
                  onClick={() => setActiveTab('roster')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                    activeTab === 'roster' ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Master Department Rota
                </button>
              </>
            )}
          </div>

          {isAdmin && activeTab === 'manager' && (
            <button
              onClick={handleRunAutoMatch}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl shadow-md transition-all"
            >
              <Wand2 className="w-4 h-4" />
              Auto-Fill Rota From Preferences
            </button>
          )}
        </div>

        {/* TAB 1: VOLUNTEER AVAILABILITY FORM (SHAREABLE) */}
        {activeTab === 'availabilityForm' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-amber-200'} shadow-lg space-y-4`}>
              <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">Diwali & Annakut 2026</span>
                <h2 className="text-xl font-bold mt-1">Sevak Availability & Department Preference Form</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Please submit your availability and preferred Seva departments. The Seva Coordination Team will align your schedule and place you into the master department rota.
                </p>
              </div>

              <form onSubmit={handleSubmitAvailability} className="space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priyesh Patel"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'} outline-none focus:ring-2 focus:ring-orange-500`}
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Phone Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +44 7700 900000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'} outline-none focus:ring-2 focus:ring-orange-500`}
                    />
                  </div>
                </div>

                {/* Preference Selection */}
                <div>
                  <label className="block font-bold mb-1">Preferred Seva Departments (Select Top Preferences)</label>
                  <p className="text-[11px] text-slate-500 mb-2">Check all departments you are happy to serve in.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                    {SHIFT_ROLES.map(role => {
                      const isSelected = formData.preferences.includes(role);
                      return (
                        <button
                          type="button"
                          key={role}
                          onClick={() => {
                            const newPref = isSelected
                              ? formData.preferences.filter(p => p !== role)
                              : [...formData.preferences, role];
                            setFormData({ ...formData, preferences: newPref });
                          }}
                          className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                            isSelected 
                              ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold dark:bg-amber-950 dark:text-amber-200' 
                              : 'bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800'
                          }`}
                        >
                          <span>{role}</span>
                          {isSelected && <Check className="w-4 h-4 text-amber-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Availability Matrix */}
                <div>
                  <label className="block font-bold mb-1">Time Availability Matrix *</label>
                  <p className="text-[11px] text-slate-500 mb-3">Select time windows when you are free on-site at the Mandir.</p>

                  <div className="space-y-4">
                    {FESTIVAL_DAYS.map(day => (
                      <div key={day.key} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          <span className="font-bold">{day.label} ({day.dateStr})</span>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                          {TIME_SLOTS.map(slot => {
                            const isAvailable = (formData.availability[day.key] || []).includes(slot);
                            return (
                              <button
                                type="button"
                                key={slot}
                                onClick={() => {
                                  const dayAvail = formData.availability[day.key] || [];
                                  const updated = isAvailable
                                    ? dayAvail.filter(s => s !== slot)
                                    : [...dayAvail, slot];
                                  setFormData({
                                    ...formData,
                                    availability: { ...formData.availability, [day.key]: updated }
                                  });
                                }}
                                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                                  isAvailable
                                    ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">Special Notes / Experience / Constraints</label>
                  <textarea
                    rows="2"
                    placeholder="e.g. First aid certified, available for heavy lifting, or need early departure for family..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className={`w-full p-3 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'} outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Submit Seva Availability
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: COORDINATOR MANAGEMENT & AUTO-ASSIGN */}
        {activeTab === 'manager' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-amber-200'} shadow-sm flex flex-col md:flex-row items-center justify-between gap-4`}>
              <div>
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  Volunteer Submissions & Rota Alignment ({submissions.length} Sevaks)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review submitted volunteer preferences and assign them directly into required department time shifts.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search volunteer name or department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'} outline-none`}
                  />
                </div>
              </div>
            </div>

            {/* Volunteer Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {submissions
                .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((sub) => {
                  const assignedList = sub.assignedShifts || [];
                  return (
                    <div 
                      key={sub.id} 
                      className={`p-4 rounded-3xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-amber-100'} shadow-sm space-y-3 flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm">{sub.name}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            assignedList.length > 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {assignedList.length > 0 ? `${assignedList.length} Rota Shifts` : 'Unassigned'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" /> {sub.phone}
                        </p>

                        {/* Preferred Departments */}
                        <div className="mt-3">
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Preferred Sevas</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(sub.preferences || []).map(p => (
                              <span key={p} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Stated Availability */}
                        <div className="mt-2">
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Available Times</p>
                          <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5 mt-1">
                            {Object.keys(sub.availability || {}).map(dayKey => (
                              <div key={dayKey} className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-orange-500 shrink-0" />
                                <span>{dayKey === '2026-11-08' ? 'Diwali' : 'New Year'}: {(sub.availability[dayKey] || []).join(', ') || 'None'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Manual Assignment Action Button */}
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Quick Assign to Open Shift</p>
                        <select
                          onChange={(e) => {
                            if (!e.target.value) return;
                            const targetShift = shifts.find(s => s.id === e.target.value);
                            handleAssignVolunteerToShift(sub, targetShift);
                            e.target.value = '';
                          }}
                          className={`w-full p-2 text-xs rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'} outline-none`}
                        >
                          <option value="">Select Shift to Assign...</option>
                          {shifts
                            .filter(s => (s.assignedVolunteers || []).length < s.capacity)
                            .map(s => (
                              <option key={s.id} value={s.id}>
                                {s.date === '2026-11-08' ? 'Diwali' : 'NY'} | {s.role} ({s.startTime}-{s.endTime})
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 3: GAPS & DEPARTMENT DEMAND HEATMAP */}
        {activeTab === 'gaps' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-amber-200'} shadow-sm`}>
              <h2 className="text-base font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                Department Headcount Demand & Gap Analysis
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time monitor flagging unfilled volunteer slots across all departments and time slots for Diwali and Hindu New Year.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {gapAnalysis.map((item, idx) => {
                const isShortage = item.gap > 0;
                return (
                  <div 
                    key={idx}
                    className={`p-4 rounded-2xl border ${
                      isShortage 
                        ? 'bg-rose-50/50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900' 
                        : 'bg-emerald-50/40 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900'
                    } flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800">
                          {item.dayLabel}
                        </span>
                        <span className="font-semibold text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-orange-500" /> {item.slot}
                        </span>
                      </div>
                      <h3 className="font-bold text-base mt-1">{item.role}</h3>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Scheduled / Required</p>
                        <p className="text-lg font-bold">
                          {item.assigned} / {item.needed}
                        </p>
                      </div>

                      <div className={`px-4 py-2 rounded-xl text-center font-bold text-xs ${
                        isShortage 
                          ? 'bg-rose-600 text-white shadow-sm' 
                          : 'bg-emerald-600 text-white'
                      }`}>
                        {isShortage ? `${item.gap} Sevak Gap` : 'Fully Staffed'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: MASTER DEPARTMENT ROTA */}
        {activeTab === 'roster' && (
          <div className="space-y-6">
            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-amber-200'} shadow-sm flex items-center justify-between gap-4`}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterDate('2026-11-08')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    filterDate === '2026-11-08' ? 'bg-orange-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  Diwali Day (Nov 8)
                </button>
                <button
                  onClick={() => setFilterDate('2026-11-09')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    filterDate === '2026-11-09' ? 'bg-orange-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  Hindu New Year / Annakut (Nov 9)
                </button>
              </div>

              {isAdmin && (
                <button
                  onClick={() => {
                    setEditingShift(null);
                    setIsShiftModalOpen(true);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Rota Shift
                </button>
              )}
            </div>

            {/* Rota Shifts List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shifts
                .filter(s => s.date === filterDate)
                .map((shift) => {
                  const assigned = shift.assignedVolunteers || [];
                  const gap = shift.capacity - assigned.length;

                  return (
                    <div 
                      key={shift.id}
                      className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-amber-100'} shadow-sm space-y-3 flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                            {shift.role}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-orange-500" /> {shift.startTime} - {shift.endTime}
                          </span>
                        </div>

                        <h3 className="font-bold text-base mt-2">{shift.title}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" /> {shift.location}
                        </p>
                      </div>

                      {/* Rota Assigned Sevaks */}
                      <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>Assigned Sevaks ({assigned.length}/{shift.capacity})</span>
                          {gap > 0 ? (
                            <span className="text-rose-600 dark:text-rose-400">{gap} Slots Unfilled</span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400">Full</span>
                          )}
                        </div>

                        <div className="space-y-1.5 max-h-36 overflow-y-auto">
                          {assigned.length === 0 ? (
                            <p className="text-xs text-slate-400 italic py-2 text-center border border-dashed rounded-xl">No Sevaks assigned to this shift yet.</p>
                          ) : (
                            assigned.map((vol) => (
                              <div key={vol.submissionId} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                                <div>
                                  <p className="font-bold">{vol.name}</p>
                                  <p className="text-[10px] text-slate-400">{vol.phone}</p>
                                </div>
                                {isAdmin && (
                                  <button
                                    onClick={() => handleRemoveVolunteerFromShift(shift.id, vol.submissionId)}
                                    className="p-1 text-slate-400 hover:text-rose-600"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

      </main>

      {/* MODAL: ADD/EDIT ROTA SHIFT */}
      {isShiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl border ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold">{editingShift ? 'Edit Rota Shift' : 'Add New Department Rota Shift'}</h2>
              <button onClick={() => setIsShiftModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const shiftData = {
                title: formData.get('title'),
                role: formData.get('role'),
                date: formData.get('date'),
                startTime: formData.get('startTime'),
                endTime: formData.get('endTime'),
                location: formData.get('location'),
                capacity: parseInt(formData.get('capacity'), 10) || 10,
                assignedVolunteers: editingShift?.assignedVolunteers || [],
                checkedInVolunteers: editingShift?.checkedInVolunteers || []
              };

              try {
                if (editingShift) {
                  await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'shifts', editingShift.id), shiftData);
                  showToast("Shift updated!", "success");
                } else {
                  await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'shifts'), shiftData);
                  showToast("New shift added to rota!", "success");
                }
                setIsShiftModalOpen(false);
              } catch (err) {
                console.error(err);
                showToast("Failed to save shift", "error");
              }
            }} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Shift Title *</label>
                <input name="title" required defaultValue={editingShift?.title || ''} placeholder="e.g. Annakut Garland & Food Counter" className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'} outline-none`} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Department *</label>
                  <select name="role" defaultValue={editingShift?.role || SHIFT_ROLES[0]} className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'} outline-none`}>
                    {SHIFT_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Capacity (Sevaks Needed) *</label>
                  <input type="number" name="capacity" min="1" required defaultValue={editingShift?.capacity || 10} className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'} outline-none`} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">Date *</label>
                  <select name="date" defaultValue={editingShift?.date || '2026-11-08'} className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'} outline-none`}>
                    <option value="2026-11-08">Nov 8 (Diwali)</option>
                    <option value="2026-11-09">Nov 9 (New Year)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Start *</label>
                  <input type="time" name="startTime" required defaultValue={editingShift?.startTime || '07:00'} className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'} outline-none`} />
                </div>
                <div>
                  <label className="block font-bold mb-1">End *</label>
                  <input type="time" name="endTime" required defaultValue={editingShift?.endTime || '10:00'} className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'} outline-none`} />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Location / Zone *</label>
                <input name="location" required defaultValue={editingShift?.location || ''} placeholder="e.g. Main Shrine Hall" className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'} outline-none`} />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setIsShiftModalOpen(false)} className="px-4 py-2 rounded-xl border font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-orange-600 text-white font-bold">Save Shift</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
