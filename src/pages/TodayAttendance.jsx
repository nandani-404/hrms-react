import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, CheckCircle, Clock, XCircle, Umbrella, Search, Filter, 
  Upload, Plus, TrendingUp, TrendingDown, ChevronLeft, ChevronRight,
  MoreVertical, Edit, X, Download, FileText
} from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useTodayAttendance } from '../hooks/useAttendance'
import { useDepartments } from '../hooks/useEmployees'
import api from '../services/api'

// Helper to safely parse dates across browsers
const parseDateSafe = (dateStr) => {
  if (!dateStr) return null;
  const formattedStr = dateStr.includes(' ') ? dateStr.replace(' ', 'T') : dateStr;
  const d = new Date(formattedStr);
  return isNaN(d.getTime()) ? null : d;
};

// Main Component: TodayAttendance
const TodayAttendance = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const isHRorAdmin = user?.role === 'hr' || user?.role === 'super_admin' || user?.role === 'admin';
  const isSuperAdmin = user?.role === 'super_admin';

  // Edit states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [checkInInput, setCheckInInput] = useState("");
  const [checkOutInput, setCheckOutInput] = useState("");
  const [statusInput, setStatusInput] = useState("");
  const [remarkInput, setRemarkInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Export & Upload states/modals
  const [showExportModal, setShowExportModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [exportMonth, setExportMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [exportDept, setExportDept] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Filter translation mapping
  const filterParam = {
    "": "",
    present: "todayPresent",
    absent: "todayAbsent",
    wfh: "todayWFH",
    on_leave: "todayOnLeave"
  }[filterStatus] || "";

  // Queries
  const { data: attendanceResponse, isLoading: isAttendanceLoading } = useTodayAttendance(filterParam);
  const { data: departmentsResponse, isLoading: isDepartmentsLoading } = useDepartments();

  const summary = attendanceResponse?.summary || {};
  const rawRecords = Array.isArray(attendanceResponse?.data) ? attendanceResponse.data : [];
  const departments = Array.isArray(departmentsResponse) ? departmentsResponse : departmentsResponse?.departments || [];

  // Computed summary metrics
  const totalEmployees = summary.total_records || rawRecords.length || 320;
  const presentCount = summary.total_present || 256;
  const lateCount = summary.total_late || summary.total_wfh || 32;
  const absentCount = summary.total_absent || 32;
  const leaveCount = summary.total_on_leave || 18;

  const presentPct = Math.round((presentCount / totalEmployees) * 100) || 80;
  const latePct = Math.round((lateCount / totalEmployees) * 100) || 10;
  const absentPct = Math.round((absentCount / totalEmployees) * 100) || 10;
  const leavePct = Math.round((leaveCount / totalEmployees) * 100) || 6;

  // Filter records by search term & selected department
  const filteredRecords = rawRecords.filter(rec => {
    const dept = rec.employee?.department?.name || rec.department || '';
    if (selectedDeptFilter && dept.toLowerCase() !== selectedDeptFilter.toLowerCase()) {
      return false;
    }
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const empName = rec.employee?.full_name?.toLowerCase() || '';
    const empId = String(rec.employee_id || '').toLowerCase();
    return empName.includes(term) || empId.includes(term) || dept.toLowerCase().includes(term);
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusStyle = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'present') return "bg-green-100 text-green-700 border border-green-200";
    if (s === 'late') return "bg-amber-100 text-amber-700 border border-amber-200";
    if (s === 'absent') return "bg-red-100 text-red-700 border border-red-200";
    if (s === 'on_leave' || s === 'leave') return "bg-purple-100 text-purple-700 border border-purple-200";
    return "bg-gray-100 text-gray-700 border border-gray-200";
  };

  const handleEditClick = (record) => {
    setEditingRecord(record);
    const checkinDate = parseDateSafe(record.checkin_time);
    const checkoutDate = parseDateSafe(record.checkout_time);
    setCheckInInput(checkinDate ? format(checkinDate, "HH:mm") : "");
    setCheckOutInput(checkoutDate ? format(checkoutDate, "HH:mm") : "");
    setStatusInput(record.attendance_status || "present");
    setRemarkInput("");
    setShowEditModal(true);
  };

  const handleUpdateSubmit = async () => {
    if (!checkInInput) {
      toast.error("Check-in time is required");
      return;
    }
    if (!remarkInput || remarkInput.trim().length < 3) {
      toast.error("Please provide a remark (minimum 3 characters)");
      return;
    }
    setIsUpdating(true);
    try {
      const checkinTime = `${editingRecord.date} ${checkInInput}:00`;
      const checkoutTime = checkOutInput ? `${editingRecord.date} ${checkOutInput}:00` : null;

      const response = await api.put(`/attendance/${editingRecord.id}`, {
        checkin_time: checkinTime,
        checkout_time: checkoutTime,
        attendance_status: statusInput,
        remark: `${editingRecord.remark || ""} [HR Update] ${remarkInput}`.trim()
      });

      if (response.status === 200 || response.data?.success) {
        toast.success("Attendance updated successfully!");
        setShowEditModal(false);
        setEditingRecord(null);
        window.location.reload();
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "Failed to update attendance");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExport = async () => {
    if (!exportMonth) {
      toast.error("Please select a month to export");
      return;
    }
    setIsExporting(true);
    try {
      const monthStart = format(new Date(exportMonth + "-01"), "yyyy-MM-dd");
      const monthEnd = format(new Date(new Date(exportMonth + "-01").getFullYear(), new Date(exportMonth + "-01").getMonth() + 1, 0), "yyyy-MM-dd");
      
      const params = new URLSearchParams({
        start_date: monthStart,
        end_date: monthEnd,
        ...(exportDept && { department_id: exportDept })
      });

      const response = await api.get(`/attendance/detailed-export?${params.toString()}`, {
        responseType: "blob"
      });

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `detailed_attendance_${exportMonth}_dept_${exportDept || "all"}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Detailed attendance report exported successfully!");
      setShowExportModal(false);
    } catch (err) {
      console.error("Export error:", err);
      toast.error(err.response?.data?.message || "Failed to export detailed report");
    } finally {
      setIsExporting(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error("Please select a CSV or Excel file");
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("uploaded_by", user?.full_name || "HR");
      formData.append("approved_by", user?.full_name || "HR");

      const response = await api.post("/approved-attendance/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        const stats = response.data.data;
        toast.success(`Upload successful! Created: ${stats.created}, Updated: ${stats.updated}, Errors: ${stats.errors}`, { duration: 5000 });
        setUploadFile(null);
        setShowUploadModal(false);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  if (isAttendanceLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2 md:p-6 bg-slate-50 min-h-screen">
      {/* Header section with title and action buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Attendance</h1>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-gray-700">Attendance</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-1.5 text-xs text-gray-700 font-medium">
            <span className="text-gray-400">📅</span>
            <span>{format(new Date(), "dd MMM yyyy")}</span>
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowFilterModal(prev => !prev)}
              className={`flex items-center gap-1.5 border rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                filterStatus || selectedDeptFilter
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5 text-gray-500" />
              <span>Filter</span>
              {(filterStatus || selectedDeptFilter) && (
                <span className="w-2 h-2 rounded-full bg-blue-600 ml-0.5" />
              )}
            </button>

            {/* Filter Dropdown Popover */}
            <AnimatePresence>
              {showFilterModal && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 4 }}
                  className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-xl z-30 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h4 className="text-xs font-bold text-gray-900">Filter Attendance</h4>
                    <button
                      onClick={() => {
                        setFilterStatus('')
                        setSelectedDeptFilter('')
                      }}
                      className="text-[11px] font-semibold text-blue-600 hover:underline"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="block text-gray-600 font-semibold mb-1">Status</label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 bg-gray-50/50"
                      >
                        <option value="">All Statuses</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="wfh">WFH</option>
                        <option value="on_leave">On Leave</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-600 font-semibold mb-1">Department</label>
                      <select
                        value={selectedDeptFilter}
                        onChange={(e) => setSelectedDeptFilter(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 bg-gray-50/50"
                      >
                        <option value="">All Departments</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => setShowFilterModal(false)}
                      className="w-full py-1.5 bg-blue-600 text-white font-semibold rounded-lg text-xs hover:bg-blue-700 transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isHRorAdmin && (
            <>
              <button 
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-1.5 bg-white border border-gray-200 rounded px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                <Upload className="w-3.5 h-3.5 text-gray-500" />
                <span>Import Attendance</span>
              </button>

              <button 
                onClick={() => navigate('/attendance')}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded px-3.5 py-1.5 text-xs font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Mark Attendance</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Top 5 Stat Cards - Minimal & Classic with Proper Padding */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Employees */}
        <div className="bg-white rounded-lg p-5 border border-gray-200 flex items-center justify-between min-h-[96px]">
          <div>
            <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Total Employees</p>
            <p className="text-2xl font-bold text-gray-900 mt-1.5">{totalEmployees}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 text-gray-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Present */}
        <div className="bg-white rounded-lg p-5 border border-gray-200 flex items-center justify-between min-h-[96px]">
          <div>
            <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Present</p>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-bold text-gray-900">{presentCount}</span>
              <span className="text-xs font-bold text-emerald-600">({presentPct}%)</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Late */}
        <div className="bg-white rounded-lg p-5 border border-gray-200 flex items-center justify-between min-h-[96px]">
          <div>
            <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Late</p>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-bold text-gray-900">{lateCount}</span>
              <span className="text-xs font-bold text-amber-600">({latePct}%)</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Absent */}
        <div className="bg-white rounded-lg p-5 border border-gray-200 flex items-center justify-between min-h-[96px]">
          <div>
            <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Absent</p>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-bold text-gray-900">{absentCount}</span>
              <span className="text-xs font-bold text-rose-600">({absentPct}%)</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        {/* On Leave */}
        <div className="bg-white rounded-lg p-5 border border-gray-200 flex items-center justify-between min-h-[96px]">
          <div>
            <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">On Leave</p>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-bold text-gray-900">{leaveCount}</span>
              <span className="text-xs font-bold text-purple-600">({leavePct}%)</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0">
            <Umbrella className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Middle Row: Classic Charts & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Attendance Overview (Line Chart) */}
        <div className="lg:col-span-5 bg-white rounded-lg p-5 border border-gray-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900">Attendance Overview</h3>
            <select className="text-xs font-medium text-gray-600 border border-gray-200 rounded px-2.5 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-gray-300">
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>

          {/* SVG Line Chart */}
          <div className="relative w-full h-44 my-1">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <line x1="0" y1="40" x2="500" y2="40" stroke="#f3f4f6" strokeWidth="1" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#f3f4f6" strokeWidth="1" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#f3f4f6" strokeWidth="1" />

              <defs>
                <linearGradient id="presentGradMinimal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 20 120 Q 70 90 100 100 T 180 80 T 260 110 T 340 70 T 420 50 T 480 75"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 20 120 Q 70 90 100 100 T 180 80 T 260 110 T 340 70 T 420 50 T 480 75 V 190 H 20 Z"
                fill="url(#presentGradMinimal)"
              />
              {[
                {x:20, y:120},{x:100, y:100},{x:180, y:80},{x:260, y:110},{x:340, y:70},{x:420, y:50},{x:480, y:75}
              ].map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#10b981" />
              ))}

              <path
                d="M 20 160 Q 70 155 100 150 T 180 152 T 260 165 T 340 150 T 420 145 T 480 155"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
              />

              <path
                d="M 20 180 Q 70 175 100 170 T 180 178 T 260 182 T 340 172 T 420 170 T 480 175"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className="flex justify-between text-[11px] font-semibold text-gray-400 px-1 pt-2 border-t border-gray-100">
            <span>1 May</span>
            <span>5 May</span>
            <span>10 May</span>
            <span>15 May</span>
            <span>20 May</span>
            <span>25 May</span>
            <span>31 May</span>
          </div>

          <div className="flex items-center justify-center gap-6 mt-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-gray-600">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-xs font-semibold text-gray-600">Late</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-xs font-semibold text-gray-600">Absent</span>
            </div>
          </div>
        </div>

        {/* Today's Attendance (Donut Chart Top, Legend Below) */}
        <div className="lg:col-span-4 bg-white rounded-lg p-5 border border-gray-200 flex flex-col items-center">
          <h3 className="text-sm font-bold text-gray-900 mb-4 w-full text-left">Today's Attendance</h3>

          {/* Donut Chart (Top) */}
          <div className="relative w-44 h-44 flex items-center justify-center shrink-0 mb-5">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="38" stroke="#f3f4f6" strokeWidth="14" fill="transparent" />
              <circle
                cx="50" cy="50" r="38"
                stroke="#10b981" strokeWidth="14" fill="transparent"
                strokeDasharray="238.7" strokeDashoffset="47.7"
              />
              <circle
                cx="50" cy="50" r="38"
                stroke="#f59e0b" strokeWidth="14" fill="transparent"
                strokeDasharray="238.7" strokeDashoffset="214.8"
                className="transform origin-center rotate-[288deg]"
              />
              <circle
                cx="50" cy="50" r="38"
                stroke="#ef4444" strokeWidth="14" fill="transparent"
                strokeDasharray="238.7" strokeDashoffset="214.8"
                className="transform origin-center rotate-[324deg]"
              />
              <circle
                cx="50" cy="50" r="38"
                stroke="#a855f7" strokeWidth="14" fill="transparent"
                strokeDasharray="238.7" strokeDashoffset="224.3"
                className="transform origin-center rotate-[360deg]"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold text-gray-900 leading-none">{totalEmployees}</span>
              <span className="text-[11px] font-semibold text-gray-400 mt-1">Total</span>
            </div>
          </div>

          {/* Legend Statistics (Vertical Stack - Under by Under Left Aligned) */}
          <div className="w-full space-y-2.5 text-xs pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="text-gray-600 font-medium">Present</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-gray-900 mr-1.5">258</span>
                <span className="text-gray-400 text-[11px]">(80%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                <span className="text-gray-600 font-medium">Late</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-gray-900 mr-1.5">32</span>
                <span className="text-gray-400 text-[11px]">(10%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                <span className="text-gray-600 font-medium">Absent</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-gray-900 mr-1.5">32</span>
                <span className="text-gray-400 text-[11px]">(10%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0"></span>
                <span className="text-gray-600 font-medium">On Leave</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-gray-900 mr-1.5">18</span>
                <span className="text-gray-400 text-[11px]">(6%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-400 shrink-0"></span>
                <span className="text-gray-600 font-medium">Holiday</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-gray-900 mr-1.5">12</span>
                <span className="text-gray-400 text-[11px]">(4%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Insights Panel - Full Height, Tall Inner Cards */}
        <div className="lg:col-span-3 bg-white rounded-lg p-4 border border-gray-200 flex flex-col h-full">
          <h3 className="text-sm font-bold text-gray-900 mb-3 shrink-0">Attendance Insights</h3>

          <div className="flex-1 flex flex-col gap-3 justify-between">
            {/* Best Attendance */}
            <div className="flex-1 flex items-center justify-between px-3 py-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100/80 hover:bg-emerald-50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 leading-tight">Best Attendance</p>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">Marketing Dept</p>
                </div>
              </div>
              <span className="text-sm font-extrabold text-gray-900 ml-1.5 whitespace-nowrap">92%</span>
            </div>

            {/* Lowest Attendance */}
            <div className="flex-1 flex items-center justify-between px-3 py-3.5 rounded-xl bg-amber-50/50 border border-amber-100/80 hover:bg-amber-50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0">
                  <TrendingDown className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 leading-tight">Lowest Attendance</p>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">Sales Dept</p>
                </div>
              </div>
              <span className="text-sm font-extrabold text-gray-900 ml-1.5 whitespace-nowrap">68%</span>
            </div>

            {/* Average Working Hours */}
            <div className="flex-1 flex items-center justify-between px-3 py-3.5 rounded-xl bg-blue-50/50 border border-blue-100/80 hover:bg-blue-50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 leading-tight">Avg Working Hours</p>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">All Departments</p>
                </div>
              </div>
              <span className="text-sm font-extrabold text-gray-900 ml-1.5 whitespace-nowrap">8h 24m</span>
            </div>

            {/* Total Working Days */}
            <div className="flex-1 flex items-center justify-between px-3 py-3.5 rounded-xl bg-purple-50/50 border border-purple-100/80 hover:bg-purple-50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-purple-100/80 text-purple-700 flex items-center justify-center shrink-0">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 leading-tight">Total Working Days</p>
                  <p className="text-[10px] text-gray-500 font-medium mt-0.5">Current Month</p>
                </div>
              </div>
              <span className="text-sm font-extrabold text-gray-900 ml-1.5 whitespace-nowrap">22 Days</span>
            </div>
          </div>
        </div>

      </div>

      {/* Attendance Records Table Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Attendance Records</h2>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search employee..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-white"
              />
            </div>

            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">EMPLOYEE ID</th>
                <th className="py-3.5 px-4">NAME</th>
                <th className="py-3.5 px-4">DEPARTMENT</th>
                <th className="py-3.5 px-4">CHECK IN</th>
                <th className="py-3.5 px-4">CHECK OUT</th>
                <th className="py-3.5 px-4">WORK HOURS</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs md:text-sm font-medium text-slate-700">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No attendance records found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((rec) => {
                  const checkinDate = parseDateSafe(rec.checkin_time);
                  const checkoutDate = parseDateSafe(rec.checkout_time);
                  const checkInStr = checkinDate ? format(checkinDate, "hh:mm a") : (rec.checkin_time || "09:05 AM");
                  const checkOutStr = checkoutDate ? format(checkoutDate, "hh:mm a") : (rec.checkout_time || (rec.attendance_status === 'absent' ? '-' : '06:12 PM'));
                  const empId = rec.employee_id || rec.emp_id || "EMP001";
                  const empName = rec.employee?.full_name || "Rahul Sharma";
                  const dept = rec.employee?.department?.name || rec.department || "IT";
                  const workHours = rec.work_hours || (rec.attendance_status === 'absent' ? '-' : "9h 07m");
                  const status = rec.attendance_status || "present";

                  return (
                    <tr key={rec.id || empId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-semibold text-slate-900">{empId}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={rec.employee?.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${empName}`}
                            alt={empName}
                            className="w-8 h-8 rounded-full object-cover bg-slate-100"
                          />
                          <span className="font-semibold text-slate-900">{empName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600">{dept}</td>
                      <td className="py-4 px-4 text-slate-600">{checkInStr}</td>
                      <td className="py-4 px-4 text-slate-600">{checkOutStr}</td>
                      <td className="py-4 px-4 text-slate-600">{workHours}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full capitalize ${getStatusStyle(status)}`}>
                          {status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {isHRorAdmin ? (
                          <button
                            onClick={() => handleEditClick(rec)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Pagination */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <div>
            Showing 1 to {Math.min(paginatedRecords.length, itemsPerPage)} of {totalEmployees} employees
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-8 h-8 rounded-lg border font-semibold ${
                  currentPage === num
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {num}
              </button>
            ))}

            <span className="px-1 text-slate-400">...</span>

            <button
              onClick={() => setCurrentPage(64)}
              className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
            >
              64
            </button>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Attendance Modal */}
      <AnimatePresence>
        {showEditModal && editingRecord && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Attendance Record</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {editingRecord.employee?.full_name || editingRecord.employee_id}
                  </p>
                </div>
                <button onClick={() => setShowEditModal(false)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Check In Time</label>
                  <input
                    type="time"
                    value={checkInInput}
                    onChange={e => setCheckInInput(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Check Out Time</label>
                  <input
                    type="time"
                    value={checkOutInput}
                    onChange={e => setCheckOutInput(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={statusInput}
                    onChange={e => setStatusInput(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="present">Present</option>
                    <option value="late">Late</option>
                    <option value="absent">Absent</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Remark *</label>
                  <textarea
                    value={remarkInput}
                    onChange={e => setRemarkInput(e.target.value)}
                    placeholder="Reason for change..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2 text-sm font-semibold border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSubmit}
                  disabled={isUpdating}
                  className="flex-1 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Export Detailed Attendance</h3>
                <button onClick={() => setShowExportModal(false)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Month</label>
                <input
                  type="month"
                  value={exportMonth}
                  onChange={e => setExportMonth(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                <select
                  value={exportDept}
                  onChange={e => setExportDept(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                >
                  <option value="">All Departments</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowExportModal(false)} className="flex-1 py-2 text-sm font-semibold border border-slate-300 rounded-lg">
                  Cancel
                </button>
                <button onClick={handleExport} disabled={isExporting} className="flex-1 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg">
                  {isExporting ? "Exporting..." : "Download CSV"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Import Attendance File</h3>
                <button onClick={() => setShowUploadModal(false)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Select Excel / CSV File</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv, .xls, .xlsx"
                  onChange={e => setUploadFile(e.target.files[0])}
                  className="w-full text-xs text-slate-600 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowUploadModal(false)} className="flex-1 py-2 text-sm font-semibold border border-slate-300 rounded-lg">
                  Cancel
                </button>
                <button onClick={handleUpload} disabled={isUploading || !uploadFile} className="flex-1 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg disabled:opacity-50">
                  {isUploading ? "Uploading..." : "Upload File"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TodayAttendance;

