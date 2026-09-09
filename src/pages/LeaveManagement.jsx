import { useState } from 'react'
import {
  Calendar,
  Plus,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Umbrella,
  Stethoscope,
  Plane,
  Heart,
  Search,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'


export default function LeaveManagement() {
  const [activeTab, setActiveTab] = useState('leave-requests')
  const [selectedMonth, setSelectedMonth] = useState('May 2024')
  const [calendarDate, setCalendarDate] = useState(new Date(2024, 4, 1))
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [searchTerm, setSearchTerm] = useState('')
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

  // Apply Leave Form state
  const [newLeave, setNewLeave] = useState({
    leaveType: 'Casual Leave',
    fromDate: '',
    toDate: '',
    reason: '',
  })

  // Sample Leave Requests
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, empId: 'EMP001', name: 'Rahul Sharma', leaveType: 'Casual Leave', typeBadge: 'bg-emerald-100/80 text-emerald-700 border-emerald-200', fromDate: '20 May 2024', toDate: '21 May 2024', days: 2, reason: 'Family function', status: 'Approved', statusBadge: 'bg-emerald-100/70 text-emerald-700 border-emerald-200' },
    { id: 2, empId: 'EMP002', name: 'Priya Singh', leaveType: 'Sick Leave', typeBadge: 'bg-amber-100/80 text-amber-700 border-amber-200', fromDate: '17 May 2024', toDate: '17 May 2024', days: 1, reason: 'Fever and cold', status: 'Approved', statusBadge: 'bg-emerald-100/70 text-emerald-700 border-emerald-200' },
    { id: 3, empId: 'EMP003', name: 'Amit Kumar', leaveType: 'Privilege Leave', typeBadge: 'bg-purple-100/80 text-purple-700 border-purple-200', fromDate: '28 May 2024', toDate: '31 May 2024', days: 4, reason: 'Vacation', status: 'Pending', statusBadge: 'bg-amber-100/70 text-amber-700 border-amber-200' },
    { id: 4, empId: 'EMP004', name: 'Sneha Patel', leaveType: 'Casual Leave', typeBadge: 'bg-emerald-100/80 text-emerald-700 border-emerald-200', fromDate: '24 May 2024', toDate: '24 May 2024', days: 1, reason: 'Personal work', status: 'Rejected', statusBadge: 'bg-rose-100/70 text-rose-700 border-rose-200' },
    { id: 5, empId: 'EMP005', name: 'Ankit Verma', leaveType: 'Sick Leave', typeBadge: 'bg-amber-100/80 text-amber-700 border-amber-200', fromDate: '16 May 2024', toDate: '18 May 2024', days: 3, reason: 'Not feeling well', status: 'Approved', statusBadge: 'bg-emerald-100/70 text-emerald-700 border-emerald-200' },
  ])

  // Filter requests
  const filteredRequests = leaveRequests.filter(req => {
    const matchesStatus = statusFilter === 'All Status' || req.status === statusFilter
    const matchesSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.leaveType.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleDeleteRequest = (id) => {
    setLeaveRequests(leaveRequests.filter(r => r.id !== id))
    toast.success('Leave request removed')
  }

  const handleApplySubmit = (e) => {
    e.preventDefault()
    if (!newLeave.fromDate || !newLeave.toDate || !newLeave.reason) {
      toast.error('Please fill all required fields')
      return
    }

    const created = {
      id: Date.now(),
      empId: 'EMP001',
      name: 'Aditya Tiwari',
      leaveType: newLeave.leaveType,
      typeBadge: newLeave.leaveType === 'Sick Leave' ? 'bg-amber-100/80 text-amber-700 border-amber-200' :
                 newLeave.leaveType === 'Privilege Leave' ? 'bg-purple-100/80 text-purple-700 border-purple-200' :
                 'bg-emerald-100/80 text-emerald-700 border-emerald-200',
      fromDate: newLeave.fromDate,
      toDate: newLeave.toDate,
      days: 1,
      reason: newLeave.reason,
      status: 'Pending',
      statusBadge: 'bg-amber-100/70 text-amber-700 border-amber-200',
    }

    setLeaveRequests([created, ...leaveRequests])
    setIsApplyModalOpen(false)
    setNewLeave({ leaveType: 'Casual Leave', fromDate: '', toDate: '', reason: '' })
    toast.success('Leave application submitted successfully!')
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-50 min-h-screen">
      {/* Header section with Title & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Leave Management</h1>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-gray-700">Leave</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Apply Leave</span>
          </button>
        </div>
      </div>

      {/* Top 4 Summary Leave Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Leave Balance */}
        <div 
          onClick={() => setStatusFilter('All Status')}
          className="bg-white rounded-xl p-4 md:p-5 border border-gray-200 shadow-xs hover:border-blue-500 hover:shadow-md transition-all flex items-start justify-between cursor-pointer group"
        >
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">Total Leave Balance</p>
            <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
              24.5 <span className="text-xs font-semibold text-gray-400">Days</span>
            </p>
            <p className="text-[11px] font-medium text-gray-400">All Types</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50/80 border border-blue-100/80 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Casual Leave Balance */}
        <div 
          onClick={() => setSearchTerm(searchTerm === 'Casual Leave' ? '' : 'Casual Leave')}
          className="bg-white rounded-xl p-4 md:p-5 border border-gray-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex items-start justify-between cursor-pointer group"
        >
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">Casual Leave Balance</p>
            <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
              12.5 <span className="text-xs font-semibold text-gray-400">Days</span>
            </p>
            <p className="text-[11px] font-medium text-gray-400">of 18 Days</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50/80 border border-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <Umbrella className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Sick Leave Balance */}
        <div 
          onClick={() => setSearchTerm(searchTerm === 'Sick Leave' ? '' : 'Sick Leave')}
          className="bg-white rounded-xl p-4 md:p-5 border border-gray-200 shadow-xs hover:border-amber-500 hover:shadow-md transition-all flex items-start justify-between cursor-pointer group"
        >
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider group-hover:text-amber-600 transition-colors">Sick Leave Balance</p>
            <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
              7 <span className="text-xs font-semibold text-gray-400">Days</span>
            </p>
            <p className="text-[11px] font-medium text-gray-400">of 12 Days</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50/80 border border-amber-100/80 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <Stethoscope className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Privilege Leave Balance */}
        <div 
          onClick={() => setSearchTerm(searchTerm === 'Privilege Leave' ? '' : 'Privilege Leave')}
          className="bg-white rounded-xl p-4 md:p-5 border border-gray-200 shadow-xs hover:border-purple-500 hover:shadow-md transition-all flex items-start justify-between cursor-pointer group"
        >
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider group-hover:text-purple-600 transition-colors">Privilege Leave Balance</p>
            <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
              5 <span className="text-xs font-semibold text-gray-400">Days</span>
            </p>
            <p className="text-[11px] font-medium text-gray-400">of 15 Days</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50/80 border border-purple-100/80 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <Plane className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Leave Table Container Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        {/* Navigation Tabs Bar & Filter Header */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Sub Navigation Tabs */}
          <div className="flex gap-4 overflow-x-auto text-xs font-semibold w-full sm:w-auto">
            {[
              { id: 'leave-requests', label: 'Leave Requests' },
              { id: 'team-leaves', label: 'Team Leaves' },
              { id: 'leave-calendar', label: 'Leave Calendar' },
              { id: 'leave-balance', label: 'Leave Balance' },
            ].map(tb => (
              <button
                key={tb.id}
                onClick={() => setActiveTab(tb.id)}
                className={`pb-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tb.id
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {tb.label}
              </button>
            ))}
          </div>

          {/* Controls: Search, Status Filter & Month Picker */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <div className="relative w-44">
              <input
                type="text"
                placeholder="Search employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50/50"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="All Status">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 font-medium">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="May 2024">May 2024</option>
                <option value="April 2024">April 2024</option>
                <option value="March 2024">March 2024</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                <th className="py-3 px-4">EMPLOYEE</th>
                <th className="py-3 px-4">LEAVE TYPE</th>
                <th className="py-3 px-4">FROM DATE</th>
                <th className="py-3 px-4">TO DATE</th>
                <th className="py-3 px-4">DAYS</th>
                <th className="py-3 px-4">REASON</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors whitespace-nowrap">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-bold text-slate-900">{req.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{req.empId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${req.typeBadge}`}>
                        {req.leaveType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{req.fromDate}</td>
                    <td className="py-3 px-4 text-slate-600">{req.toDate}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{req.days}</td>
                    <td className="py-3 px-4 text-slate-600">{req.reason}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${req.statusBadge}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => toast.success(`Viewing details for ${req.name}`)}
                          className="p-1 text-gray-400 hover:text-blue-600 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {req.status === 'Pending' && (
                          <button
                            onClick={() => handleDeleteRequest(req.id)}
                            className="p-1 text-gray-400 hover:text-rose-600 rounded"
                            title="Delete Request"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-xs text-gray-400">
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid Section: Leave Calendar (Span 6) + Leave Types Donut Breakdown (Span 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leave Calendar Mini Widget */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Leave Calendar</h3>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
              <button 
                onClick={() => setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded transition-colors text-gray-600 font-bold"
              >
                &lt;
              </button>
              <span className="px-1 text-gray-900">{format(calendarDate, 'MMMM yyyy')}</span>
              <button 
                onClick={() => setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded transition-colors text-gray-600 font-bold"
              >
                &gt;
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center my-auto py-1">
            {/* Mini Calendar Grid */}
            <div className="md:col-span-7 border border-gray-100 rounded-xl p-3 bg-gray-50/40">
              <div className="grid grid-cols-7 text-center text-[10px] font-bold text-gray-400 mb-2">
                <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
              </div>
              <div className="grid grid-cols-7 text-center text-xs font-medium gap-y-3.5 text-gray-700">
                <span className="text-gray-300 py-1">29</span>
                <span className="text-gray-300 py-1">30</span>
                <span className="py-1">1</span><span className="py-1">2</span><span className="py-1">3</span><span className="py-1">4</span><span className="py-1">5</span>
                <span className="py-1">6</span><span className="py-1">7</span><span className="py-1">8</span><span className="py-1">9</span><span className="py-1">10</span><span className="py-1">11</span><span className="py-1">12</span>
                <span className="py-1">13</span><span className="py-1">14</span><span className="py-1">15</span><span className="py-1">16</span>
                <span className="relative font-bold text-emerald-600 py-1 flex flex-col items-center justify-center">
                  17
                  <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mt-0.5" />
                </span>
                <span className="relative font-bold text-emerald-600 py-1 flex flex-col items-center justify-center">
                  18
                  <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mt-0.5" />
                </span>
                <span className="py-1">19</span>
                <span className="relative font-bold text-blue-600 py-1 flex flex-col items-center justify-center">
                  20
                  <span className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-0.5" />
                </span>
                <span className="relative font-bold text-blue-600 py-1 flex flex-col items-center justify-center">
                  21
                  <span className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-0.5" />
                </span>
                <span className="py-1">22</span><span className="py-1">23</span><span className="py-1">24</span><span className="py-1">25</span><span className="py-1">26</span>
                <span className="relative font-bold text-amber-600 py-1 flex flex-col items-center justify-center">
                  27
                  <span className="h-1.5 w-1.5 bg-amber-500 rounded-full mt-0.5" />
                </span>
                <span className="relative font-bold text-purple-600 py-1 flex flex-col items-center justify-center">
                  28
                  <span className="h-1.5 w-1.5 bg-purple-500 rounded-full mt-0.5" />
                </span>
                <span className="py-1">29</span><span className="py-1">30</span><span className="py-1">31</span>
              </div>
            </div>

            {/* Calendar Legend & Details */}
            <div className="md:col-span-5 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-gray-800 font-medium">Approved Leave</span>
                </div>
                <span className="font-bold text-gray-900">2 Days</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-gray-800 font-medium">Pending Leave</span>
                </div>
                <span className="font-bold text-gray-900">1 Day</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-purple-500 shrink-0" />
                  <span className="text-gray-800 font-medium">Other Leaves</span>
                </div>
                <span className="font-bold text-gray-900">1 Day</span>
              </div>
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-gray-300 shrink-0" />
                  <span className="text-gray-800 font-medium">Weekend</span>
                </div>
                <span className="font-bold text-gray-400">Sun Only</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Upcoming Holiday: <strong className="text-gray-800 font-bold">15 Aug (Independence Day)</strong></span>
            <span>Work Days: <strong className="text-gray-800 font-bold">26 Days</strong></span>
          </div>
        </div>

        {/* Leave Types Donut Breakdown Card */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Leave Types Breakdown</h3>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Annual Quota: 35 Days
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-auto py-2">
            {/* SVG Donut Ring */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center w-40 h-40">
                <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
                  {/* Total C = 2 * π * 58 ≈ 364.42 */}
                  {/* Casual Leave: 51.4% -> 187.3 */}
                  <circle cx="80" cy="80" r="58" stroke="#10b981" strokeWidth="16" fill="transparent" strokeDasharray="187.3 177.1" strokeDashoffset="0" />
                  {/* Sick Leave: 34.3% -> 125.0 */}
                  <circle cx="80" cy="80" r="58" stroke="#f59e0b" strokeWidth="16" fill="transparent" strokeDasharray="125.0 239.4" strokeDashoffset="-187.3" />
                  {/* Privilege Leave: 42.9% -> 156.3 */}
                  <circle cx="80" cy="80" r="58" stroke="#8b5cf6" strokeWidth="16" fill="transparent" strokeDasharray="156.3 208.1" strokeDashoffset="-312.3" />
                  {/* Maternity Leave: 28.6% -> 104.2 */}
                  <circle cx="80" cy="80" r="58" stroke="#2563eb" strokeWidth="16" fill="transparent" strokeDasharray="104.2 260.2" strokeDashoffset="-468.6" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-extrabold text-gray-900 leading-none">35</span>
                  <span className="text-[11px] font-semibold text-gray-500 mt-1">Total Days</span>
                </div>
              </div>
            </div>

            {/* Leave Breakdown Stats */}
            <div className="md:col-span-7 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-semibold text-gray-800">Casual Leave</span>
                </div>
                <span className="text-emerald-700 font-bold">18 Days (51.4%)</span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                  <span className="font-semibold text-gray-800">Sick Leave</span>
                </div>
                <span className="text-amber-700 font-bold">12 Days (34.3%)</span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-purple-500 shrink-0" />
                  <span className="font-semibold text-gray-800">Privilege Leave</span>
                </div>
                <span className="text-purple-700 font-bold">15 Days (42.9%)</span>
              </div>

              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0" />
                  <span className="font-semibold text-gray-800">Maternity Leave</span>
                </div>
                <span className="text-blue-700 font-bold">10 Days (28.6%)</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Used: <strong className="text-gray-800 font-bold">14 Days</strong></span>
            <span>Remaining: <strong className="text-emerald-600 font-bold">21 Days</strong></span>
          </div>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 backdrop-blur-xs p-4"
          onClick={() => setIsApplyModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Apply for Leave</h3>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Leave Type</label>
                <select
                  value={newLeave.leaveType}
                  onChange={(e) => setNewLeave({ ...newLeave, leaveType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Privilege Leave">Privilege Leave</option>
                  <option value="WFH Request">WFH Request</option>
                  <option value="Short Leave">Short Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">From Date</label>
                  <input
                    type="date"
                    value={newLeave.fromDate}
                    onChange={(e) => setNewLeave({ ...newLeave, fromDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">To Date</label>
                  <input
                    type="date"
                    value={newLeave.toDate}
                    onChange={(e) => setNewLeave({ ...newLeave, toDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Reason</label>
                <textarea
                  rows="3"
                  placeholder="Reason for leave application..."
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
