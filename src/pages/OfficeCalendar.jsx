import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Check, X, Edit, Trash2, Calendar, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  useCalendars,
  useCreateCalendar,
  useUpdateCalendar,
  useDeleteCalendar,
  useActivateCalendar
} from '../hooks/useOfficeCalendar'

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEK_DAYS = [
  { value: "Sunday", label: "Sunday" },
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" }
];
const OFF_TYPES = ["FULL", "HALF"];
const HOLIDAY_TYPES = ["PUBLIC", "FESTIVAL", "OPTIONAL"];

const formatDate = (dateStr) => {
  try {
    if (!dateStr) return "";
    let date;
    if (dateStr.includes("T")) date = new Date(dateStr);
    else if (dateStr.includes("-")) {
      const [year, month, day] = dateStr.split("-");
      date = new Date(`${year}-${month}-${day}T00:00:00Z`);
    } else return dateStr;
    
    return isNaN(date.getTime()) ? dateStr : date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch {
    return dateStr;
  }
};

const formatDateTime = (dateStr) => {
  try {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  } catch {
    return dateStr;
  }
};

const getDayLabel = (day) => {
  if (typeof day === 'number') return DAYS_OF_WEEK[day] || '';
  if (typeof day === 'string') {
    if (!isNaN(day)) return DAYS_OF_WEEK[parseInt(day, 10)] || '';
    return day;
  }
  return '';
};

const getDayValue = (day) => {
  if (typeof day === 'number') return day;
  if (typeof day === 'string') {
    if (!isNaN(day)) return parseInt(day, 10);
    const index = DAYS_OF_WEEK.indexOf(day);
    return index !== -1 ? index : 0;
  }
  return 0;
};

const EmptyState = ({ onCreateClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-12 text-center h-full flex flex-col justify-center"
  >
    <div className="flex justify-center mb-6">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-200 rounded-full blur-xl opacity-30" />
        <Calendar className="w-20 h-20 text-blue-600 relative" />
      </div>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Calendar Selected</h3>
    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
      Select a calendar from the list on the left to view its details, or create a new one to get started.
    </p>
    <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
      <button
        onClick={onCreateClick}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        <Plus className="w-5 h-5" />
        New Calendar
      </button>
    </div>
  </motion.div>
);

const CalendarForm = ({ calendar, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    calendar_name: "",
    year: new Date().getFullYear(),
    is_active: false,
    pl: 12,
    cl: 6,
    sl: 6,
    weekly_offs: [],
    holidays: []
  });
  const [weeklyOffInput, setWeeklyOffInput] = useState({
    day_of_week: "Sunday",
    off_type: "FULL"
  });
  const [holidayInput, setHolidayInput] = useState({
    holiday_date: "",
    holiday_name: "",
    holiday_type: "PUBLIC",
    is_paid: true
  });

  useEffect(() => {
    if (calendar) {
      setFormData({
        calendar_name: calendar.calendar_name,
        year: calendar.year,
        is_active: calendar.is_active || false,
        pl: calendar.leave_policy?.pl || 12,
        cl: calendar.leave_policy?.cl || 10,
        sl: calendar.leave_policy?.sl || 8,
        weekly_offs: calendar.weekly_offs || [],
        holidays: calendar.holidays || []
      });
    }
  }, [calendar]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "year" ? parseInt(value, 10) : value
    }));
  };

  const handleAddWeeklyOff = () => {
    const day = weeklyOffInput.day_of_week;
    if (formData.weekly_offs.some((off) => getDayLabel(off.day_of_week) === getDayLabel(day))) {
      toast.error("This day already has a weekly off");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      weekly_offs: [
        ...prev.weekly_offs,
        {
          day_of_week: getDayValue(day),
          off_type: weeklyOffInput.off_type
        }
      ]
    }));
    setWeeklyOffInput({
      day_of_week: "Sunday",
      off_type: "FULL"
    });
  };

  const handleRemoveWeeklyOff = (index) => {
    setFormData((prev) => ({
      ...prev,
      weekly_offs: prev.weekly_offs.filter((_, i) => i !== index)
    }));
  };

  const handleAddHoliday = () => {
    if (!holidayInput.holiday_date || !holidayInput.holiday_name) {
      toast.error("Please fill in all holiday fields");
      return;
    }
    if (formData.holidays.some((h) => h.holiday_date === holidayInput.holiday_date)) {
      toast.error("Holiday already exists for this date");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      holidays: [
        ...prev.holidays,
        {
          ...holidayInput
        }
      ]
    }));
    setHolidayInput({
      holiday_date: "",
      holiday_name: "",
      holiday_type: "PUBLIC",
      is_paid: true
    });
  };

  const handleRemoveHoliday = (index) => {
    setFormData((prev) => ({
      ...prev,
      holidays: prev.holidays.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.calendar_name) {
      toast.error("Please fill in calendar name");
      return;
    }
    if (!formData.year) {
      toast.error("Please fill in year");
      return;
    }
    
    // Convert day_of_week to integer before sending
    const cleanedWeeklyOffs = formData.weekly_offs.map(off => ({
      ...off,
      day_of_week: getDayValue(off.day_of_week)
    }));

    onSubmit({
      ...formData,
      weekly_offs: cleanedWeeklyOffs
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {calendar ? "Edit Calendar" : "Create New Calendar"}
        </h2>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calendar Name *</label>
              <input
                type="text"
                name="calendar_name"
                value={formData.calendar_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 2025 Office Calendar"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700">Calendar Status</label>
              <p className="text-xs text-gray-600 mt-1">
                {formData.is_active ? "This calendar is active" : "This calendar is inactive"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${formData.is_active ? "bg-green-600" : "bg-gray-300"}`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${formData.is_active ? "translate-x-7" : "translate-x-1"}`} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Leave Policy</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paid Leave (PL) *</label>
              <input
                type="number"
                name="pl"
                value={formData.pl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Casual Leave (CL) *</label>
              <input
                type="number"
                name="cl"
                value={formData.cl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sick Leave (SL) *</label>
              <input
                type="number"
                name="sl"
                value={formData.sl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Weekly Offs</h3>
            {formData.weekly_offs.length > 0 && (
              <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {formData.weekly_offs.length} added
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <select
              value={weeklyOffInput.day_of_week}
              onChange={e => setWeeklyOffInput({ ...weeklyOffInput, day_of_week: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              {WEEK_DAYS.map(v => (
                <option key={v.value} value={v.value}>{v.label}</option>
              ))}
            </select>
            <select
              value={weeklyOffInput.off_type}
              onChange={e => setWeeklyOffInput({ ...weeklyOffInput, off_type: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              {OFF_TYPES.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddWeeklyOff}
              className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-2">
            {formData.weekly_offs.map((v, g) => (
              <div key={g} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-sm text-gray-700">
                  {getDayLabel(v.day_of_week)} - {v.off_type}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveWeeklyOff(g)}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Holidays</h3>
            {formData.holidays.length > 0 && (
              <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {formData.holidays.length} added
              </span>
            )}
          </div>
          <div className="space-y-2">
            <input
              type="date"
              value={holidayInput.holiday_date}
              onChange={e => setHolidayInput({ ...holidayInput, holiday_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
            <input
              type="text"
              value={holidayInput.holiday_name}
              onChange={e => setHolidayInput({ ...holidayInput, holiday_name: e.target.value })}
              placeholder="Holiday name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
            <div className="flex gap-2">
              <select
                value={holidayInput.holiday_type}
                onChange={e => setHolidayInput({ ...holidayInput, holiday_type: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                {HOLIDAY_TYPES.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={holidayInput.is_paid}
                  onChange={e => setHolidayInput({ ...holidayInput, is_paid: e.target.checked })}
                />
                Paid
              </label>
            </div>
            <button
              type="button"
              onClick={handleAddHoliday}
              className="w-full px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Holiday
            </button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {formData.holidays.map((v, g) => (
              <div key={g} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{v.holiday_name}</p>
                  <p className="text-gray-600">{formatDate(v.holiday_date)} - {v.holiday_type}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveHoliday(g)}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Saving..." : calendar ? "Update Calendar" : "Create Calendar"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const CalendarDetails = ({ calendar, onEdit, onDelete, onActivate, isDeleting, isActivating }) => {
  return calendar ? (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-base font-bold text-slate-900">{calendar.calendar_name}</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Year: {calendar.year}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ring-1 ring-inset ${calendar.is_active ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-amber-50 text-amber-700 ring-amber-200"}`}>
            {calendar.is_active ? "Active" : "Inactive"}
          </span>
          <div className="flex gap-2">
            {!calendar.is_active && (
              <button
                onClick={onActivate}
                disabled={isActivating}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                Activate
              </button>
            )}
            <button
              onClick={onEdit}
              className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 text-slate-600"
              title="Edit Calendar"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="p-1.5 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200 text-rose-600 disabled:opacity-50"
              title="Delete Calendar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-6 max-h-[550px] overflow-y-auto">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50/70 rounded-xl p-3 text-center border border-slate-200/60">
            <p className="text-xl font-bold text-slate-900">{calendar.year}</p>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">Year</p>
          </div>
          <div className="bg-slate-50/70 rounded-xl p-3 text-center border border-slate-200/60">
            <p className="text-xl font-bold text-slate-900">{calendar.weekly_offs?.length || 0}</p>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">Weekly Offs</p>
          </div>
          <div className="bg-amber-50/60 rounded-xl p-3 text-center border border-amber-200/60">
            <p className="text-xl font-bold text-amber-800">{calendar.holidays?.length || 0}</p>
            <p className="text-[11px] font-medium text-amber-700 mt-0.5">Holidays</p>
          </div>
        </div>

        {calendar.leave_policy && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50/60 rounded-xl p-3 text-center border border-emerald-200/60">
              <p className="text-xl font-bold text-emerald-800">{calendar.leave_policy.pl}</p>
              <p className="text-[11px] font-medium text-emerald-700 mt-0.5">Paid Leave (PL)</p>
            </div>
            <div className="bg-blue-50/60 rounded-xl p-3 text-center border border-blue-200/60">
              <p className="text-xl font-bold text-blue-800">{calendar.leave_policy.cl}</p>
              <p className="text-[11px] font-medium text-blue-700 mt-0.5">Casual Leave (CL)</p>
            </div>
            <div className="bg-purple-50/60 rounded-xl p-3 text-center border border-purple-200/60">
              <p className="text-xl font-bold text-purple-800">{calendar.leave_policy.sl}</p>
              <p className="text-[11px] font-medium text-purple-700 mt-0.5">Sick Leave (SL)</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
          {calendar.is_active ? (
            <>
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">Active Calendar</p>
                <p className="text-xs text-slate-500 font-medium">This calendar is currently active company-wide</p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">Inactive Calendar</p>
                <p className="text-xs text-slate-500 font-medium">Click Activate to apply this calendar</p>
              </div>
            </>
          )}
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-3">Weekly Offs</h3>
          {calendar.weekly_offs && calendar.weekly_offs.length > 0 ? (
            <div className="space-y-2">
              {calendar.weekly_offs.map((u, d) => (
                <div key={d} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm text-gray-700">
                    {getDayLabel(u.day_of_week)} - {u.off_type}
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    {u.off_type === "FULL" ? "Full Day" : "Half Day"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No weekly offs configured</p>
          )}
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-3">
            Holidays ({calendar.holidays?.length || 0})
          </h3>
          {calendar.holidays && calendar.holidays.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {calendar.holidays.map((u, d) => (
                <div key={d} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{u.holiday_name}</p>
                      <p className="text-sm text-gray-600 mt-1">{formatDate(u.holiday_date)}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {u.holiday_type}
                        </span>
                        {u.is_paid && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Paid
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No holidays configured</p>
          )}
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Created:</span>
            <span className="text-gray-900 font-medium">{formatDateTime(calendar.created_at)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Updated:</span>
            <span className="text-gray-900 font-medium">{formatDateTime(calendar.updated_at)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  ) : null;
};

// Sample fallback calendar data
const SAMPLE_CALENDARS = [
  {
    id: 1,
    calendar_name: '2026 Official Calendar',
    year: 2026,
    is_active: true,
    leave_policy: { pl: 12, cl: 8, sl: 8 },
    weekly_offs: [
      { day_of_week: 'Sunday', off_type: 'FULL' }
    ],
    holidays: [
      { id: 1, holiday_name: 'New Year', holiday_date: '2026-01-01', holiday_type: 'PUBLIC', is_paid: true },
      { id: 2, holiday_name: 'Republic Day', holiday_date: '2026-01-26', holiday_type: 'PUBLIC', is_paid: true },
      { id: 3, holiday_name: 'Independence Day', holiday_date: '2026-08-15', holiday_type: 'PUBLIC', is_paid: true },
      { id: 4, holiday_name: 'Gandhi Jayanti', holiday_date: '2026-10-02', holiday_type: 'PUBLIC', is_paid: true },
      { id: 5, holiday_name: 'Diwali', holiday_date: '2026-11-08', holiday_type: 'FESTIVAL', is_paid: true }
    ],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  }
];

const OfficeCalendar = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [editingCalendar, setEditingCalendar] = useState(null);

  const { data: rawCalendars, isLoading } = useCalendars();
  const createMutation = useCreateCalendar();
  const updateMutation = useUpdateCalendar();
  const deleteMutation = useDeleteCalendar();
  const activateMutation = useActivateCalendar();

  const calendars = (Array.isArray(rawCalendars) && rawCalendars.length > 0)
    ? rawCalendars
    : SAMPLE_CALENDARS;

  useEffect(() => {
    if (calendars.length > 0 && !selectedCalendar) {
      const active = calendars.find(c => c.is_active) || calendars[0];
      setSelectedCalendar(active);
    }
  }, [calendars, selectedCalendar]);

  const handleCreate = async (data) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Calendar created successfully");
      setIsFormOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create calendar");
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateMutation.mutateAsync({
        id: editingCalendar.id,
        data: data
      });
      toast.success("Calendar updated successfully");
      setEditingCalendar(null);
      setIsFormOpen(false);
      if (selectedCalendar?.id === editingCalendar.id) {
        setSelectedCalendar({ ...selectedCalendar, ...data });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update calendar");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this calendar?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Calendar deleted successfully");
        if (selectedCalendar?.id === id) {
          setSelectedCalendar(null);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete calendar");
      }
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateMutation.mutateAsync(id);
      toast.success("Calendar activated successfully");
      if (selectedCalendar?.id === id) {
        setSelectedCalendar(prev => ({ ...prev, is_active: true }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to activate calendar");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-800" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="border-b border-slate-200/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-1">
            Workplace
          </p>
          <h1 className="font-sans text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            Office Calendar
          </h1>
          <p className="text-xs sm:text-sm font-normal text-slate-500 mt-1">
            Configure yearly calendars, company holidays, and weekly off policies
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCalendar(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 shadow-sm"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          New Calendar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Selection List */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Calendars ({calendars.length})</h2>
            </div>
            <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
              {calendars.map((calendar) => {
                const isSelected = selectedCalendar?.id === calendar.id;
                return (
                  <div
                    key={calendar.id}
                    onClick={() => {
                      setSelectedCalendar(calendar);
                      setIsFormOpen(false);
                    }}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-slate-50 border-l-4 border-slate-900"
                        : "hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900">{calendar.calendar_name}</h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">Year {calendar.year}</p>
                      </div>
                      {calendar.is_active && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="bg-slate-100/70 rounded-lg px-2.5 py-1.5 text-center">
                        <p className="text-sm font-bold text-slate-800">{calendar.weekly_offs?.length || 0}</p>
                        <p className="text-[10px] font-medium text-slate-500">Weekly Offs</p>
                      </div>
                      <div className="bg-amber-50/70 rounded-lg px-2.5 py-1.5 text-center">
                        <p className="text-sm font-bold text-amber-800">{calendar.holidays?.length || 0}</p>
                        <p className="text-[10px] font-medium text-amber-700">Holidays</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
        
        {/* Calendar Details / Form Panel */}
        <div className="lg:col-span-2">
          {isFormOpen ? (
            <CalendarForm
              calendar={editingCalendar}
              onSubmit={editingCalendar ? handleUpdate : handleCreate}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingCalendar(null);
              }}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          ) : selectedCalendar ? (
            <CalendarDetails
              calendar={selectedCalendar}
              onEdit={() => {
                setEditingCalendar(selectedCalendar);
                setIsFormOpen(true);
              }}
              onDelete={() => handleDelete(selectedCalendar.id)}
              onActivate={() => handleActivate(selectedCalendar.id)}
              isDeleting={deleteMutation.isPending}
              isActivating={activateMutation.isPending}
            />
          ) : (
            <EmptyState
              onCreateClick={() => {
                setEditingCalendar(null);
                setIsFormOpen(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficeCalendar;
