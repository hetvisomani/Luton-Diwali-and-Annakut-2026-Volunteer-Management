import React, { useState, useMemo, useEffect } from 'react';
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
  Filter,
  Baby
} from 'lucide-react';
import { supabase } from './supabaseClient';

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
    email: 'hetvi@example.com',
    mandal: 'Yuvati Mandal (ages 22-35)',
    primaryPreferredSeva: 'Housekeeping',
    otherPreferredSeva: ['Parking', 'Annakut Setup/Windup'],
    preferredDepartments: ['Housekeeping', 'Parking', 'Annakut Setup/Windup'],
    diwaliTime: '9am to 1pm, 1pm to 5pm',
    annakutTime: '5pm to 10pm',
    setupMondayTime: '5pm to 10pm',
    windupTuesdayTime: '9pm to 11pm',
    dbsCrecheStatus: 'Yes',
    crecheAvailableTimes: '9am to 1pm',
    availability: {
      diwali: ['9am to 1pm', '1pm to 5pm'],
      setup_windup: ['5pm to 10pm'],
      annakut: ['5pm to 10pm']
    },
    crecheAvailability: 'Yes',
    status: 'Assigned',
    assignedShifts: ['shift-1']
  },
  {
    id: 'sub-2',
    sid: 'SID-1002',
    fullName: 'Priya Shah',
    email: 'priya.shah@example.com',
    mandal: 'Yuvati Mandal (ages 22-35)',
    primaryPreferredSeva: 'Welcome',
    otherPreferredSeva: ['Catering/Food stalls', 'Annakut Setup/Windup'],
    preferredDepartments: ['Welcome', 'Catering/Food stalls', 'Annakut Setup/Windup'],
    diwaliTime: '9am to 1pm, 1pm to 5pm',
    annakutTime: '1pm to 5pm',
    setupMondayTime: '9am to 1pm',
    windupTuesdayTime: 'N/A',
    dbsCrecheStatus: 'No',
    crecheAvailableTimes: 'N/A',
    availability: {
      diwali: ['9am to 1pm', '1pm to 5pm'],
      setup_windup: ['9am to 1pm', '1pm to 5pm'],
      annakut: ['1pm to 5pm']
    },
    crecheAvailability: 'No',
    status: 'Assigned',
    assignedShifts: ['shift-1', 'shift-16']
  },
  {
    id: 'sub-3',
    sid: 'SID-1003',
    fullName: 'Anil Kumar',
    email: 'anil.k@example.com',
    mandal: 'Sanyukta Mandal (ages 36+)',
    primaryPreferredSeva: 'Security',
    otherPreferredSeva: ['Parking'],
    preferredDepartments: ['Security', 'Parking'],
    diwaliTime: '1pm to 5pm',
    annakutTime: '9am to 1pm, 1pm to 5pm',
    setupMondayTime: '5pm to 10pm',
    windupTuesdayTime: '5pm to 10pm',
    dbsCrecheStatus: 'No',
    crecheAvailableTimes: 'N/A',
    availability: {
      diwali: ['1pm to 5pm'],
      setup_windup: ['5pm to 10pm'],
      annakut: ['9am to 1pm', '1pm to 5pm']
    },
    crecheAvailability: 'No',
    status: 'Assigned',
    assignedShifts: ['shift-2']
  },
  {
    id: 'sub-4',
    sid: 'SID-1004',
    fullName: 'Neha Sharma',
    email: 'neha.s@example.com',
    mandal: 'Kishori Mandal (year 9 - age 21)',
    primaryPreferredSeva: 'Mandir Shop',
    otherPreferredSeva: ['Welcome'],
    preferredDepartments: ['Mandir Shop', 'Welcome'],
    diwaliTime: '5pm to 10pm',
    annakutTime: '9am to 1pm, 1pm to 5pm',
    setupMondayTime: '9am to 1pm',
    windupTuesdayTime: '5pm to 9pm',
    dbsCrecheStatus: 'Yes',
    crecheAvailableTimes: '1pm to 5pm',
    availability: {
      diwali: ['5pm to 10pm'],
      setup_windup: ['9am to 1pm'],
      annakut: ['9am to 1pm', '1pm to 5pm']
    },
    crecheAvailability: 'Yes',
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
  const isAdminLoggedIn = loggedInSevak?.isAdmin === true;

  // Rota & Sevaks state
  const [shifts, setShifts] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Convert a submission row from Supabase into the format used by this app
const submissionFromDb = (row) => ({
  id: row.id,
  sid: row.sid,
  fullName: row.full_name,
  email: row.email || '',
  mandal: row.mandal || '',
  primaryPreferredSeva: row.primary_preferred_seva || '',
  otherPreferredSeva: row.other_preferred_seva || [],
  preferredDepartments: row.preferred_departments || [],
  diwaliTime: row.diwali_time || '',
  annakutTime: row.annakut_time || '',
  setupMondayTime: row.setup_monday_time || '',
  windupTuesdayTime: row.windup_tuesday_time || '',
  dbsCrecheStatus: row.dbs_creche_status || 'No',
  crecheAvailableTimes: row.creche_available_times || 'N/A',
  availability: row.availability || {},
  crecheAvailability: row.creche_availability || 'No',
  status: row.status || 'Pending',
  assignedShifts: row.assigned_shifts || []
});

// Convert a shift row from Supabase into the format used by this app
const shiftFromDb = (row) => ({
  id: row.id,
  department: row.department,
  day: row.day,
  title: row.title,
  timeSlot: row.time_slot,
  requiredVolunteers: row.required_volunteers,
  assignedVolunteers: row.assigned_volunteers || [],
  leadVolunteerId: row.lead_volunteer_id,
  location: row.location || '',
  isUrgent: row.is_urgent || false
});
// Convert a submission from the app format into Supabase format
const submissionToDb = (submission) => ({
  id: submission.id,
  sid: submission.sid,
  full_name: submission.fullName,
  email: submission.email || '',
  mandal: submission.mandal || '',
  primary_preferred_seva: submission.primaryPreferredSeva || '',
  other_preferred_seva: submission.otherPreferredSeva || [],
  preferred_departments: submission.preferredDepartments || [],
  diwali_time: submission.diwaliTime || '',
  annakut_time: submission.annakutTime || '',
  setup_monday_time: submission.setupMondayTime || '',
  windup_tuesday_time: submission.windupTuesdayTime || '',
  dbs_creche_status: submission.dbsCrecheStatus || 'No',
  creche_available_times: submission.crecheAvailableTimes || 'N/A',
  availability: submission.availability || {},
  creche_availability: submission.crecheAvailability || 'No',
  status: submission.status || 'Pending',
  assigned_shifts: submission.assignedShifts || []
});

// Convert a shift from the app format into Supabase format
const shiftToDb = (shift) => ({
  id: shift.id,
  department: shift.department,
  day: shift.day,
  title: shift.title,
  time_slot: shift.timeSlot,
  required_volunteers: Number(shift.requiredVolunteers) || 1,
  assigned_volunteers: shift.assignedVolunteers || [],
  lead_volunteer_id: shift.leadVolunteerId || null,
  location: shift.location || '',
  is_urgent: shift.isUrgent || false
});

// Load the latest rota and sevak data from Supabase
const loadData = async () => {
  try {
    setIsLoadingData(true);

    const [submissionsResult, shiftsResult] = await Promise.all([
      supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: true }),

      supabase
        .from('shifts')
        .select('*')
        .order('created_at', { ascending: true })
    ]);

    if (submissionsResult.error) {
      throw submissionsResult.error;
    }

    if (shiftsResult.error) {
      throw shiftsResult.error;
    }

    setSubmissions(
      (submissionsResult.data || []).map(submissionFromDb)
    );

    setShifts(
      (shiftsResult.data || []).map(shiftFromDb)
    );

  } catch (error) {
    console.error('Error loading data from Supabase:', error);
  } finally {
    setIsLoadingData(false);
  }
};

  const loadAdminData = async (adminSid) => {
  try {
    setIsLoadingData(true);

    const { data, error } = await supabase.rpc('get_admin_data', {
      input_sid: adminSid
    });

    if (error) {
      throw error;
    }

    if (!data?.success) {
      throw new Error(data?.message || 'Admin access denied');
    }

    setSubmissions(
      (data.submissions || []).map(submissionFromDb)
    );

    setShifts(
      (data.shifts || []).map(shiftFromDb)
    );

    return true;

  } catch (error) {
    console.error('Error loading admin data:', error);
    return false;

  } finally {
    setIsLoadingData(false);
  }
};

