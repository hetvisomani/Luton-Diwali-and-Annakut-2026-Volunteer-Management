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
  BarChart3,
  User,
  Download,
  LogOut,
  KeyRound,
  Plus,
  Upload,
  FileText,
  Check,
  Filter
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

// Admin SIDs with management privilege
const ADMIN_SIDS = ['SID-31056', '31056', 'SID-ADMIN', 'ADMIN'];

const DEPARTMENT_LEADS = {
  "Annakut Setup/Windup": { lead: "Bhavesh Patel"},
  "AV": { lead: "Ketan Shah"},
  "Catering/Food stalls": { lead: "Dhiren Amin"},
  "Finance": { lead: "Sanjay Mehta"},
  "Housekeeping": { lead: "Mahesh Joshi"},
  "Mandir Shop": { lead: "Rakesh Patel"},
  "Outreach": { lead: "Anil Kumar"},
  "Parking": { lead: "Jiten Patel"},
  "Photography/Videography": { lead: "Pravin Tailor"},
  "Security": { lead: "Dipak Bhagat"},
  "Sabha Vyavestha": { lead: "Hitesh Trivedi"},
  "Sampark": { lead: "Nitin Sharma"},
  "Welcome": { lead: "Jayesh Patel"},
  "Flow management": { lead: "Amit Parikh"},
  "Volunteer management": { lead: "Harish Dave"}
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
    sid: 'SID-31056',
    fullName: 'Hetvi Somani (Admin)',
    email: 'jay.patel@example.com',
    mandal: 'Yuvati Mandal (ages 22-35)',
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
  const [activeTab, setActiveTab] = useState('portal');
  const [darkMode, setDarkMode] = useState(false);

  // User auth state
  const [portalSidInput, setPortalSidInput] = useState('');
  const [loggedInSevak, setLoggedInSevak] = useState(null);
  const [portalMessage, setPortalMessage] = useState('');

  // Check if active user is Admin
  const isAdminLoggedIn = useMemo(() => {
    if (!loggedInSevak) return false;
    const cleanSid = loggedInSevak.sid.toUpperCase().replace(/[^0-9A-Z]/g, '');
    return ADMIN_SIDS.some(adminSid => {
      const cleanAdmin = adminSid.toUpperCase().replace(/[^0-9A-Z]/g, '');
      return cleanSid.includes(cleanAdmin) || cleanAdmin.includes(cleanSid);
    });
  }, [loggedInSevak]);

  // Rota & Sevaks state
  const [shifts, setShifts] = useState(generateInitialShifts);
  const [submissions, setSubmissions] = useState(initialSubmissions);

  // Modals & form states
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [allocationFilter, setAllocationFilter] = useState('ALL');
  const [selectedAllocationDays, setSelectedAllocationDays] = useState({});
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [selectedDayFilter, setSelectedDayFilter] = useState('ALL');
  const [ragDeptFilter, setRagDeptFilter] = useState('ALL');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(DAYS[0].id);

  const [newShift, setNewShift] = useState({
    department: DEPARTMENTS[0],
    day: DAYS[0].id,
    title: '',
    timeSlot: '9am to 1pm',
    requiredVolunteers: 5
  });

  // Sync / Microsoft Excel import state
  const [excelPasteData, setExcelPasteData] = useState('');
  const [lastSynced, setLastSynced] = useState(new Date().toLocaleTimeString());
  const [isSyncing, setIsSyncing] = useState(false);
  const [importStatusMsg, setImportStatusMsg] = useState({ text: '', type: '' });
  const [excelFile, setExcelFile] = useState(null);

  // Parse Excel tabular TSV/CSV or JSON responses from MS Forms Excel Export
  const handleProcessExcelData = (textInput) => {
    try {
      const raw = textInput || excelPasteData;
      if (!raw.trim()) {
        setImportStatusMsg({ text: 'Please paste Excel response rows or upload a file.', type: 'error' });
        return;
      }

      let parsedRows = [];
      if (raw.trim().startsWith('[') || raw.trim().startsWith('{')) {
        const json = JSON.parse(raw);
        parsedRows = Array.isArray(json) ? json : [json];
      } else {
        const lines = raw.trim().split('\n').map(l => l.split(/\t|,/));
        if (lines.length > 0) {
          const headers = lines[0].map(h => h.trim().toLowerCase());
          
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i];
            if (cols.length < 2) continue;
            
            const rowObj = {};
            headers.forEach((h, idx) => {
              rowObj[h] = cols[idx] ? cols[idx].trim() : '';
            });
            parsedRows.push(rowObj);
          }
        }
      }

      if (parsedRows.length === 0) {
        setImportStatusMsg({ text: 'Could not read any valid response rows. Please check format.', type: 'error' });
        return;
      }

      const findColValue = (row, keywords) => {
        const key = Object.keys(row).find(k => keywords.some(kw => k.toLowerCase().includes(kw.toLowerCase())));
        return key ? row[key] : '';
      };

      const newSevaks = parsedRows.map((item, idx) => {
        const name = findColValue(item, ['full name', 'fullname', 'sevak name', 'name']) || `Sevak ${submissions.length + idx + 1}`;
        const sidRaw = findColValue(item, ['satsangi id', 'sid', 'id']) || `SID-${Math.floor(1000 + Math.random() * 9000)}`;
        const cleanSid = sidRaw.toUpperCase().startsWith('SID-') ? sidRaw.toUpperCase() : `SID-${sidRaw}`;
        const mandal = findColValue(item, ['mandal']) || 'Yuvak Mandal (ages 22-35)';
        
        // Extract all preferences and detailed availability columns from CSV
        const deptsRaw = findColValue(item, ['preferred department', 'department', 'dept', 'seva preference', 'seva']) || '';
        const preferredDepartments = typeof deptsRaw === 'string' && deptsRaw.trim() 
          ? deptsRaw.split(/;|,/).map(d => d.trim()).filter(Boolean) 
          : ['Annakut Setup/Windup'];

        const diwaliTime = findColValue(item, ['diwali time', 'diwali availability', 'diwali slot', 'diwali']) || '9am to 1pm, 1pm to 5pm';
        const setupTime = findColValue(item, ['setup time', 'preparation', 'annakut setup', 'setup']) || '1pm to 5pm, 5pm to 10pm';
        const annakutTime = findColValue(item, ['annakut time', 'annakut availability', 'annakut slot', 'annakut']) || '5pm to 10pm';
        const crecheHelp = findColValue(item, ['creche', 'childcare', 'kids']) || '';

        const parseTimeSlots = (str) => {
          if (!str) return [];
          if (Array.isArray(str)) return str;
          return str.split(/;|,/).map(t => t.trim()).filter(Boolean);
        };

        return {
          id: `sub-excel-${Date.now()}-${idx}`,
          sid: cleanSid,
          fullName: name,
          email: findColValue(item, ['email']) || '',
          mandal: mandal,
          preferredDepartments: preferredDepartments.length > 0 ? preferredDepartments : ['Annakut Setup/Windup'],
          crecheSupport: crecheHelp,
          availability: {
            diwali: parseTimeSlots(diwaliTime),
            setup_windup: parseTimeSlots(setupTime),
            annakut: parseTimeSlots(annakutTime)
          },
          customAvailability: { diwali: '', setup_windup: '', annakut: '' },
          status: 'Pending',
          assignedShifts: []
        };
      });

      setSubmissions(prev => {
        const existingSids = new Set(prev.map(s => s.sid.toUpperCase()));
        const uniqueNew = newSevaks.filter(s => !existingSids.has(s.sid.toUpperCase()));
        return [...uniqueNew, ...prev];
      });

      setImportStatusMsg({ text: `Successfully extracted ${newSevaks.length} Sevak record(s) into Volunteer Allocation!`, type: 'success' });
      setExcelPasteData('');
      setLastSynced(new Date().toLocaleTimeString());
    } catch (err) {
      setImportStatusMsg({ text: 'Failed to parse Excel data format. Ensure columns contain Name, SID, Mandal, etc.', type: 'error' });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setExcelFile(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;
      handleProcessExcelData(content);
    };
    reader.readAsText(file);
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
      setImportStatusMsg({ text: 'Invalid JSON format. Please paste a valid JSON array.', type: 'error' });
    }
  };

  const handlePortalLogin = (e) => {
    e.preventDefault();
    const cleanInput = portalSidInput.trim().toUpperCase().replace(/[^0-9A-Z]/g, '');

    if (!cleanInput) {
      setPortalMessage('Please enter your numeric Satsangi ID.');
      return;
    }

    const found = submissions.find(s => {
      const cleanSubSid = s.sid.toUpperCase().replace(/[^0-9A-Z]/g, '');
      const numOnlySub = s.sid.replace(/\D/g, '');
      const numOnlyInput = portalSidInput.replace(/\D/g, '');

      return cleanSubSid === cleanInput || 
             (numOnlyInput && numOnlySub === numOnlyInput);
    });

    if (found) {
      setLoggedInSevak(found);
      setPortalMessage('');
      setActiveTab('portal');
    } else {
      setPortalMessage('Invalid Satsangi ID (SID). Please enter your numeric ID (e.g. 1001 or 1002).');
    }
  };

  const handleSyncMicrosoftForm = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSynced(new Date().toLocaleTimeString());
    }, 1000);
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
    setShifts(prevShifts =>
      prevShifts.map(shift => ({
        ...shift,
        assignedVolunteers: shift.assignedVolunteers.filter(id => id !== submissionId),
        leadVolunteerId: shift.leadVolunteerId === submissionId ? null : shift.leadVolunteerId
      }))
    );
    setSubmissions(prevSubs => prevSubs.filter(sub => sub.id !== submissionId));
  };

  const handleDeleteShiftFromMasterRota = (shiftId) => {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return;

    setSubmissions(prev => 
      prev.map(sub => ({
        ...sub,
        assignedShifts: sub.assignedShifts.filter(id => id !== shiftId),
        status: sub.assignedShifts.filter(id => id !== shiftId).length === 0 ? 'Pending' : sub.status
      }))
    );

    setShifts(prev => prev.filter(s => s.id !== shiftId));
  };

  const handleCreateNewShift = (e) => {
    e.preventDefault();
    const createdShift = {
      id: `shift-${Date.now()}`,
      department: newShift.department,
      day: newShift.day,
      title: newShift.title || `${newShift.department} - ${newShift.timeSlot}`,
      timeSlot: newShift.timeSlot,
      requiredVolunteers: parseInt(newShift.requiredVolunteers) || 5,
      assignedVolunteers: [],
      leadVolunteerId: null,
      location: `${newShift.department} Zone`,
      isUrgent: false
    };

    setShifts(prev => [...prev, createdShift]);
    setShowAddShiftModal(false);
    setNewShift({
      department: DEPARTMENTS[0],
      day: DAYS[0].id,
      title: '',
      timeSlot: '9am to 1pm',
      requiredVolunteers: 5
    });
  };

  const handleSaveShiftEdit = (e) => {
    e.preventDefault();
    if (!editingShift) return;
    setShifts(prev => prev.map(s => s.id === editingShift.id ? editingShift : s));
    setEditingShift(null);
  };

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
      return matchesDept && matchesDay;
    });
  }, [shifts, selectedDeptFilter, selectedDayFilter]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      const matchesSearch = sub.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            sub.sid.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            sub.email.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesFilter = true;
      if (allocationFilter === 'Pending') {
        matchesFilter = sub.status === 'Pending';
      } else if (allocationFilter === 'Assigned') {
        matchesFilter = sub.status === 'Assigned';
      } else if (allocationFilter === 'Kishore') {
        matchesFilter = sub.mandal.toLowerCase().includes('kishore mandal');
      } else if (allocationFilter === 'Kishori') {
        matchesFilter = sub.mandal.toLowerCase().includes('kishori mandal');
      } else if (allocationFilter === 'Yuvak') {
        matchesFilter = sub.mandal.toLowerCase().includes('yuvak mandal');
      } else if (allocationFilter === 'Yuvati') {
        matchesFilter = sub.mandal.toLowerCase().includes('yuvati mandal');
      } else if (allocationFilter === 'Sanyukta') {
        matchesFilter = sub.mandal.toLowerCase().startsWith('sanyukta mandal');
      } else if (allocationFilter === 'Sanyukta Mahila') {
        matchesFilter = sub.mandal.toLowerCase().includes('sanyukta mahila');
      } else if (allocationFilter === 'Mahila') {
        matchesFilter = ['kishori', 'yuvati', 'sanyukta mahila'].some(m => sub.mandal.toLowerCase().includes(m));
      } else if (allocationFilter === 'Purush') {
        matchesFilter = ['kishore', 'yuvak', 'sanyukta mandal'].some(m => sub.mandal.toLowerCase().includes(m)) && !sub.mandal.toLowerCase().includes('mahila');
      }

      return matchesSearch && matchesFilter;
    });
  }, [submissions, searchQuery, allocationFilter]);

  const filteredRagDepartments = useMemo(() => {
    if (ragDeptFilter === 'ALL') return DEPARTMENTS;
    return DEPARTMENTS.filter(d => d === ragDeptFilter);
  }, [ragDeptFilter]);

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
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/50 dark:border-slate-800">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar">
            <button
              onClick={() => setActiveTab('portal')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'portal'
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <User className="w-4 h-4" /> Sevak Rota Schedule
            </button>

            {isAdminLoggedIn && (
              <>
                <button
                  onClick={() => setActiveTab('form')}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                    activeTab === 'form'
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" /> Excel Data Connector
                </button>

                <button
                  onClick={() => setActiveTab('allocation')}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                    activeTab === 'allocation'
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-4 h-4" /> Volunteer Allocation
                </button>

                <button
                  onClick={() => setActiveTab('masterRota')}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                    activeTab === 'masterRota'
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Calendar className="w-4 h-4" /> Master Rota
                </button>

                <button
                  onClick={() => setActiveTab('ragGaps')}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                    activeTab === 'ragGaps'
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" /> RAG & Calendar Matrix
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">

        {/* SECTION 1: SEVAK PORTAL LOGIN & PERSONAL ROTA */}
        {activeTab === 'portal' && (
          <div className="max-w-xl mx-auto space-y-6">
            {!loggedInSevak ? (
              <div className={`p-6 sm:p-8 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-2xl space-y-6 text-center`}>
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Jay Swaminarayan
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Enter your numeric Satsangi ID (SID) to view your allocated Diwali & Annakut 2026 Seva Rota.
                  </p>
                </div>

                <form onSubmit={handlePortalLogin} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. 31056 or 1002"
                      value={portalSidInput}
                      onChange={e => setPortalSidInput(e.target.value)}
                      className={`w-full px-4 py-3.5 rounded-2xl text-center font-mono font-bold text-base border outline-none transition-all ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-500' : 'bg-slate-50 border-amber-200 text-slate-900 focus:border-amber-500'
                      }`}
                    />
                  </div>

                  {portalMessage && (
                    <p className="text-xs font-bold text-rose-500">
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
                  <p className="font-semibold text-slate-500">Quick Test Numeric SIDs:</p>
                  <div className="flex flex-wrap justify-center gap-2 font-mono text-[11px]">
                    <button onClick={() => setPortalSidInput('31056')} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                      31056 (Admin Access)
                    </button>
                    <button onClick={() => setPortalSidInput('1002')} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-bold">
                      1002 (Regular Sevak)
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Sevak Logged-in Header with Fixed Contrast */}
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
                      <div className="mt-2">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                          Jay Swaminarayan,
                        </h2>
                        <span className="block text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
                          {loggedInSevak.fullName}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => { setLoggedInSevak(null); setPortalSidInput(''); setActiveTab('portal'); }}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
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
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: EXCEL DATA CONNECTOR */}
        {isAdminLoggedIn && activeTab === 'form' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className={`p-6 sm:p-8 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-xl space-y-6`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                    Microsoft Excel Responses Data Connector
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Extract Sevak responses directly from your MS Forms Excel sheet (Name, SID, Mandal, Preferred Seva & Time) to automatically populate the Volunteer Allocation list.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Last Data Import</span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{lastSynced}</span>
                </div>
              </div>

              {/* Status Message Display */}
              {importStatusMsg.text && (
                <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                  importStatusMsg.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                }`}>
                  {importStatusMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {importStatusMsg.text}
                </div>
              )}

              {/* Option 1: Direct Excel File Upload (.CSV / .TSV / exported sheet) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Option 1: Upload Exported Microsoft Excel Responses File (.csv / .txt)
                </h3>
                <div className="relative border-2 border-dashed border-amber-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:bg-amber-500/5 transition-all">
                  <input
                    type="file"
                    accept=".csv,.tsv,.txt,.json"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="space-y-2 pointer-events-none">
                    <Upload className="w-8 h-8 mx-auto text-amber-500" />
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {excelFile ? `Selected File: ${excelFile}` : 'Click or drop your Excel CSV / Response export file here'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Supports MS Forms exported spreadsheets containing Name, SID, Mandal & Department preferences
                    </p>
                  </div>
                </div>
              </div>

              {/* Option 2: Copy & Paste Cells Directly from Microsoft Excel */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Option 2: Copy & Paste Table Cells directly from Excel</span>
                  <span className="text-[10px] text-slate-400 font-normal">Headers: Name | SID | Mandal | Preferred Departments</span>
                </h3>

                <textarea
                  rows={5}
                  value={excelPasteData}
                  onChange={e => setExcelPasteData(e.target.value)}
                  placeholder={`Paste rows copied from Excel here...\n\nExample format:\nFull Name\tSID\tMandal\tPreferred Departments\nJayesh Patel\t31056\tYuvak Mandal\tParking, Catering\nNeha Shah\t1002\tYuvati Mandal\tWelcome, Housekeeping`}
                  className={`w-full p-4 rounded-2xl text-xs font-mono border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-900'
                  }`}
                />

                <button
                  onClick={() => handleProcessExcelData()}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Extract & Load Sevaks into Allocation Tab
                </button>
              </div>

              {/* Quick Summary of Extracted Response Data */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span>Active Responses Ready for Allocation ({submissions.length})</span>
                  <button
                    onClick={() => setActiveTab('allocation')}
                    className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    Go to Allocation Tab →
                  </button>
                </div>

                <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800">
                  {submissions.map(sub => (
                    <div key={sub.id} className="p-3 flex items-center justify-between text-xs bg-slate-50/50 dark:bg-slate-800/40">
                      <div>
                        <strong className="text-slate-900 dark:text-slate-100">{sub.fullName}</strong>
                        <span className="ml-2 text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">({sub.sid})</span>
                        <p className="text-[11px] text-slate-500">{sub.mandal}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sub.assignedShifts.length > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                        }`}>
                          {sub.assignedShifts.length > 0 ? `${sub.assignedShifts.length} Shifted` : 'Pending Allocation'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: VOLUNTEER ALLOCATION */}
        {isAdminLoggedIn && activeTab === 'allocation' && (
          <div className="space-y-6">
            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3`}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name or SID..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
                    }`}
                  />
                </div>

                {/* Extended Mandal & Gender Filters */}
                <select
                  value={allocationFilter}
                  onChange={e => setAllocationFilter(e.target.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
                  }`}
                >
                  <option value="ALL">All Volunteers</option>
                  <option value="Pending">Pending Only</option>
                  <option value="Assigned">Assigned Only</option>
                  <option value="Kishore">Kishore Mandal</option>
                  <option value="Kishori">Kishori Mandal</option>
                  <option value="Yuvak">Yuvak Mandal</option>
                  <option value="Yuvati">Yuvati Mandal</option>
                  <option value="Sanyukta">Sanyukta Mandal</option>
                  <option value="Sanyukta Mahila">Sanyukta Mahila Mandal</option>
                  <option value="Mahila">Mahila (Kishori, Yuvati, Sanyukta Mahila)</option>
                  <option value="Purush">Purush (Kishore, Yuvak, Sanyukta)</option>
                </select>
              </div>

              <div className="text-xs font-bold text-slate-500 self-end sm:self-center">
                {filteredSubmissions.length} Volunteers
              </div>
            </div>

            {/* Volunteer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSubmissions.map(sub => {
                const currentDay = selectedAllocationDays[sub.id] || DAYS[0].id;
                const dayShifts = shifts.filter(s => s.day === currentDay);

                return (
                  <div
                    key={sub.id}
                    className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border ${
                      darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'
                    } shadow-sm space-y-3 relative`}
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="space-y-1 w-full">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                            {sub.fullName}
                          </h3>
                          <button
                            onClick={() => handleDeleteVolunteer(sub.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
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

                        <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold pt-1">
                          {sub.mandal}
                        </p>
                      </div>
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

                    {/* Display Extracted Preferences & Availability from CSV */}
                    <div className="p-3 rounded-2xl bg-amber-500/5 dark:bg-slate-800/60 border border-amber-200/60 dark:border-slate-700/60 space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                          Preferred Departments
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {sub.preferredDepartments?.map(dept => (
                            <span key={dept} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                              {dept}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                          Stated Availability
                        </span>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 mt-0.5">
                          <div><strong>Diwali:</strong> {Array.isArray(sub.availability?.diwali) ? sub.availability.diwali.join(', ') : sub.availability?.diwali || 'N/A'}</div>
                          <div><strong>Setup/Windup:</strong> {Array.isArray(sub.availability?.setup_windup) ? sub.availability.setup_windup.join(', ') : sub.availability?.setup_windup || 'N/A'}</div>
                          <div><strong>Annakut:</strong> {Array.isArray(sub.availability?.annakut) ? sub.availability.annakut.join(', ') : sub.availability?.annakut || 'N/A'}</div>
                          {sub.crecheSupport && <div><strong>Creche Support:</strong> {sub.crecheSupport}</div>}
                        </div>
                      </div>
                    </div>

                    {/* Day then Shift Two-Step Selection */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Assign New Shift
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <select
                          value={currentDay}
                          onChange={e => setSelectedAllocationDays(prev => ({ ...prev, [sub.id]: e.target.value }))}
                          className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-bold border outline-none ${
                            darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
                          }`}
                        >
                          {DAYS.map(day => (
                            <option key={day.id} value={day.id}>{day.label}</option>
                          ))}
                        </select>

                        <select
                          onChange={e => {
                            if (e.target.value) {
                              assignVolunteerToShift(sub.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          defaultValue=""
                          className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-bold border outline-none ${
                            darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
                          }`}
                        >
                          <option value="" disabled>Select Shift...</option>
                          {dayShifts.map(shift => (
                            <option key={shift.id} value={shift.id}>
                              {shift.department} ({shift.timeSlot}) - {shift.assignedVolunteers.length}/{shift.requiredVolunteers}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 4: MASTER ROTA (ADMIN MANAGEMENT) */}
        {isAdminLoggedIn && activeTab === 'masterRota' && (
          <div className="space-y-6">
            <div className={`p-4 sm:p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4`}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <select
                  value={selectedDeptFilter}
                  onChange={e => setSelectedDeptFilter(e.target.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
                  }`}
                >
                  <option value="ALL">All Departments</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
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
                  {DAYS.map(day => (
                    <option key={day.id} value={day.id}>{day.label}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setShowAddShiftModal(true)}
                className="py-2.5 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Custom Shift
              </button>
            </div>

            {/* Master Rota Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMasterShifts.map(shift => {
                const dayObj = DAYS.find(d => d.id === shift.day);
                const leadVol = submissions.find(s => s.id === shift.leadVolunteerId);

                return (
                  <div key={shift.id} className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm space-y-4 flex flex-col justify-between`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          {shift.department}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingShift(shift)}
                            className="p-1 text-slate-400 hover:text-amber-500 rounded-lg"
                            title="Edit Shift Details & Time"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteShiftFromMasterRota(shift.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded-lg"
                            title="Delete Shift"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {shift.title}
                      </h3>

                      <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-amber-500" />
                          <span>{dayObj ? dayObj.label : shift.day}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span className="font-semibold">{shift.timeSlot}</span>
                        </div>
                      </div>

                      {/* Team Lead Indicator */}
                      <div className="pt-2">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Assigned Lead
                        </span>
                        {leadVol ? (
                          <div className="flex items-center justify-between mt-1 p-2 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 text-xs font-bold">
                            <span className="flex items-center gap-1.5 truncate">
                              <Crown className="w-3.5 h-3.5 text-amber-500" />
                              {leadVol.fullName}
                            </span>
                            <button
                              onClick={() => toggleLeadVolunteer(shift.id, leadVol.id)}
                              className="text-slate-400 hover:text-rose-500"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No Lead assigned</span>
                        )}
                      </div>

                      {/* Assigned Sevaks List */}
                      <div className="pt-2">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Assigned Sevaks ({shift.assignedVolunteers.length}/{shift.requiredVolunteers})
                        </span>
                        {shift.assignedVolunteers.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">No volunteers assigned.</p>
                        ) : (
                          <div className="space-y-1">
                            {shift.assignedVolunteers.map(volId => {
                              const vol = submissions.find(s => s.id === volId);
                              if (!vol) return null;
                              return (
                                <div key={volId} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs">
                                  <span className="font-medium text-slate-800 dark:text-slate-200">{vol.fullName}</span>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => toggleLeadVolunteer(shift.id, volId)}
                                      className={`p-1 rounded-lg ${shift.leadVolunteerId === volId ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'}`}
                                      title="Toggle Lead Status"
                                    >
                                      <Crown className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => unassignVolunteerFromShift(volId, shift.id)}
                                      className="p-1 text-slate-400 hover:text-rose-500"
                                      title="Remove from shift"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 5: RAG & CALENDAR MATRIX TAB */}
        {isAdminLoggedIn && activeTab === 'ragGaps' && (
          <div className="space-y-6">
            {/* Department Filter & Summary Cards */}
            <div className={`p-4 sm:p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm space-y-4`}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-amber-500" /> RAG Capacity & Calendar Matrix
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Monitor requirement gaps and volunteer coverage across days and time slots.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={ragDeptFilter}
                    onChange={e => setRagDeptFilter(e.target.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
                    }`}
                  >
                    <option value="ALL">All Departments</option>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Day Tabs */}
              <div className="flex gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                {DAYS.map(day => (
                  <button
                    key={day.id}
                    onClick={() => setSelectedCalendarDay(day.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedCalendarDay === day.id
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Matrix View per Department */}
            <div className="space-y-4">
              {filteredRagDepartments.map(dept => {
                return (
                  <div key={dept} className={`p-4 sm:p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm space-y-3`}>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center justify-between">
                      <span>{dept}</span>
                      <span className="text-xs text-slate-400 font-medium">Lead: {DEPARTMENT_LEADS[dept]?.lead || 'Unassigned'}</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {TIME_SLOTS.map(slot => {
                        const shift = shifts.find(s => s.department === dept && s.day === selectedCalendarDay && s.timeSlot === slot);
                        if (!shift) return null;

                        const assignedCount = shift.assignedVolunteers.length;
                        const reqCount = shift.requiredVolunteers;
                        const pct = reqCount > 0 ? Math.round((assignedCount / reqCount) * 100) : 100;

                        let ragBg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400';
                        if (pct < 50) ragBg = 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400';
                        else if (pct < 100) ragBg = 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400';

                        return (
                          <div key={slot} className={`p-3.5 rounded-2xl border ${ragBg} space-y-2`}>
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span>{slot}</span>
                              <span className="font-mono">{assignedCount} / {reqCount} ({pct}%)</span>
                            </div>

                            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-current transition-all"
                                style={{ width: `${Math.min(100, pct)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* Add Custom Shift Modal */}
      {showAddShiftModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-amber-200 text-slate-900'} shadow-2xl space-y-4`}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold">Add Custom Shift</h3>
              <button onClick={() => setShowAddShiftModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewShift} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-500 mb-1">Department</label>
                <select
                  value={newShift.department}
                  onChange={e => setNewShift({ ...newShift, department: e.target.value })}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 outline-none font-medium"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Day</label>
                <select
                  value={newShift.day}
                  onChange={e => setNewShift({ ...newShift, day: e.target.value })}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 outline-none font-medium"
                >
                  {DAYS.map(d => (
                    <option key={d.id} value={d.id}>{d.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Time Slot / Custom Time</label>
                <input
                  type="text"
                  value={newShift.timeSlot}
                  onChange={e => setNewShift({ ...newShift, timeSlot: e.target.value })}
                  placeholder="e.g. 9am to 1pm or 6pm to 9pm"
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Required Volunteers Capacity</label>
                <input
                  type="number"
                  min="1"
                  value={newShift.requiredVolunteers}
                  onChange={e => setNewShift({ ...newShift, requiredVolunteers: e.target.value })}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 outline-none font-medium"
                  required
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddShiftModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-md"
                >
                  Create Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Shift Modal */}
      {editingShift && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-amber-200 text-slate-900'} shadow-2xl space-y-4`}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold">Edit Shift</h3>
              <button onClick={() => setEditingShift(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShiftEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-500 mb-1">Shift Title</label>
                <input
                  type="text"
                  value={editingShift.title}
                  onChange={e => setEditingShift({ ...editingShift, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Shift Time</label>
                <input
                  type="text"
                  value={editingShift.timeSlot}
                  onChange={e => setEditingShift({ ...editingShift, timeSlot: e.target.value })}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Capacity Required</label>
                <input
                  type="number"
                  min="1"
                  value={editingShift.requiredVolunteers}
                  onChange={e => setEditingShift({ ...editingShift, requiredVolunteers: parseInt(e.target.value) || 1 })}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 outline-none font-medium"
                  required
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingShift(null)}
                  className="w-1/2 py-2.5 rounded-xl border font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
