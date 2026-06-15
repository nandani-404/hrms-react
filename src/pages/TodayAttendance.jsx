import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, CheckCircle, XCircle, Home, Calendar, 
  Edit, X, Download, Upload, FileSpreadsheet, FileText
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

// Sub-component: Export Monthly Attendance
const ExportMonthlyAttendance = ({ departments = [], departmentsLoading = false, title, description }) => {
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [departmentId, setDepartmentId] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!month) {
      toast.error("Please select a month to export");
      return;
    }
    setIsExporting(true);
    try {
      const monthStart = format(new Date(month + "-01"), "yyyy-MM-dd");
      const monthEnd = format(new Date(new Date(month + "-01").getFullYear(), new Date(month + "-01").getMonth() + 1, 0), "yyyy-MM-dd");
      
      const params = new URLSearchParams({
        start_date: monthStart,
        end_date: monthEnd,
        ...(departmentId && { department_id: departmentId })
      });

      const response = await api.get(`/attendance/detailed-export?${params.toString()}`, {
        responseType: "blob"
      });

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `detailed_attendance_${month}_dept_${departmentId || "all"}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Detailed attendance report exported successfully!");
    } catch (err) {
      console.error("Export error:", err);
      toast.error(err.response?.data?.message || "Failed to export detailed report");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
          <Download className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-base md:text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-xs md:text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
          <input
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
          <select
            value={departmentId}
            onChange={e => setDepartmentId(e.target.value)}
            disabled={departmentsLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 bg-white"
          >
            <option value="">{departmentsLoading ? "Loading departments..." : "All Departments"}</option>
            {departments && departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            {isExporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Sub-component: Upload Revised Attendance
const UploadRevisedAttendance = ({ title, description }) => {
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [file, setFile] = useState(null);
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".csv")) {
        toast.error("Please select a CSV file");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!month) {
      toast.error("Please select a month");
      return;
    }
    if (!file) {
      toast.error("Please select a CSV file");
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("month", month);
      formData.append("uploaded_by", "HR");
      formData.append("approved_by", "HR");
      formData.append("replace_existing", replaceExisting ? "1" : "0");

      const response = await api.post("/approved-attendance/upload-csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.data.success) {
        const stats = response.data.data;
        toast.success(`Upload successful! Created: ${stats.created}, Updated: ${stats.updated}, Errors: ${stats.errors}`, {
          duration: 5000
        });
        setFile(null);
        setReplaceExisting(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.message || "Failed to upload CSV");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
          <Upload className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-base md:text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-xs md:text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
            <input
              type="month"
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">CSV File</label>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload-input"
              />
              <label
                htmlFor="csv-upload-input"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors bg-white"
              >
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 truncate">
                  {file ? file.name : "Choose CSV file"}
                </span>
              </label>
              {file && (
                <button
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={replaceExisting}
              onChange={e => setReplaceExisting(e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm text-gray-700 font-medium">Replace existing records for this month</span>
          </label>
          <button
            onClick={handleUpload}
            disabled={isUploading || !file}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? "Uploading..." : "Upload CSV"}
          </button>
        </div>
        <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>Note:</strong> The CSV file should match the exported format with columns: 
            Employee ID, Employee Name, Department, Email, Mobile, Designation, Date, Punch In, Punch Out, Work Hours, Status, Shift, Manual Entry, Remark.
          </p>
        </div>
      </div>
    </div>
  );
};

// Main Component: TodayAttendance
const TodayAttendance = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState("");
  const isHRorAdmin = user?.role === 'hr' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';

  // Edit states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [checkInInput, setCheckInInput] = useState("");
  const [checkOutInput, setCheckOutInput] = useState("");
  const [statusInput, setStatusInput] = useState("");
  const [remarkInput, setRemarkInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

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
  const records = Array.isArray(attendanceResponse?.data) ? attendanceResponse.data : [];
  const departments = Array.isArray(departmentsResponse) ? departmentsResponse : departmentsResponse?.departments || [];

  const getStatusColor = (status) => {
    return {
      present: "bg-green-100 text-green-700",
      absent: "bg-red-100 text-red-700",
      wfh: "bg-purple-100 text-purple-700",
      on_leave: "bg-yellow-100 text-yellow-700"
    }[status] || "bg-gray-100 text-gray-700";
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
        setCheckInInput("");
        setCheckOutInput("");
        setStatusInput("");
        setRemarkInput("");
        window.location.reload();
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "Failed to update attendance");
    } finally {
      setIsUpdating(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, status, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => setFilterStatus(filterStatus === status ? "" : status)}
      className={`rounded-xl shadow-sm border p-6 cursor-pointer transition-all ${color} ${
        filterStatus === status ? "ring-2 ring-offset-2 ring-blue-500" : "hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="opacity-20">
          <Icon className="w-12 h-12" />
        </div>
      </div>
    </motion.div>
  );

  if (isAttendanceLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Today's Attendance</h1>
        <p className="text-gray-600 mt-1">{format(new Date(), "EEEE, MMMM dd, yyyy")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={Users}
          label="Total Records"
          value={summary.total_records || 0}
          status=""
          color="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-900 border-blue-200"
        />
        <StatCard
          icon={CheckCircle}
          label="Present"
          value={summary.total_present || 0}
          status="present"
          color="bg-gradient-to-br from-green-50 to-green-100 text-green-900 border-green-200"
        />
        <StatCard
          icon={XCircle}
          label="Absent"
          value={summary.total_absent || 0}
          status="absent"
          color="bg-gradient-to-br from-red-50 to-red-100 text-red-900 border-red-200"
        />
        <StatCard
          icon={Home}
          label="Work From Home"
          value={summary.total_wfh || 0}
          status="wfh"
          color="bg-gradient-to-br from-purple-50 to-purple-100 text-purple-900 border-purple-200"
        />
        <StatCard
          icon={Calendar}
          label="On Leave"
          value={summary.total_on_leave || 0}
          status="on_leave"
          color="bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-900 border-yellow-200"
        />
      </div>

      {isHRorAdmin && (
        <>
          <ExportMonthlyAttendance
            departments={departments}
            departmentsLoading={isDepartmentsLoading}
            title="Export Monthly Attendance"
            description="Download attendance data in CSV format"
          />
          <UploadRevisedAttendance
            title="Upload Revised Attendance"
            description="Upload approved/revised attendance CSV for a month"
          />
        </>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Attendance Records</h2>
            {filterStatus && (
              <p className="text-sm text-gray-600 mt-1">
                Filtered by: <span className="font-medium capitalize text-blue-600">{filterStatus.replace("_", " ")}</span>
                <button
                  onClick={() => setFilterStatus("")}
                  className="ml-2 text-xs text-blue-600 hover:text-blue-700 underline font-medium"
                >
                  Clear
                </button>
              </p>
            )}
          </div>
          <span className="text-sm text-gray-600 font-medium">{records.length} records found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Punch In</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Punch Out</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Punch Location</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User Remark</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">HR Remark</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Selfie</th>
                {isHRorAdmin && <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={isHRorAdmin ? 12 : 11} className="px-6 py-8 text-center text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                records.map((rec, index) => {
                  const checkinDate = parseDateSafe(rec.checkin_time);
                  const checkoutDate = parseDateSafe(rec.checkout_time);
                  const displayDate = parseDateSafe(rec.date);

                  return (
                    <motion.tr
                      key={rec.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-4 py-4">
                        <div 
                          className="flex items-center gap-3 cursor-pointer hover:opacity-75 transition-opacity"
                          onClick={() => navigate(`/employee-monthly-attendance/${rec.employee_id}/${format(parseDateSafe(rec.date) || new Date(), "yyyy-MM")}`)}
                        >
                          <img
                            src={rec.employee?.photo_url || "https://via.placeholder.com/40"}
                            alt={rec.employee?.full_name}
                            className="w-8 h-8 rounded-full object-cover border border-gray-100"
                          />
                          <div>
                            <div className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                              {rec.employee?.full_name || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">{rec.employee_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {displayDate ? format(displayDate, "MMM dd, yyyy") : rec.date}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {checkinDate ? format(checkinDate, "hh:mm a") : "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {checkoutDate ? format(checkoutDate, "hh:mm a") : "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 truncate max-w-[150px]" title={rec.checkin_address}>
                        {rec.checkin_address || "-"}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(rec.attendance_status)}`}>
                          {rec.attendance_status ? rec.attendance_status.replace("_", " ") : "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 truncate max-w-[120px]" title={rec.user_remark}>
                        {rec.user_remark || "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 truncate max-w-[120px]" title={rec.remark}>
                        {rec.remark || "-"}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                          rec.is_manual ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                        }`}>
                          {rec.is_manual ? "Manual" : "Auto"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {rec.selfie ? (
                          <a
                            href={`https://tasksuite.truckmitr.com/backend/public/storage/${rec.selfie}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 font-semibold"
                          >
                            Selfie
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">No selfie</span>
                        )}
                      </td>
                      {isHRorAdmin && (
                        <td className="px-4 py-4">
                          {rec.id && !String(rec.id).startsWith("absent-") && (
                            <>
                              {(isSuperAdmin || String(rec.employee_id) !== String(user.emp_id)) && (
                                <button
                                  onClick={() => handleEditClick(rec)}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="Edit Attendance"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
                        </td>
                      )}
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && editingRecord && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Edit Attendance</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {editingRecord.employee?.full_name} - {format(parseDateSafe(editingRecord.date) || new Date(), "MMM dd, yyyy")}
                  </p>
                </div>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Punch In Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={checkInInput}
                    onChange={e => setCheckInInput(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Punch Out Time</label>
                  <input
                    type="time"
                    value={checkOutInput}
                    onChange={e => setCheckOutInput(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={statusInput}
                    onChange={e => setStatusInput(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="wfh">Work From Home</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Remark <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={remarkInput}
                    onChange={e => setRemarkInput(e.target.value)}
                    placeholder="Reason for update (minimum 3 characters)"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">{remarkInput.length}/3 characters minimum</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800 leading-normal">
                    <strong>Note:</strong> This action will be logged. The remark will be appended to the record.
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSubmit}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isUpdating ? "Updating..." : "Update Attendance"}
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