// Load database data when the website first opens

  // Modals & form states
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  // Edit Sevak Modal state
  const [editingSevak, setEditingSevak] = useState(null);

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
  const handleProcessExcelData = async (textInput) => {
  try {
    const raw = textInput || excelPasteData;

    if (!raw.trim()) {
      setImportStatusMsg({
        text: 'Please paste Excel response rows or upload a file.',
        type: 'error'
      });
      return;
    }

    let parsedRows = [];

    if (raw.trim().startsWith('[') || raw.trim().startsWith('{')) {
      const json = JSON.parse(raw);
      parsedRows = Array.isArray(json) ? json : [json];
    } else {
      const lines = raw
        .trim()
        .split('\n')
        .map(l => l.split(/\t|,/));

      if (lines.length > 0) {
        const headers = lines[0].map(h =>
          h.trim().toLowerCase()
        );

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i];

          if (cols.length < 2) continue;

          const rowObj = {};

          headers.forEach((h, idx) => {
            rowObj[h] = cols[idx]
              ? cols[idx].trim()
              : '';
          });

          parsedRows.push(rowObj);
        }
      }
    }

    if (parsedRows.length === 0) {
      setImportStatusMsg({
        text: 'Could not read any valid response rows. Please check format.',
        type: 'error'
      });
      return;
    }

    const importedSevaks = parsedRows.map((item, idx) => {
      const name =
        item.fullName ||
        item.FullName ||
        item.Name ||
        item.name ||
        item['full name'] ||
        item['fullname'] ||
        item['sevak name'] ||
        `Sevak ${submissions.length + idx + 1}`;

      const sidRaw =
        item.sid ||
        item['satsangi id'] ||
        item['id'] ||
        `SID-${Math.floor(1000 + Math.random() * 9000)}`;

      const cleanSid = String(sidRaw)
        .trim()
        .toUpperCase()
        .startsWith('SID-')
          ? String(sidRaw).trim().toUpperCase()
          : `SID-${String(sidRaw).trim().toUpperCase()}`;

      const mandal =
        item.mandal ||
        item['mandal name'] ||
        'Yuvak Mandal (ages 22-35)';

      const primarySeva =
        item['primary preferred seva'] ||
        item['primary preferred department'] ||
        item['primary seva'] ||
        item['preferred seva'] ||
        '';

      const otherSevaRaw =
        item['other preferred seva'] ||
        item['other preferred departments'] ||
        item['other seva'] ||
        '';

      const otherSevaArr =
        typeof otherSevaRaw === 'string'
          ? otherSevaRaw
              .split(/;|,/)
              .map(d => d.trim())
              .filter(Boolean)
          : [];

      const deptsRaw =
        item['preferred departments'] ||
        item['preferred seva'] ||
        item['departments'] ||
        item['dept'] ||
        item['department'] ||
        '';

      const preferredDepartments =
        typeof deptsRaw === 'string' && deptsRaw.trim()
          ? deptsRaw
              .split(/;|,/)
              .map(d => d.trim())
              .filter(Boolean)
          : primarySeva
            ? [primarySeva, ...otherSevaArr]
            : ['Annakut Setup/Windup'];

      const diwaliTimes =
        item['diwali available time'] ||
        item['diwali time'] ||
        item['diwali'] ||
        '';

      const annakutTimes =
        item['annakut available time'] ||
        item['annakut time'] ||
        item['annakut'] ||
        '';

      const setupMonday =
        item['availability for annakut setup monday 9th november'] ||
        item['annakut setup monday 9th november'] ||
        item['setup monday'] ||
        item['setup'] ||
        '';

      const windupTuesday =
        item['availability for annakut setup windup tuesday 10th november'] ||
        item['annakut setup windup tuesday 10th november'] ||
        item['windup tuesday'] ||
        item['windup'] ||
        '';

      const dbsCreche =
        item['dbs check & availabile for crèche'] ||
        item['dbs check & available for creche'] ||
        item['dbs check'] ||
        item['availability for crèche'] ||
        item['creche'] ||
        'No';

      const crecheTimes =
        item['if yes times available for crèche'] ||
        item['times available for crèche'] ||
        item['creche times'] ||
        'N/A';

      return {
        id: `sub-excel-${Date.now()}-${idx}`,
        sid: cleanSid,
        fullName: name,
        email:
          item.email ||
          item['email address'] ||
          '',
        mandal: mandal,
        primaryPreferredSeva:
          primarySeva ||
          preferredDepartments[0] ||
          'Unassigned',
        otherPreferredSeva: otherSevaArr,
        preferredDepartments:
          preferredDepartments.length > 0
            ? preferredDepartments
            : ['Annakut Setup/Windup'],
        diwaliTime:
          diwaliTimes || '9am to 1pm',
        annakutTime:
          annakutTimes || '5pm to 10pm',
        setupMondayTime:
          setupMonday || '5pm to 10pm',
        windupTuesdayTime:
          windupTuesday || 'N/A',
        dbsCrecheStatus: dbsCreche,
        crecheAvailableTimes: crecheTimes,

        availability: {
          diwali: diwaliTimes
            ? diwaliTimes
                .split(/;|,/)
                .map(t => t.trim())
                .filter(Boolean)
            : ['9am to 1pm'],

          setup_windup: setupMonday
            ? setupMonday
                .split(/;|,/)
                .map(t => t.trim())
                .filter(Boolean)
            : ['1pm to 5pm'],

          annakut: annakutTimes
            ? annakutTimes
                .split(/;|,/)
                .map(t => t.trim())
                .filter(Boolean)
            : ['5pm to 10pm']
        },

        crecheAvailability: dbsCreche,
        status: 'Pending',
        assignedShifts: []
      };
    });

    // Merge imported responses with existing sevaks by SID.
    // Existing rota allocations and IDs are preserved.
    const mergedSevaks = importedSevaks.map(imported => {
      const existing = submissions.find(
        sub =>
          sub.sid.trim().toUpperCase() ===
          imported.sid.trim().toUpperCase()
      );

      if (!existing) {
        return imported;
      }

      return {
        ...existing,

        // Update the Forms/profile information
        fullName: imported.fullName,
        email: imported.email,
        mandal: imported.mandal,
        primaryPreferredSeva: imported.primaryPreferredSeva,
        otherPreferredSeva: imported.otherPreferredSeva,
        preferredDepartments: imported.preferredDepartments,
        diwaliTime: imported.diwaliTime,
        annakutTime: imported.annakutTime,
        setupMondayTime: imported.setupMondayTime,
        windupTuesdayTime: imported.windupTuesdayTime,
        dbsCrecheStatus: imported.dbsCrecheStatus,
        crecheAvailableTimes: imported.crecheAvailableTimes,
        availability: imported.availability,
        crecheAvailability: imported.crecheAvailability,

        // IMPORTANT:
        // Preserve existing rota information
        id: existing.id,
        sid: existing.sid,
        status: existing.status,
        assignedShifts: existing.assignedShifts
      };
    });

    // Securely save all imported/updated sevaks
    const { data, error } = await supabase.rpc('admin_import_sevaks', {
      input_admin_sid: loggedInSevak.sid,
      input_sevaks: mergedSevaks.map(submissionToDb)
    });
    if (error) throw error;
    if (!data?.success) {
      throw new Error(data?.message || 'Import failed');
    }
    // Reload securely so the screen matches the database
    await loadAdminData(loggedInSevak.sid);

    const existingSidSet = new Set(
      submissions.map(sub =>
        sub.sid.trim().toUpperCase()
      )
    );

    const newCount = importedSevaks.filter(
      sub =>
        !existingSidSet.has(
          sub.sid.trim().toUpperCase()
        )
    ).length;

    const updatedCount =
      importedSevaks.length - newCount;

    setImportStatusMsg({
      text:
        `Successfully imported ${importedSevaks.length} sevak record(s): ` +
        `${newCount} new and ${updatedCount} updated.`,
      type: 'success'
    });

    setExcelPasteData('');
    setLastSynced(new Date().toLocaleTimeString());

  } catch (err) {
    console.error('Error importing Excel data:', err);

    setImportStatusMsg({
      text:
        'Failed to import the data. Please check the file format and try again.',
      type: 'error'
    });
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

  const handleImportCSVData = async () => {
  try {
    if (!importJsonText.trim()) return;

    const parsed = JSON.parse(importJsonText);

    if (!Array.isArray(parsed)) {
      setImportStatusMsg({
        text: 'Invalid JSON format. Please paste a valid JSON array.',
        type: 'error'
      });
      return;
    }

    const importedSevaks = parsed.map((item, idx) => {
      const sidRaw =
        item.sid ||
        `SID-${Math.floor(1000 + Math.random() * 9000)}`;

      const cleanSid = String(sidRaw)
        .trim()
        .toUpperCase()
        .startsWith('SID-')
          ? String(sidRaw).trim().toUpperCase()
          : `SID-${String(sidRaw).trim().toUpperCase()}`;

      return {
        id: `sub-import-${Date.now()}-${idx}`,
        sid: cleanSid,
        fullName: item.fullName || item.Name || 'New Sevak',
        email: item.email || item.Email || '',
        mandal:
          item.mandal ||
          'Yuvak Mandal (ages 22-35)',
        primaryPreferredSeva:
          item.primaryPreferredSeva ||
          'Unassigned',
        otherPreferredSeva:
          item.otherPreferredSeva || [],
        preferredDepartments:
          item.preferredDepartments ||
          ['No preference'],
        diwaliTime:
          item.diwaliTime || 'All Day',
        annakutTime:
          item.annakutTime || 'All Day',
        setupMondayTime:
          item.setupMondayTime || 'All Day',
        windupTuesdayTime:
          item.windupTuesdayTime || 'All Day',
        dbsCrecheStatus:
          item.dbsCrecheStatus || 'No',
        crecheAvailableTimes:
          item.crecheAvailableTimes || 'N/A',
        availability:
          item.availability || {
            diwali: ['All Day'],
            setup_windup: ['All Day'],
            annakut: ['All Day']
          },
        crecheAvailability:
          item.crecheAvailability ||
          item.dbsCrecheStatus ||
          'No',
        status: 'Pending',
        assignedShifts: []
      };
    });

    // If the SID already exists, update their details
    // but preserve their current rota allocations.
    const mergedSevaks = importedSevaks.map(imported => {
      const existing = submissions.find(
        sub =>
          sub.sid.trim().toUpperCase() ===
          imported.sid.trim().toUpperCase()
      );

      if (!existing) {
        return imported;
      }

      return {
        ...imported,

        // Preserve permanent identity and rota information
        id: existing.id,
        sid: existing.sid,
        status: existing.status,
        assignedShifts: existing.assignedShifts
      };
    });

    // Securely save permanently to Supabase
    const { data, error } = await supabase.rpc('admin_import_sevaks', {
      input_admin_sid: loggedInSevak.sid,
      input_sevaks: mergedSevaks.map(submissionToDb)
    });
    if (error) throw error;
    if (!data?.success) {
      throw new Error(data?.message || 'Import failed');
    }
    
    // Reload securely from Supabase
    await loadAdminData(loggedInSevak.sid);

    setImportJsonText('');
    setShowImportModal(false);

    setImportStatusMsg({
      text: `Successfully imported ${importedSevaks.length} sevak record(s).`,
      type: 'success'
    });

  } catch (error) {
    console.error('Error importing JSON data:', error);

    setImportStatusMsg({
      text:
        'Import failed. Please check the data and try again.',
      type: 'error'
    });
  }
};

  const handlePortalLogin = async (e) => {
  e.preventDefault();

  const cleanInput = portalSidInput.trim();

  if (!cleanInput) {
    setPortalMessage('Please enter your numeric Satsangi ID.');
    return;
  }

  try {
    // First check whether this SID exists and whether it is an admin
    const { data: loginData, error: loginError } = await supabase.rpc(
      'check_sid_login',
      {
        input_sid: cleanInput
      }
    );

    if (loginError) throw loginError;

    if (!loginData?.success) {
      setPortalMessage(
        'Invalid Satsangi ID (SID). Please enter your numeric ID.'
      );
      return;
    }

    // ADMIN LOGIN
    if (loginData.is_admin) {
      const { data: adminData, error: adminError } = await supabase.rpc(
        'get_admin_data',
        {
          input_sid: cleanInput
        }
      );

      if (adminError) throw adminError;

      if (!adminData?.success) {
        throw new Error(
          adminData?.message || 'Admin data could not be loaded'
        );
      }

      const loadedSubmissions = (adminData.submissions || []).map(
        submissionFromDb
      );

      const loadedShifts = (adminData.shifts || []).map(
        shiftFromDb
      );

      setSubmissions(loadedSubmissions);
      setShifts(loadedShifts);

      const adminSevak = loadedSubmissions.find(
        sub => sub.id === loginData.sevak_id
      );

      if (!adminSevak) {
        throw new Error('Admin sevak record could not be loaded');
      }

      setLoggedInSevak({
        ...adminSevak,
        isAdmin: true
      });
    }

    // NORMAL SEVAK LOGIN
    else {
      const { data: portalData, error: portalError } = await supabase.rpc(
        'get_sevak_portal_data',
        {
          input_sid: cleanInput
        }
      );

      if (portalError) throw portalError;

      if (!portalData?.success) {
        throw new Error(
          portalData?.message || 'Sevak portal could not be loaded'
        );
      }

      const sevak = submissionFromDb(portalData.sevak);

      setSubmissions([sevak]);

      setShifts(
        (portalData.shifts || []).map(shiftFromDb)
      );

      setLoggedInSevak({
        ...sevak,
        isAdmin: false
      });
    }

    setPortalMessage('');
    setActiveTab('portal');

  } catch (error) {
    console.error('SID login error:', error);

    setPortalMessage(
      'Unable to log in right now. Please try again.'
    );
  }
};

  const handleSyncMicrosoftForm = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSynced(new Date().toLocaleTimeString());
    }, 1000);
  };

  const assignVolunteerToShift = async (submissionId, shiftId) => {
  try {
    const shift = shifts.find(s => s.id === shiftId);
    const submission = submissions.find(s => s.id === submissionId);

    if (!shift || !submission) return;

    // Don't add the same sevak twice
    if (shift.assignedVolunteers.includes(submissionId)) return;

    const updatedShift = {
      ...shift,
      assignedVolunteers: [...shift.assignedVolunteers, submissionId]
    };

    const updatedSubmission = {
      ...submission,
      status: 'Assigned',
      assignedShifts: submission.assignedShifts.includes(shiftId)
        ? submission.assignedShifts
        : [...submission.assignedShifts, shiftId]
    };

    // Securely save the allocation through Supabase
    const { data, error } = await supabase.rpc('admin_assign_volunteer', {
      input_admin_sid: loggedInSevak.sid,
      input_submission_id: submissionId,
      input_shift_id: shiftId
    });
    
    if (error) throw error;
    
    if (!data?.success) {
      throw new Error(data?.message || 'Allocation failed');
    }

    // Update what is shown on screen
    setShifts(prevShifts =>
      prevShifts.map(s =>
        s.id === shiftId ? updatedShift : s
      )
    );

    setSubmissions(prevSubmissions =>
      prevSubmissions.map(s =>
        s.id === submissionId ? updatedSubmission : s
      )
    );

  } catch (error) {
    console.error('Error assigning volunteer:', error);
    alert('The allocation could not be saved. Please try again.');

    // Reload the real database data if something went wrong
    if (loggedInSevak?.isAdmin) {
      await loadAdminData(loggedInSevak.sid);
    } else {
      await loadData();
    }
  }
};
  
  const unassignVolunteerFromShift = async (submissionId, shiftId) => {
  try {
    const shift = shifts.find(s => s.id === shiftId);
    const submission = submissions.find(s => s.id === submissionId);

    if (!shift || !submission) return;

    const updatedShift = {
      ...shift,
      assignedVolunteers: shift.assignedVolunteers.filter(
        id => id !== submissionId
      ),
      leadVolunteerId:
        shift.leadVolunteerId === submissionId
          ? null
          : shift.leadVolunteerId
    };

    const updatedAssignedShifts = submission.assignedShifts.filter(
      id => id !== shiftId
    );

    const updatedSubmission = {
      ...submission,
      assignedShifts: updatedAssignedShifts,
      status: updatedAssignedShifts.length > 0 ? 'Assigned' : 'Pending'
    };
    
    // Securely save the unallocation through Supabase
    const { data, error } = await supabase.rpc('admin_unassign_volunteer', {
      input_admin_sid: loggedInSevak.sid,
      input_submission_id: submissionId,
      input_shift_id: shiftId
    });
    
    if (error) throw error;
    if (!data?.success) {
      throw new Error(data?.message || 'Unallocation failed');
    }

    // Update what is shown on screen
    setShifts(prevShifts =>
      prevShifts.map(s =>
        s.id === shiftId ? updatedShift : s
      )
    );

    setSubmissions(prevSubmissions =>
      prevSubmissions.map(s =>
        s.id === submissionId ? updatedSubmission : s
      )
    );

  } catch (error) {
    console.error('Error unassigning volunteer:', error);
    alert('The sevak could not be unallocated. Please try again.');

    // Restore what is actually stored in the database
    if (loggedInSevak?.isAdmin) {
      await loadAdminData(loggedInSevak.sid);
    } else {
      await loadData();
    }
  }
};

  const toggleLeadVolunteer = async (submissionId, shiftId) => {
  try {
    const shift = shifts.find(s => s.id === shiftId);

    if (!shift) return;

    // If this sevak is already the lead, remove them as lead.
    // Otherwise make them the lead.
    const updatedShift = {
      ...shift,
      leadVolunteerId:
        shift.leadVolunteerId === submissionId
          ? null
          : submissionId
    };

    // Securely save the Team Lead change through Supabase
    const { data, error } = await supabase.rpc('admin_toggle_team_lead', {
      input_admin_sid: loggedInSevak.sid,
      input_submission_id: submissionId,
      input_shift_id: shiftId
    });
    if (error) throw error;
    if (!data?.success) {
      throw new Error(data?.message || 'Team Lead change failed');
    }

    // Update what is shown on screen
    setShifts(prevShifts =>
      prevShifts.map(s =>
        s.id === shiftId ? updatedShift : s
      )
    );

  } catch (error) {
    console.error('Error changing team lead:', error);
    alert('The team lead could not be saved. Please try again.');

    // Restore the real database data if something went wrong
    if (loggedInSevak?.isAdmin) {
      await loadAdminData(loggedInSevak.sid);
    } else {
      await loadData();
    }
  }
};

  const handleDeleteVolunteer = async (submissionId) => {
  try {
    const { data, error } = await supabase.rpc('admin_delete_sevak', {
      input_admin_sid: loggedInSevak.sid,
      input_submission_id: submissionId
    });

    if (error) throw error;

    if (!data?.success) {
      throw new Error(data?.message || 'Sevak deletion failed');
    }

    setShifts(prevShifts =>
      prevShifts.map(shift => ({
        ...shift,
        assignedVolunteers: shift.assignedVolunteers.filter(
          id => id !== submissionId
        ),
        leadVolunteerId:
          shift.leadVolunteerId === submissionId
            ? null
            : shift.leadVolunteerId
      }))
    );

    setSubmissions(prevSubs =>
      prevSubs.filter(sub => sub.id !== submissionId)
    );

  } catch (error) {
    console.error('Error deleting sevak:', error);
    alert('The sevak could not be deleted. Please try again.');

    if (loggedInSevak?.isAdmin) {
      await loadAdminData(loggedInSevak.sid);
    } else {
      await loadData();
    }
  }
};
  
  const handleDeleteShiftFromMasterRota = async (shiftId) => {
  const shift = shifts.find(s => s.id === shiftId);
  if (!shift) return;

  try {
    const { data, error } = await supabase.rpc('admin_delete_shift', {
      input_admin_sid: loggedInSevak.sid,
      input_shift_id: shiftId
    });

    if (error) throw error;

    if (!data?.success) {
      throw new Error(data?.message || 'Shift deletion failed');
    }

    setSubmissions(prev =>
      prev.map(sub => {
        const updatedAssignedShifts = sub.assignedShifts.filter(
          id => id !== shiftId
        );

        return {
          ...sub,
          assignedShifts: updatedAssignedShifts,
          status:
            updatedAssignedShifts.length === 0
              ? 'Pending'
              : 'Assigned'
        };
      })
    );

    setShifts(prev =>
      prev.filter(s => s.id !== shiftId)
    );

  } catch (error) {
    console.error('Error deleting shift:', error);
    alert('The shift could not be deleted. Please try again.');

    if (loggedInSevak?.isAdmin) {
      await loadAdminData(loggedInSevak.sid);
    } else {
      await loadData();
    }
  }
};
  
  const handleCreateNewShift = async (e) => {
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

  try {
    const { data, error } = await supabase.rpc('admin_create_shift', {
      input_admin_sid: loggedInSevak.sid,
      input_shift: shiftToDb(createdShift)
    });

    if (error) throw error;

    if (!data?.success) {
      throw new Error(data?.message || 'Shift creation failed');
    }

    setShifts(prev => [...prev, createdShift]);

    setShowAddShiftModal(false);

    setNewShift({
      department: DEPARTMENTS[0],
      day: DAYS[0].id,
      title: '',
      timeSlot: '9am to 1pm',
      requiredVolunteers: 5
    });

  } catch (error) {
    console.error('Error creating shift:', error);
    alert('The new shift could not be saved. Please try again.');

    if (loggedInSevak?.isAdmin) {
      await loadAdminData(loggedInSevak.sid);
    } else {
      await loadData();
    }
  }
};
  
  const handleSaveShiftEdit = async (e) => {
    e.preventDefault();
    if (!editingShift) return;
    try {
      const { data, error } = await supabase.rpc('admin_update_shift', {
        input_admin_sid: loggedInSevak.sid,
        input_shift: shiftToDb(editingShift)
      });
      if (error) throw error;
      if (!data?.success) {
        throw new Error(data?.message || 'Shift update failed');
      }
      setShifts(prev =>
        prev.map(s =>
          s.id === editingShift.id ? editingShift : s
        )
    );

    setEditingShift(null);

  } catch (error) {
    console.error('Error saving shift:', error);
    alert('The shift changes could not be saved. Please try again.');

    if (loggedInSevak?.isAdmin) {
      await loadAdminData(loggedInSevak.sid);
    } else {
      await loadData();
    }
  }
};

  const handleSaveSevakDetails = async (e) => {
  e.preventDefault();

  if (!editingSevak) return;

  try {
    // Securely save the edited sevak details through Supabase
    const { data, error } = await supabase.rpc('admin_update_sevak', {
      input_admin_sid: loggedInSevak.sid,
      input_sevak: submissionToDb(editingSevak)
    });
    if (error) throw error;
    if (!data?.success) {
      throw new Error(data?.message || 'Sevak update failed');
    }

    // Update what is shown on screen
    setSubmissions(prev =>
      prev.map(s =>
        s.id === editingSevak.id ? editingSevak : s
      )
    );

    // Close the edit window
    setEditingSevak(null);

  } catch (error) {
    console.error('Error saving sevak details:', error);
    alert('The sevak details could not be saved. Please try again.');

    // Reload the real data from Supabase
    if (loggedInSevak?.isAdmin) {
      await loadAdminData(loggedInSevak.sid);
    } else {
      await loadData();
    }
  }
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
  <div className={`${!loggedInSevak ? 'max-w-4xl' : 'max-w-xl'} mx-auto space-y-6`}>
    {!loggedInSevak ? (
      <>
        {/* Annakut hero image */}
        <div className="w-full overflow-hidden rounded-3xl shadow-2xl">
          <img
            src="/annakut.banner.jpg"
            alt="BAPS Diwali and Annakut"
            className="w-full h-auto block"
          />
        </div>

        {/* SID login card */}
        <div
          className={`max-w-xl mx-auto p-6 sm:p-8 rounded-3xl border ${
            darkMode
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-amber-200'
          } shadow-2xl space-y-6 text-center`}
        >
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30">
              <KeyRound className="w-6 h-6" />
            </div>

            <h2
              className={`text-xl sm:text-2xl font-black ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
              >
              Jay Swaminarayan
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Enter your Satsangi ID (SID) to view your Seva Rota.
            </p>
          </div>

          <form onSubmit={handlePortalLogin} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="enter your SID"
                value={portalSidInput}
                onChange={e => setPortalSidInput(e.target.value)}
                className={`w-full px-4 py-3.5 rounded-2xl text-center font-mono font-bold text-base border outline-none transition-all ${
                  darkMode
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-500'
                    : 'bg-slate-50 border-amber-200 text-slate-900 focus:border-amber-500'
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
        </div>
      </>
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
                    Extract Sevak responses directly from your MS Forms Excel sheet (Name, SID, Mandal, Preferred Seva & Time slots) to automatically populate the Volunteer Allocation list.
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
                      Supports MS Forms exported spreadsheets containing Name, SID, Mandal, Preferred Seva & Time Slots
                    </p>
                  </div>
                </div>
              </div>

              {/* Option 2: Copy & Paste Cells Directly from Microsoft Excel */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Option 2: Copy & Paste Table Cells directly from Excel</span>
                  <span className="text-[10px] text-slate-400 font-normal">Headers: Name | SID | Mandal | Preferred Seva | Diwali | Annakut | Setup | Creche</span>
                </h3>

                <textarea
                  rows={5}
                  value={excelPasteData}
                  onChange={e => setExcelPasteData(e.target.value)}
                  placeholder={`Paste rows copied from Excel here...\n\nExample format:\nFull Name\tSID\tMandal\tPreferred Seva\tDiwali Available Time\tAnnakut Available Time\tSetup\tCrèche\nJayesh Patel\t31056\tYuvak Mandal\tParking, Catering\t9am to 1pm\t5pm to 10pm\t5pm to 10pm\tYes`}
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
                  <option value="ALL">All Statuses / Mandals</option>
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
                    } shadow-sm space-y-4 relative`}
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="space-y-1 w-full">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                            {sub.fullName}
                          </h3>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingSevak(sub)}
                              title="Edit Preferences & Availability"
                              className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-lg transition-all flex items-center gap-1 text-xs font-bold"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Edit Details</span>
                            </button>
                            <button
                              onClick={() => handleDeleteVolunteer(sub.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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

                    {/* MANUALLY EDITABLE / VIEWABLE PREFERENCES & AVAILABILITY */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-slate-800/50 border border-amber-200/60 dark:border-slate-700/60 text-xs space-y-2.5">
                      <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300 border-b border-amber-200/40 dark:border-slate-700/40 pb-1.5">
                        <span className="text-[11px] uppercase tracking-wider text-amber-800 dark:text-amber-400 font-extrabold">Sevak Details & Availability</span>
                        <button
                          onClick={() => setEditingSevak(sub)}
                          className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-semibold flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <strong className="text-slate-500 dark:text-slate-400 block">Primary Preferred Seva:</strong>
                          <span className="font-bold text-amber-700 dark:text-amber-300">
                            {sub.primaryPreferredSeva || sub.preferredDepartments?.[0] || 'Not specified'}
                          </span>
                        </div>

                        <div>
                          <strong className="text-slate-500 dark:text-slate-400 block">Other Preferred Seva:</strong>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {sub.otherPreferredSeva?.length > 0 
                              ? sub.otherPreferredSeva.join(', ') 
                              : (sub.preferredDepartments?.slice(1).join(', ') || 'None')}
                          </span>
                        </div>

                        <div>
                          <strong className="text-slate-500 dark:text-slate-400 block">Diwali Available Time:</strong>
                          <span className="text-slate-800 dark:text-slate-200">
                            {sub.diwaliTime || sub.availability?.diwali?.join(', ') || 'Not specified'}
                          </span>
                        </div>

                        <div>
                          <strong className="text-slate-500 dark:text-slate-400 block">Annakut Available Time:</strong>
                          <span className="text-slate-800 dark:text-slate-200">
                            {sub.annakutTime || sub.availability?.annakut?.join(', ') || 'Not specified'}
                          </span>
                        </div>

                        <div>
                          <strong className="text-slate-500 dark:text-slate-400 block">Annakut Setup (Mon 9th Nov):</strong>
                          <span className="text-slate-800 dark:text-slate-200">
                            {sub.setupMondayTime || sub.availability?.setup_windup?.join(', ') || 'Not specified'}
                          </span>
                        </div>

                        <div>
                          <strong className="text-slate-500 dark:text-slate-400 block">Annakut Windup (Tue 10th Nov):</strong>
                          <span className="text-slate-800 dark:text-slate-200">
                            {sub.windupTuesdayTime || 'Not specified'}
                          </span>
                        </div>

                        <div>
                          <strong className="text-slate-500 dark:text-slate-400 block">DBS Check & Crèche Available:</strong>
                          <span className={`font-bold ${
                            (sub.dbsCrecheStatus || sub.crecheAvailability) === 'Yes' 
                              ? 'text-emerald-600 dark:text-emerald-400' 
                              : 'text-slate-600 dark:text-slate-400'
                          }`}>
                            {sub.dbsCrecheStatus || sub.crecheAvailability || 'No'}
                          </span>
                        </div>

                        <div>
                          <strong className="text-slate-500 dark:text-slate-400 block">Crèche Available Times:</strong>
                          <span className="text-slate-800 dark:text-slate-200">
                            {sub.crecheAvailableTimes || 'N/A'}
                          </span>
                        </div>
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

                    {/* Day then Shift Two-Step Selection */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">
                        + Allocate New Rota Duty
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Step 1: Select Day */}
                        <select
                          value={currentDay}
                          onChange={e => setSelectedAllocationDays({ ...selectedAllocationDays, [sub.id]: e.target.value })}
                          className={`w-full px-2.5 py-2 rounded-xl text-xs font-bold border outline-none ${
                            darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
                          }`}
                        >
                          {DAYS.map(d => (
                            <option key={d.id} value={d.id}>{d.label.split('/')[0]}</option>
                          ))}
                        </select>

                        {/* Step 2: Select Relevant Shift for Selected Day */}
                        <select
                          onChange={e => {
                            if (e.target.value) {
                              assignVolunteerToShift(sub.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className={`w-full px-2.5 py-2 rounded-xl text-xs font-bold border outline-none ${
                            darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
                          }`}
                        >
                          <option value="">-- Select Shift --</option>
                          {dayShifts.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.department} ({s.timeSlot})
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

        {/* SECTION 4: MASTER ROTA */}
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

              <button
                onClick={() => setShowAddShiftModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add New Shift
              </button>
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
                          title="Edit Shift Details"
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteShiftFromMasterRota(shift.id)}
                          title="Delete Shift Completely"
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
                        <span className="font-bold text-amber-600 dark:text-amber-400">{shift.timeSlot}</span>
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

        {/* SECTION 5: RAG ANALYTICS & CALENDAR MATRIX VIEW */}
        {isAdminLoggedIn && activeTab === 'ragGaps' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm space-y-1`}>
                <div className="text-[10px] font-bold uppercase text-slate-400">Total Capacity Needed</div>
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

            {/* Interactive RAG Calendar Matrix with Dept Filter */}
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm space-y-6`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-500" /> Event RAG Calendar Schedule
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Filter by department and select day to review RAG coverage.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  {/* Department Filter for RAG */}
                  <select
                    value={ragDeptFilter}
                    onChange={e => setRagDeptFilter(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-amber-200 text-slate-800'
                    }`}
                  >
                    <option value="ALL">All Departments</option>
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>

                  {/* Day Navigation Tabs */}
                  <div className="flex items-center gap-1 bg-amber-100/50 dark:bg-slate-800 p-1 rounded-2xl overflow-x-auto">
                    {DAYS.map(day => (
                      <button
                        key={day.id}
                        onClick={() => setSelectedCalendarDay(day.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                          selectedCalendarDay === day.id
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                        }`}
                      >
                        {day.label.split('/')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* RAG Legend Banner */}
              <div className="flex flex-wrap items-center gap-4 text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-500">RAG Legend:</span>
                <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Green (Full Coverage)
                </span>
                <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Amber (Partial)
                </span>
                <span className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Red (Unassigned)
                </span>
              </div>

              {/* Time Slot Calendar Grid Matrix */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                      <th className="py-3 px-4 font-bold uppercase tracking-wider">Department</th>
                      {TIME_SLOTS.map(slot => (
                        <th key={slot} className="py-3 px-4 font-bold uppercase tracking-wider text-center">
                          {slot}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {filteredRagDepartments.map(dept => {
                      return (
                        <tr key={dept} className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                            {dept}
                          </td>
                          {TIME_SLOTS.map(slot => {
                            const shift = shifts.find(s => s.department === dept && s.day === selectedCalendarDay && s.timeSlot === slot);
                            if (!shift) return <td key={slot} className="text-center text-slate-300">-</td>;

                            const assignedCount = shift.assignedVolunteers.length;
                            const reqCount = shift.requiredVolunteers;
                            const gap = Math.max(0, reqCount - assignedCount);
                            const isFilled = assignedCount >= reqCount;

                            return (
                              <td key={slot} className="py-2 px-3 text-center">
                                <div className={`p-2.5 rounded-2xl border text-center space-y-1 ${
                                  isFilled
                                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                                    : assignedCount > 0
                                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-amber-300'
                                    : 'bg-rose-500/15 border-rose-500/40 text-rose-800 dark:text-rose-300'
                                }`}>
                                  <div className="font-black text-xs">
                                    {assignedCount} / {reqCount}
                                  </div>
                                  <div className="text-[10px] font-bold">
                                    {isFilled ? (
                                      <span className="text-emerald-600 dark:text-emerald-400">100% Full</span>
                                    ) : (
                                      <span className="text-rose-600 dark:text-rose-400">{gap} Needed</span>
                                    )}
                                  </div>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* EDIT SEVAK DETAILS MODAL */}
      {editingSevak && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className={`w-full max-w-lg p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-amber-200 text-slate-800'} shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold">Edit Sevak Details & Preferences</h3>
                <p className="text-xs text-slate-400">{editingSevak.fullName} ({editingSevak.sid})</p>
              </div>
              <button onClick={() => setEditingSevak(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSevakDetails} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block font-bold text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingSevak.fullName}
                  onChange={e => setEditingSevak({ ...editingSevak, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Primary Preferred Seva</label>
                <select
                  value={editingSevak.primaryPreferredSeva || ''}
                  onChange={e => setEditingSevak({ ...editingSevak, primaryPreferredSeva: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-amber-500"
                >
                  <option value="" className="dark:bg-slate-900">Select Primary Preferred Department</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept} className="dark:bg-slate-900">{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Other Preferred Seva Departments (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Parking, Housekeeping, Catering/Food stalls"
                  value={editingSevak.otherPreferredSeva ? editingSevak.otherPreferredSeva.join(', ') : (editingSevak.preferredDepartments?.slice(1).join(', ') || '')}
                  onChange={e => setEditingSevak({ 
                    ...editingSevak, 
                    otherPreferredSeva: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Diwali Available Time</label>
                <input
                  type="text"
                  placeholder="e.g. 9am to 1pm, 1pm to 5pm"
                  value={editingSevak.diwaliTime || (editingSevak.availability?.diwali ? editingSevak.availability.diwali.join(', ') : '')}
                  onChange={e => setEditingSevak({
                    ...editingSevak,
                    diwaliTime: e.target.value,
                    availability: {
                      ...editingSevak.availability,
                      diwali: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    }
                  })}
                  className="w-full px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Annakut Available Time</label>
                <input
                  type="text"
                  placeholder="e.g. 1pm to 5pm, 5pm to 10pm"
                  value={editingSevak.annakutTime || (editingSevak.availability?.annakut ? editingSevak.availability.annakut.join(', ') : '')}
                  onChange={e => setEditingSevak({
                    ...editingSevak,
                    annakutTime: e.target.value,
                    availability: {
                      ...editingSevak.availability,
                      annakut: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    }
                  })}
                  className="w-full px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Availability for Annakut Setup (Monday 9th November)</label>
                <input
                  type="text"
                  placeholder="e.g. 9am to 1pm, 5pm to 10pm"
                  value={editingSevak.setupMondayTime || (editingSevak.availability?.setup_windup ? editingSevak.availability.setup_windup.join(', ') : '')}
                  onChange={e => setEditingSevak({
                    ...editingSevak,
                    setupMondayTime: e.target.value,
                    availability: {
                      ...editingSevak.availability,
                      setup_windup: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    }
                  })}
                  className="w-full px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Availability for Annakut Windup (Tuesday 10th November)</label>
                <input
                  type="text"
                  placeholder="e.g. 5pm to 10pm, 9pm to 11pm"
                  value={editingSevak.windupTuesdayTime || ''}
                  onChange={e => setEditingSevak({
                    ...editingSevak,
                    windupTuesdayTime: e.target.value
                  })}
                  className="w-full px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">DBS Check & Available for Crèche</label>
                <select
                  value={editingSevak.dbsCrecheStatus || editingSevak.crecheAvailability || 'No'}
                  onChange={e => setEditingSevak({ 
                    ...editingSevak, 
                    dbsCrecheStatus: e.target.value,
                    crecheAvailability: e.target.value 
                  })}
                  className="w-full px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-amber-500"
                >
                  <option value="Yes" className="dark:bg-slate-900">Yes</option>
                  <option value="No" className="dark:bg-slate-900">No</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">If Yes, Times Available for Crèche</label>
                <input
                  type="text"
                  placeholder="e.g. 9am to 1pm, 1pm to 5pm"
                  value={editingSevak.crecheAvailableTimes || ''}
                  onChange={e => setEditingSevak({ ...editingSevak, crecheAvailableTimes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSevak(null)}
                  className="px-4 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-amber-500 text-white rounded-xl shadow-md hover:bg-amber-600"
                >
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Shift Modal */}
      {showAddShiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-amber-200 text-slate-800'} shadow-2xl space-y-4`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold">Add New Master Shift</h3>
              <button onClick={() => setShowAddShiftModal(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewShift} className="space-y-3 text-xs font-medium">
              <div>
                <label className="block font-bold text-slate-500 mb-1">Department</label>
                <select
                  value={newShift.department}
                  onChange={e => setNewShift({ ...newShift, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border bg-transparent"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d} className="dark:bg-slate-900">{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Event Day</label>
                <select
                  value={newShift.day}
                  onChange={e => setNewShift({ ...newShift, day: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border bg-transparent"
                >
                  {DAYS.map(d => (
                    <option key={d.id} value={d.id} className="dark:bg-slate-900">{d.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Shift Time Slot</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9am to 1pm or 6pm to 9pm"
                  value={newShift.timeSlot}
                  onChange={e => setNewShift({ ...newShift, timeSlot: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border bg-transparent"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Shift Title (Optional)</label>
                <input
                  type="text"
                  placeholder="Custom Shift Title"
                  value={newShift.title}
                  onChange={e => setNewShift({ ...newShift, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border bg-transparent"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Required Capacity</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={newShift.requiredVolunteers}
                  onChange={e => setNewShift({ ...newShift, requiredVolunteers: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border bg-transparent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddShiftModal(false)}
                  className="px-4 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-amber-500 text-white rounded-xl shadow-md"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-amber-200 text-slate-800'} shadow-2xl space-y-4`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold">Edit Shift Details</h3>
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
                  className="w-full px-3 py-2 rounded-xl text-xs font-medium border bg-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Actual Shift Time</label>
                <input
                  type="text"
                  value={editingShift.timeSlot}
                  onChange={e => setEditingShift({ ...editingShift, timeSlot: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs font-medium border bg-transparent"
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
                  className="w-full px-3 py-2 rounded-xl text-xs font-medium border bg-transparent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingShift(null)}
                  className="px-4 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-amber-500 text-white rounded-xl"
                >
                  Save Changes
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
              className="w-full p-3 rounded-xl text-xs font-mono border outline-none bg-transparent"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl"
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
